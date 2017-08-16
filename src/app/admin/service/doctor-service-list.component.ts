import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute }               from '@angular/router';

import { AdminService }                         from '../admin.service';

@Component({
	selector:'app-doctor-service-list',
	templateUrl: 'doctor-service-list.component.html'
})
export class DoctorServiceListComponent{
	doctor_id: string;
	doctorServiceList: any[];
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;

	constructor(
		public adminService: AdminService,
		private router: Router,
		private route: ActivatedRoute,
	) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasData = false;

		this.doctorServiceList = [];

		//获取医生id
		this.route.queryParams.subscribe((params) => {
			this.doctor_id = params['id'];
		});

		//查询医生信息
		var adminServiceUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&doctor_id=' + this.doctor_id;
		this.adminService.doctorservice(adminServiceUrl).then((data) => {
			 if(data.status == 'no'){
			 	this.toastTab(data.errorMsg, 'error');
			 }else{
			 	var results = JSON.parse(JSON.stringify(data.results));
			 	this.doctorServiceList = results.servicelist;
			 	this.hasData = true;
			 }
		})
	}

	update(_id) {
		this.router.navigate(['./admin/doctorService'], {queryParams: {'doctor_id': this.doctor_id, 'doctorService_id': _id}});
	}

	goCreate() {
		this.router.navigate(['./admin/doctorService'], {queryParams: {doctor_id: this.doctor_id}});
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