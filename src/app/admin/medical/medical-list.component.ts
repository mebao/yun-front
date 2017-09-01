import { Component, OnInit }                   from '@angular/core';
import { Router }                              from '@angular/router';

import { AdminService }                        from '../admin.service';

@Component({
	selector: 'app-medicalsupplies-list',
	templateUrl: './medical-list.component.html',
})
export class MedicalListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;
	url: string;
	medicalSupplies: any[];
	info: {
		name: string,
		type: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '药房管理',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
		this.hasData = false;
		this.info = {
			name: '',
			type: '1',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		this.medicalSupplies = [];

		this.search();
	}

	getData(urlOptions) {
		this.adminService.medicalsupplieslist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.medicalSupplies = results.medicalSupplies;
				this.hasData = true;
			}
		})
	}

	search() {
		var urlOptions = this.url;
		if(this.info.name != ''){
			urlOptions += '&name=' + this.info.name;
		}
		if(this.info.type != ''){
			urlOptions += '&type=' + this.info.type;
		}
		this.getData(urlOptions);
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	goCreate() {
		this.router.navigate(['./admin/medical']);
	}

	update(_id) {
		this.router.navigate(['./admin/medical'], {queryParams: {id: _id}});
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