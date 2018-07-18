import { Component, OnInit }                from '@angular/core';
import { Router, ActivatedRoute }           from '@angular/router';

import { NzMessageService }                 from 'ng-zorro-antd';

import { AdminService }                     from '../../admin.service';

@Component({
	selector: 'app-booking-info',
	templateUrl: './booking-info.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss'],
})
export class BookingInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	//权限
	moduleAuthority: {
        see: boolean,
        seePhone: boolean,
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
		genderText: string,
        cancel_cause: string,
        mobile: string,
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
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
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
            seePhone: false,
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
			genderText: '',
            cancel_cause: '',
            mobile: '',
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
		this.modalBackBookingFee = false;
	}

	getBooking(type) {
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				// 时间格式变更
				if(results.weekbooks.length > 0 && results.weekbooks[0].services.length > 0){
					if(results.weekbooks[0].services[0].begin){
						results.weekbooks[0].services[0].begin = results.weekbooks[0].services[0].begin.replace('-', '年');
						results.weekbooks[0].services[0].begin = results.weekbooks[0].services[0].begin.replace('-', '月');
						results.weekbooks[0].services[0].begin = results.weekbooks[0].services[0].begin.replace(' ', '日 ');
					}
					if(results.weekbooks[0].services[0].end){
						results.weekbooks[0].services[0].end = results.weekbooks[0].services[0].end.replace('-', '年');
						results.weekbooks[0].services[0].end = results.weekbooks[0].services[0].end.replace('-', '月');
						results.weekbooks[0].services[0].end = results.weekbooks[0].services[0].end.replace(' ', '日 ');
					}
				}
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
					this._message.success('预约单取消成功');
				}else if(type == 'status'){
					this._message.success('取消登记成功');
				}else if(type == 'backBookingFee'){
					this._message.success('金额退还成功');
				}
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
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
			this._message.error('取消原因不可为空');
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
					this._message.error(data.errorMsg);
				}else{
					this.btnCanEdit = false;
					this.getBooking(this.selectorBooking.type);
				}
			}).catch((err) => {
				this.btnCanEdit = false;
				this.loadingShow = false;
				this._message.error('服务器错误');
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
					this._message.error(data.errorMsg);
				}else{
					this.btnCanEdit = false;
					this.getBooking(this.selectorBooking.type);
				}
			}).catch(() => {
				this.btnCanEdit = false;
				this.loadingShow = false;
				this._message.error('服务器错误');
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
			this._message.error('退还金额不可为空');
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.booking.backFee) < 0){
			this._message.error('退还金额不可小于0');
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.booking.backFee) > parseFloat(this.booking.tranInfo.id ? this.booking.tranInfo.amount : this.booking.yyj.amount)){
			this._message.error('退还金额不可大于已付金额');
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.booking.backRemark) || this.booking.backRemark == ''){
			this._message.error('失约原因不可为空');
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
				this._message.error(data.errorMsg);
			}else{
				this.btnCanEdit = false;
				this.getBooking('backBookingFee');
			}
		}).catch((err) => {
			this.btnCanEdit = false;
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}
}
