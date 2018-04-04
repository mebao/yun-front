import { Component, OnInit }                from '@angular/core';
import { Router, ActivatedRoute }           from '@angular/router';

import { AdminService }                     from '../../admin.service';

import { ToastService }                     from '../../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }           from '../../../common/nll-toast/toast-model';

@Component({
	selector: 'app-booking-info',
	templateUrl: './booking-info.component.html',
})
export class BookingInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	//权限
	moduleAuthority: {
		see: boolean,
		info: boolean,
		add: boolean,
		update: boolean,
	}
	loadingShow: boolean;
	url: string;
	id: string;
	booking: {
		age: string,
		bookingDate: string,
		bookingId: string,
		childId: string,
		childName: string,
		creatorId: string,
		creatorName: string,
		refNo: string,
		serviceId: string,
		serviceName: string,
		time: string,
		type: string,
		userDoctorId: string,
		userDoctorName: string,
		services: any[],
		fees: any[],
		status: string,
		statusText: string,
		totalFee: string,
		remark: string,
		tranInfo: any,
		yyj: any;
		backFee: string,
		backRemark: string,
		refereeId: string,
		refereeName: string,
	};
	canEdit: boolean;
	selectorBooking: {
		bookingId: string,
		text: string,
		cancel_cause: string,
		type: string,
	}
	modalConfirmTab: boolean;
	// 退还预约金
	modalBackBookingFee: boolean;
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
        private toastService: ToastService,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '预约详情',
			back: true,
		}

		//权限
		this.moduleAuthority = {
			see: false,
			info: false,
			add: false,
			update: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.booking = {
			age: '',
			bookingDate: '',
			bookingId: '',
			childId: '',
			childName: '',
			creatorId: '',
			creatorName: '',
			refNo: '',
			serviceId: '',
			serviceName: '',
			time: '',
			type: '',
			userDoctorId: '',
			userDoctorName: '',
			services: [],
			fees: [],
			status: '',
			statusText: '',
			totalFee: '',
			remark: '',
			tranInfo: {},
			yyj: {},
			backFee: '',
			backRemark: '',
			refereeId: '',
			refereeName: '',
		};
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
		})

		this.loadingShow = true;

		this.getBooking('');

		this.selectorBooking = {
			bookingId: '',
			text: '',
			cancel_cause: '',
			type: '',
		}
		this.modalConfirmTab = false;
		this.btnCanEdit = false;
	}

	getBooking(type) {
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if((new Date().getTime() - 24*60*60*1000) > new Date(results.weekbooks[0].bookingDate).getTime()){
					this.canEdit = false;
				}else{
					this.canEdit = true;
				}
				this.booking = results.weekbooks[0];
				var fees = results.weekbooks[0].fees;
				var total = 0;
				if(fees.length > 0){
					for(var i = 0; i < fees.length; i++){
						total += Number(fees[i].fee);
					}
				}
				this.booking.totalFee = total.toString();
				this.loadingShow = false;
				if(type == 'booking'){
					const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '预约单取消成功', 3000);
					this.toastService.toast(toastCfg);
				}else if(type == 'status'){
					const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '取消登记成功', 3000);
					this.toastService.toast(toastCfg);
				}else if(type == 'backBookingFee'){
					const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '金额退还成功', 3000);
					this.toastService.toast(toastCfg);
				}
			}
		}).catch(() => {
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	updateBooking() {
		this.router.navigate(['./admin/booking'], {queryParams: {id: this.id, type: 'update'}});
	}

	cancel(_type) {
		this.selectorBooking = {
			bookingId: this.booking.bookingId,
			text: '确认取消该预约',
			cancel_cause: '',
			type: _type,
		}
		this.modalConfirmTab = true;
	}

	// 取消预约
	closeConfirm() {
		this.modalConfirmTab = false;
	}

	// 确认取消
	confirm(){
		if(this.adminService.trim(this.selectorBooking.cancel_cause) == ''){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '取消原因不可为空', 3000);
			this.toastService.toast(toastCfg);
			return false;
		}
		this.btnCanEdit = true;
		this.loadingShow = true;
		this.modalConfirmTab = false;
		if(this.selectorBooking.type == 'booking'){
			// 取消预约
			var urlOptions = this.selectorBooking.bookingId + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token + '&cancel_cause=' + this.selectorBooking.cancel_cause;
			this.adminService.bookingcancelled(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.btnCanEdit = false;
					this.loadingShow = false;
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
				}else{
					this.btnCanEdit = false;
					this.getBooking(this.selectorBooking.type);
				}
			}).catch((err) => {
				this.btnCanEdit = false;
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
				this.toastService.toast(toastCfg);
			});
		}else{
			// 取消登记
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				status: '2',
				cancel_cause: this.selectorBooking.cancel_cause,
			}
			this.adminService.updatebookstatus(this.booking.bookingId, params).then((data) => {
				if(data.status == 'no'){
					this.btnCanEdit = false;
					this.loadingShow = false;
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
				}else{
					this.btnCanEdit = false;
					this.getBooking(this.selectorBooking.type);
				}
			}).catch(() => {
				this.btnCanEdit = false;
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
				this.toastService.toast(toastCfg);
			});
		}
	}

	// 退还部分预约金
	backBookingFee() {
		this.modalBackBookingFee = true;
	}

	closeBack() {
		this.modalBackBookingFee = false;
	}

	confirmBack() {
		this.btnCanEdit = true;
		if(this.adminService.isFalse(this.booking.backFee)){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可为空', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.booking.backFee) < 0){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可小于0', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.booking.backFee) > parseFloat(this.booking.tranInfo.id ? this.booking.tranInfo.amount : this.booking.yyj.amount)){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可大于已付金额', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.booking.backRemark) || this.booking.backRemark == ''){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '失约原因不可为空', 3000);
			this.toastService.toast(toastCfg);
			this.btnCanEdit = false;
			return;
		}
		this.modalBackBookingFee = false;
		this.loadingShow = true;
		var urlOptions = this.booking.bookingId + this.url
			 + '&refund_fee=' + this.booking.backFee + '&remark=' + this.booking.backRemark;
		this.adminService.bookingrefund(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.btnCanEdit = false;
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				this.btnCanEdit = false;
				this.getBooking('backBookingFee');
			}
		}).catch((err) => {
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}
}
