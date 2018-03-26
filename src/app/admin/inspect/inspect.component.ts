import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute }         from '@angular/router';

import { AdminService }                   from '../admin.service';

@Component({
	selector: 'admin-setup-inspect',
	templateUrl: './inspect.component.html',
})
export class SetupInspectComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
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

	constructor(
		private adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '检查项目',
			back: true,
		}

		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

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

		if(this.id && this.id != ''){
			this.editType = 'update';

			this.inspectInfo.project_name = JSON.parse(sessionStorage.getItem('inspect')).name;
			this.inspectInfo.price = JSON.parse(sessionStorage.getItem('inspect')).price;
			this.inspectInfo.can_use = JSON.parse(sessionStorage.getItem('inspect')).canUse;
		}else{
			this.editType = 'create';

			//获取检查项目列表
			var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token;
			this.adminService.checkprojects(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.projectlist = results.list;
				}
			});
		}

		this.btnCanEdit = false;
	}

	create(f) {
		this.btnCanEdit = true;
		if(this.editType == 'create'){
			if(f.value.project_id == ''){
				this.toastTab('项目名不可为空', 'error');
				this.btnCanEdit = false;
				return;
			}
			if(this.adminService.isFalse(f.value.price)){
				this.toastTab('项目价格不可为空', 'error');
				this.btnCanEdit = false;
				return;
			}
			if(parseFloat(f.value.price) < 0){
				this.toastTab('项目价格不可小于0', 'error');
				this.btnCanEdit = false;
				return;
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				project_id: f.value.project_id,
				price: f.value.price.toString(),
				can_discount: f.value.can_discount,
			}
			this.adminService.cliniccheckproject(params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('检查项目创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/setupInspectList']);
					}, 2000);
				}
			});
		}else{
			if(this.adminService.isFalse(f.value.price)){
				this.toastTab('项目价格不可为空', 'error');
				this.btnCanEdit = false;
				return;
			}
			if(parseFloat(f.value.price) < 0){
				this.toastTab('项目价格不可小于0', 'error');
				this.btnCanEdit = false;
				return;
			}
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				price: f.value.price.toString(),
				can_use: f.value.can_use,
			}
			this.adminService.updateclinicproject(this.id, updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('检查项目修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/setupInspectList']);
					}, 2000);
				}
			});
		}
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
