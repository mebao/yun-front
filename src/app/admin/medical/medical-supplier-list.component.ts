import { Component, OnInit }                      from '@angular/core';
import { Router, ActivatedRoute }                 from '@angular/router';

import { AdminService }                           from '../admin.service';

@Component({
	selector: 'app-medical-supplier-list',
	templateUrl: './medical-supplier-list.component.html',
})
export class MedicalSupplierListComponent{
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
	list: any[];
	info: {
		name: string,
		company: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '供应商管理',
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
			company: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.list = [];

		this.getData(this.url);
	}

	getData(urlOptions) {
		this.adminService.supplierlist(urlOptions).then((data) => {
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
		if(this.info.company != ''){
			urlOptions += '&company=' + this.info.company;
		}
		this.getData(urlOptions);
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	goCreate() {
		this.router.navigate(['./admin/medicalSupplier']);
	}

	update(_id) {
		this.router.navigate(['./admin/medicalSupplier'], {queryParams: {id: _id}});
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