import { Component, OnInit }                     from '@angular/core';
import { Router }                                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-medical-has-list',
	templateUrl: './medical-has-list.component.html',
})
export class MedicalHasListComponent{
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;
	list: any[];
	url: string;
	info: {
		name: string,
		type: string,
		l_stock: string,
		b_stock: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
		this.hasData = false;

		this.list = [];
		this.info = {
			name: '',
			type: '',
			l_stock: '',
			b_stock: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.getData(this.url);
	}

	getData(urlOptions) {
		this.adminService.searchsupplies(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.list = results.list;
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
		if(this.info.l_stock && this.info.l_stock != ''){
			urlOptions += '&l_stock=' + this.info.l_stock;
		}
		if(this.info.b_stock && this.info.b_stock != ''){
			urlOptions += '&b_stock=' + this.info.b_stock;
		}
		this.getData(urlOptions);
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/medicalHas'], {queryParams: {id: _id}});
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