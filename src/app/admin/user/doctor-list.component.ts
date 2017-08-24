import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute }               from '@angular/router';

import { AdminService }                         from '../admin.service';

@Component({
	selector:'app-doctor-list',
	templateUrl: 'doctor-list.component.html',
	styleUrls: ['./doctor-list.component.scss'],
})
export class DoctorListComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
	doctorlist: any[];
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '医生列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasData = false;

		this.doctorlist = [];

		//查询医生信息
		var adminServiceUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.doctorprofile(adminServiceUrl).then((data) => {
			 if(data.status == 'no'){
			 	this.toastTab(data.errorMsg, 'error');
			 }else{
			 	var results = JSON.parse(JSON.stringify(data.results));
			 	this.doctorlist = results.doctorlist;
			 	this.hasData = true;
			 }
		})
	}

	showService(_id) {
		this.router.navigate(['./admin/doctorServiceList'], {queryParams: {'id': _id}});
	}

	showInfo(_id){
		this.router.navigate(['./admin/doctorInfo'], {queryParams: {'id': _id}});
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