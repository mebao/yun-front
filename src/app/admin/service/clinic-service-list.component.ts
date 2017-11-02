import { Component, OnInit }                 from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'app-clinic-service-list',
	templateUrl: './clinic-service-list.component.html'
})
export class ClinicServiceListComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	clinicServiceList: any[];
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;

	constructor(
		public adminService: AdminService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '诊所服务列表',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.loadingShow = true;
		this.hasData = false;

		this.clinicServiceList = [];

		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.clinicservices(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.clinicServiceList = results.servicelist;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	update(_id) {
		this.router.navigate(['./admin/clinicService'], {queryParams: {id: _id}});
	}

	goCreate() {
		this.router.navigate(['./admin/clinicService']);
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
