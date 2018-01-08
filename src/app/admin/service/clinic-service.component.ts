import { Component, OnInit }                 from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'app-clinic-service',
	templateUrl: './clinic-service.component.html'
})
export class ClinicServiceComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
	childServiceList: [{}];
	id: string;
	fee: string;
	serviceId: string;
	service: string;
	type: string;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	serviceModel: {
		service: string,
		fee: string,
	}

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '诊所科室',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.serviceModel = {
			service: '',
			fee: '',
		}

		//修改获取id
		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
		});

		if(this.id){
			this.type = 'update';
			//获取诊所科室列表
			var urlOptions = '?username=' +　this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				　+　'&clinic_id=' + this.adminService.getUser().clinicId;
			this.adminService.servicelist(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					for(var i = 0; i < results.servicelist.length; i++){
						if(results.servicelist[i].id == this.id){
							this.serviceId = results.servicelist[i].serviceId;
							this.serviceModel.fee = results.servicelist[i].fee;
							this.getChildServiceList();
						}
					}
				}
			})
		}else{
			this.type = 'create';
			this.getChildServiceList();
		}
	}

	getChildServiceList() {
		//获取宝宝科室
		var servicelistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(servicelistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].string = JSON.stringify(results.servicelist[i]);
						if(this.id && this.serviceId == results.servicelist[i].serviceId){
							//修改
							this.serviceModel.service = results.servicelist[i].string;
						}
					}
				}
				this.childServiceList = results.servicelist;
			}
		})
	}

	submit(f) {
		if(f.value.service == ''){
			this.toastTab('科室不可为空', 'error');
			return;
		}
		if(f.value.fee == ''){
			this.toastTab('费用不可为空', 'error');
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			service_name: JSON.parse(f.value.service).serviceName,
			service_id: JSON.parse(f.value.service).serviceId,
			clinic_id: this.adminService.getUser().clinicId,
			fee: f.value.fee,
			id: this.id ? this.id: null,
		}
		this.adminService.clinicservicejoin(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				if(this.type == 'update'){
					this.toastTab('修改成功', '');
				}else{
					this.toastTab('创建成功', '');
				}
				setTimeout(() => {
					this.router.navigate(['./admin/clinicServiceList']);
				}, 2000)
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
