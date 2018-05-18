import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute }               from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
import { NzMessageService }                  	from 'ng-zorro-antd';

import { AdminService }                         from '../../admin.service';

@Component({
	selector: 'app-doctor-service',
	templateUrl: './doctor-service.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})
export class DoctorServiceComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	type: string;
    // 医生id
    doctorId: string;
    // 医生关联科室的id
	doctorService_id: string;
    // 医生关联的科室，在科室列表中的id
    serviceId: string;
    // 科室列表
	childServiceList: any[];
    validateForm: FormGroup;
	// 不可连续点击
	btnCanEdit: boolean;
    _isSpinning: boolean;

	constructor(
        private fb: FormBuilder,
        private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {
        this.validateForm = this.fb.group({
            service: [ '', [ Validators.required ]],
            fee: [ '', [ Validators.required ]],
            booking_fee: [ '', [ Validators.required ]],
        });
	}

	ngOnInit(): void {
		this.topBar = {
			title: '医生科室',
			back: true,
		}

		this.doctorId = '';

		//获取医生科室id
		this.route.queryParams.subscribe((params) => {
			this.doctorId = params['doctor_id'];
			this.doctorService_id = params['doctorService_id'];
		});

        this._isSpinning = true;
		if(this.doctorId && this.doctorService_id){
			//类型
			this.type = 'update';
			var adminServiceUrl = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&doctor_id=' + this.doctorId;
			this.adminService.doctorservice(adminServiceUrl).then((data) => {
				if(data.status == 'no'){
                    this._isSpinning = false;
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.servicelist.length > 0){
						for(var i = 0; i < results.servicelist.length; i++){
							if(this.doctorService_id == results.servicelist[i].id){
								this.validateForm.controls.fee.setValue(results.servicelist[i].fee);
								this.validateForm.controls.booking_fee.setValue(results.servicelist[i].bookingFee);
								this.serviceId = results.servicelist[i].serviceId;
								this.getData();
							}
						}
					}
				}
			}).catch(() => {
                this._isSpinning = false;
				this._message.error('服务器错误1');
            });
		}else{
			this.type = 'create';
			this.getData();
		}

		this.btnCanEdit = false;
	}

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

	getData() {
		//获取宝宝科室
		var servicelistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(servicelistUrl).then((data) => {
			if(data.status == 'no'){
                this._isSpinning = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for (var i = 0; i < results.servicelist.length; i++) {
						if(this.doctorId && this.doctorService_id && this.serviceId == results.servicelist[i].serviceId){
							//修改
							this.validateForm.controls.service.setValue(results.servicelist[i]);
						}
					}
				}
				this.childServiceList = results.servicelist;
                this._isSpinning = false;
			}
		}).catch(() => {
            this._isSpinning = false;
			this._message.error('服务器错误2');
        });
	}

	submit() {
		this.btnCanEdit = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			service_id: this.validateForm.controls.service.value.serviceId,
			service_name: this.validateForm.controls.service.value.serviceName,
			clinic_id: this.adminService.getUser().clinicId,
			user_doctor_id: this.doctorId,
			fee: this.validateForm.controls.fee.value.toString(),
			booking_fee: this.validateForm.controls.booking_fee.value.toString(),
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
					this.router.navigate(['./admin/doctor/service/list'], {queryParams: {'id': this.doctorId}});
				}, 2000);
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}
}
