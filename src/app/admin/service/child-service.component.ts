import { Component, OnInit }            from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';

import { AdminService }                 from '../admin.service';

@Component({
	selector: 'app-child-service',
	templateUrl: './child-service.component.html'
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
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '宝宝服务',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.route.queryParams.subscribe(params => this.id = params['id']);
		//判断id是否存在，新增和修改
		if(this.id){
			this.type = 'update';
			var childServiceList = this.adminService.servicelist().then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					for(var i = 0; i < results.servicelist.length; i++){
						if(results.servicelist[i].serviceId == this.id.toString()){
							this.childService = results.servicelist[i];
						}
					}
				}
			})
		}else{
			this.type = 'create';
		}

		this.btnCanEdit = false;
	}

	submit(f) {
		this.btnCanEdit = true;
		if(f.value.service_name == ''){
			this.toastTab('服务名不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.description == ''){
			this.toastTab('服务说明不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			service_name: f.value.service_name,
			description: f.value.description,
			service_id: this.id ? this.id : null,
		}
		this.adminService.clinicservice(param).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				if(this.type == 'update'){
					this.toastTab('修改成功', '');
				}else{
					this.toastTab('创建成功', '');
				}
				setTimeout(() => {
					this.router.navigate(['./admin/childServiceList']);
				}, 2000);
			}
		})
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

interface ChildServcie{
	serviceId: string;
	serviceName: string;
	description: string;
}
