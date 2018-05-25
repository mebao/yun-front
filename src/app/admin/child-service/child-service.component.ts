import { Component, OnInit }            from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';

import { NzMessageService }             from 'ng-zorro-antd';

import { AdminService }                 from '../admin.service';

@Component({
	selector: 'app-child-service',
	templateUrl: './child-service.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss'],
})
export class ChildServiceComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	id: number;
	type: string;
	childService: ChildServcie = {
		serviceId: '',
		serviceName: '',
		description: '',
	};
	// 不可连续点击
	btnCanEdit: boolean;
	loadingShow: boolean;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '宝宝科室',
			back: true,
		}
		this.loadingShow = true;

		this.route.queryParams.subscribe(params => this.id = params['id']);
		//判断id是否存在，新增和修改
		if(this.id){
			this.type = 'update';
			var servicelistUrl = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId
				 + '&id=' + this.id;
			this.adminService.servicelist(servicelistUrl).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.servicelist.length > 0){
						this.childService = results.servicelist[0];
					}
					this.loadingShow = false;
				}
			}).catch(() => {
				this.loadingShow = false;
                this._message.error('服务器错误');
            });
		}else{
			this.type = 'create';
			this.loadingShow = false;
		}

		this.btnCanEdit = false;
	}

	submit() {
		this.btnCanEdit = true;
		this.childService.serviceName = this.childService.serviceName.trim();
		this.childService.description = this.childService.description.trim();
		if(this.childService.serviceName == ''){
			this._message.error('科室名不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.childService.description == ''){
			this._message.error('科室说明不可为空');
			this.btnCanEdit = false;
			return;
		}
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			service_name: this.childService.serviceName,
			description: this.childService.description,
			service_id: this.id ? this.id : null,
		}
		this.adminService.clinicservice(param).then((data) => {
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
					this.router.navigate(['./admin/childService/list']);
				}, 2000);
			}
		}).catch(() => {
            this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}
}

interface ChildServcie{
	serviceId: string;
	serviceName: string;
	description: string;
}
