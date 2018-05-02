import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute }               from '@angular/router';

import { AdminService }                         from '../../admin.service';
import { NzMessageService }                  	from 'ng-zorro-antd';

@Component({
	selector: 'app-doctor-service',
	templateUrl: './doctor-service.component.html'
})
export class DoctorServiceComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	type: string;
	doctor_id: string;
	doctorService_id: string;
	childServiceList: any[];
	doctorlist: any[];
	fee: string;
	service: string;
	serviceId: string;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	serviceModel: {
		service: string,
		doctor_id: string,
		fee: string,
		booking_fee: string,
	}
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
		private _message: NzMessageService,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '医生科室',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.serviceModel = {
			service: '',
			doctor_id: '',
			fee: '',
			booking_fee: '',
		}

		//获取医生科室id
		this.route.queryParams.subscribe((params) => {
			this.serviceModel.doctor_id = params['doctor_id'];
			this.doctorService_id = params['doctorService_id'];
		});

		if(this.serviceModel.doctor_id && this.doctorService_id){
			//类型
			this.type = 'update';
			var adminServiceUrl = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&doctor_id=' + this.serviceModel.doctor_id;
			this.adminService.doctorservice(adminServiceUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.servicelist.length > 0){
						for(var i = 0; i < results.servicelist.length; i++){
							if(this.doctorService_id == results.servicelist[i].id){
								this.serviceModel.fee = results.servicelist[i].fee;
								this.serviceModel.booking_fee = results.servicelist[i].bookingFee;
								this.serviceId = results.servicelist[i].serviceId;
								this.getData();
							}
						}
					}
				}
			}).catch(() => {
				this._message.error('服务器错误');
            });
		}else{
			this.type = 'create';
			this.getData();
		}

		this.btnCanEdit = false;
	}

	getData() {
		//获取宝宝科室
		var servicelistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(servicelistUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for (var i = 0; i < results.servicelist.length; i++) {
						results.servicelist[i].string = JSON.stringify(results.servicelist[i]);
						if(this.serviceModel.doctor_id && this.doctorService_id && this.serviceId == results.servicelist[i].serviceId){
							//修改
							this.serviceModel.service = results.servicelist[i].string;
						}
					}
				}
				this.childServiceList = results.servicelist;
			}
		}).catch(() => {
			this._message.error('服务器错误');
        });
	}

	submit(f) {
		this.btnCanEdit = true;
		if(f.value.service == ''){
			this._message.error('科室不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.fee)){
			this._message.error('费用不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(Number(f.value.fee) < 0){
			this._message.error('费用应大于等于0');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.booking_fee)){
			this._message.error('预约金不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(Number(f.value.booking_fee) < 0){
			this._message.error('预约金应大于等于0');
			this.btnCanEdit = false;
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			service_id: JSON.parse(this.serviceModel.service).serviceId,
			service_name: JSON.parse(this.serviceModel.service).serviceName,
			clinic_id: this.adminService.getUser().clinicId,
			user_doctor_id: this.serviceModel.doctor_id,
			fee: f.value.fee.toString(),
			booking_fee: f.value.booking_fee.toString(),
			id: this.type == 'update' ? this.doctorService_id : null,
		}

		this.adminService.doctorservicejoin(params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				if(this.type == 'update'){
					this._message.success('修改成功');
				}else{
					this._message.success('创建成功');
				}
				setTimeout(() => {
					this.router.navigate(['./admin/doctor/service/list'], {queryParams: {'id': this.serviceModel.doctor_id}});
				}, 2000);
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}

	toastTab(text, type) {
		this.toast = {
			show: 1,
			text: text,
			type: type,
		}
		setTimeout(() => {
	    	this.toast = {
				show: 0,
				text: '',
				type: '',
			}
	    }, 2000);
	}
}
