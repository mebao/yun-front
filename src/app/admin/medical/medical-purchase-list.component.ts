import { Component, OnInit }                     from '@angular/core';
import { Router }                                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-medical-purchase-list',
	templateUrl: './medical-purchase-list.component.html',
	styleUrls: ['./medical-purchase-list.component.scss'],
})
export class MedicalPurchaseListComponent{
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
	list: any[];
	url: string;
	info: {
		b_date: string,
		l_date: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '医疗用品',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
		this.hasData = false;

		this.list = [];
		this.info = {
			b_date: '',
			l_date: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.getData(this.url);
	}

	getData(urlOptions) {
		this.adminService.purchaserecords(urlOptions).then((data) => {
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
		if(this.info.b_date != ''){
			urlOptions += '&b_date=' + this.info.b_date;
		}
		if(this.info.l_date != ''){
			urlOptions += '&l_date=' + this.info.l_date;
		}
		this.getData(urlOptions);
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/medicalPurchase'], {queryParams: {id: _id}});
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