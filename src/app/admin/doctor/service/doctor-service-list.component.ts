import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute }               from '@angular/router';

import { AdminService }                         from '../../admin.service';
import { ToastService }                         from '../../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }               from '../../../common/nll-toast/toast-model';

@Component({
	selector:'app-doctor-service-list',
	templateUrl: 'doctor-service-list.component.html'
})
export class DoctorServiceListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	url: string;
	doctor_id: string;
	doctorServiceList: any[];
	hasData: boolean;
	// 不可连续点击
	btnCanEdit = false;
	modalConfirmTab = false;
	selector: {
		text: string,
		id: string,
	}
	searchInfo: {
		status: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
		private route: ActivatedRoute,
		private toastService: ToastService,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '医生科室列表',
			back: true,
		}

		this.loadingShow = true;
		this.hasData = false;

		this.doctorServiceList = [];

		this.selector = {
			text: '',
			id: '',
		}
		this.searchInfo = {
			status: '0',
		}

		//获取医生id
		this.route.queryParams.subscribe((params) => {
			this.doctor_id = params['id'];
		});

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		this.search();
	}

	search() {
		//查询医生信息
		var adminServiceUrl = this.url + '&doctor_id=' + this.doctor_id;
		if(this.searchInfo.status != ''){
			adminServiceUrl += '&is_deleted=' + this.searchInfo.status;
		}
		this.getData(adminServiceUrl);
	}

	getData(adminServiceUrl) {
		this.adminService.doctorservice(adminServiceUrl).then((data) => {
			if(data.status == 'no'){
			   this.loadingShow = false;
			   const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
			   this.toastService.toast(toastCfg);
			}else{
			   var results = JSON.parse(JSON.stringify(data.results));
			   if(results.servicelist.length > 0){
				   for(var i = 0; i < results.servicelist.length; i++){
					   results.servicelist[i].fee = this.adminService.toDecimal2(results.servicelist[i].fee);
				   }
			   }
			   this.doctorServiceList = results.servicelist;
			   this.hasData = true;
			   this.loadingShow = false;
			}
		}).catch((data) => {
		   	this.loadingShow = false;
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	update(_id) {
		this.router.navigate(['./admin/doctor/service'], {queryParams: {'doctor_id': this.doctor_id, 'doctorService_id': _id}});
	}

	updateStatus(service) {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			service_id: service.serviceId,
			service_name: service.serviceName,
			user_doctor_id: this.doctor_id,
			fee: service.fee,
			booking_fee: service.bookingFee,
			id: service.id,
			is_deleted: service.isDeleted == '0' ? '1' : '0',
		}

		this.adminService.doctorservicejoin(params).then((data) => {
			if(data.status == 'no'){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', (service.isDeleted == '0' ? '停用' : '可用') + '成功', 3000);
				this.toastService.toast(toastCfg);
				this.search();
			}
		})
	}

	goCreate() {
		this.router.navigate(['./admin/doctor/service'], {queryParams: {doctor_id: this.doctor_id}});
	}

	delete(service) {
		this.selector = {
			text: '确认删除？',
			id: service.id,
		}
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.modalConfirmTab = false;
		this.btnCanEdit = true;
		var urlOptions = this.selector.id + this.url;
		this.adminService.deletedoctorservice(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.btnCanEdit = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功', 3000);
				this.toastService.toast(toastCfg);
				this.btnCanEdit = false;
				this.search();
			}
		}).catch((data) => {
			this.btnCanEdit = false;
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}
}
