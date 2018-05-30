import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute }         from '@angular/router';

import { NzMessageService }               from 'ng-zorro-antd';

import { AdminService }                   from '../admin.service';

@Component({
	selector: 'admin-setup-inspect',
	templateUrl: './inspect.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class SetupInspectComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	url: string;
	inspectInfo: {
		project_id: string,
		project_name: string,
		price: string,
		can_discount: string,
		can_use: string,
	};
	projectlist: any[];
	editType: string;
	id: string;
	// 不可连续点击
	btnCanEdit: boolean;
	loadingShow: boolean;

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '检查项目',
			back: true,
		}
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		this.inspectInfo = {
			project_id: '',
			project_name: '',
			price: '',
			can_discount: '',
			can_use: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.loadingShow = true;
		//获取检查项目列表
		this.adminService.checkprojects(this.url).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.projectlist = results.list;

				// 获取检查信息
				if(this.id && this.id != ''){
					this.editType = 'update';
					var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId
						+ '&id=' + this.id;
					this.adminService.checkprojects(urlOptions).then((data) => {
						if(data.status == 'no'){
							this.loadingShow = false;
							this._message.error(data.errorMsg);
						}else{
							this.loadingShow = false;
							var results = JSON.parse(JSON.stringify(data.results));
							if(results.list.length > 0){
								this.inspectInfo.project_id = results.list[0].project_id;
								this.inspectInfo.price = results.list[0].price;
								this.inspectInfo.can_discount = results.list[0].canDiscount;
								this.inspectInfo.can_use = results.list[0].canUse;
							}else{
								this._message.error('数据错误');
							}
						}
					}).catch(() => {
						this.loadingShow = false;
			            this._message.error('服务器错误');
			        });
				}else{
					this.loadingShow = false;
					this.editType = 'create';
				}
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });

		this.btnCanEdit = false;
	}

	create() {
		this.btnCanEdit = true;
		if(this.editType == 'create'){
			if(this.inspectInfo.project_id == ''){
				this._message.error('检查不可为空');
				this.btnCanEdit = false;
				return;
			}
			if(this.adminService.isFalse(this.inspectInfo.can_discount)){
				this._message.error('能否优惠不可为空');
				this.btnCanEdit = false;
				return;
			}
			if(this.adminService.isFalse(this.inspectInfo.price)){
				this._message.error('价格不可为空');
				this.btnCanEdit = false;
				return;
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				project_id: this.inspectInfo.project_id,
				price: this.inspectInfo.price.toString(),
				can_discount: this.inspectInfo.can_discount,
			}
			this.adminService.cliniccheckproject(params).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('检查项目创建成功');
					setTimeout(() => {
						this.router.navigate(['./admin/setupInspect/list']);
					}, 2000);
				}
			}).catch(() => {
                this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}else{
			if(this.adminService.isFalse(this.inspectInfo.price)){
				this._message.error('项目价格不可为空');
				this.btnCanEdit = false;
				return;
			}
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				price: this.inspectInfo.price.toString(),
				can_discount: this.inspectInfo.can_discount,
				can_use: this.inspectInfo.can_use,
			}
			this.adminService.updateclinicproject(this.id, updateParams).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('检查项目修改成功');
					setTimeout(() => {
						this.router.navigate(['./admin/setupInspect/list']);
					}, 2000);
				}
			}).catch(() => {
                this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}
	}
}
