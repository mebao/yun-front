import { Component, OnInit }                         from '@angular/core';
import { Router }                                    from '@angular/router';

import { AdminService }                              from '../admin.service';

@Component({
	selector: 'app-prescript-sale-list',
	templateUrl: './prescript-sale-list.component.html',
})
export class PrescriptSaleListComponent{
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
    searchInfo: {
        mobile: string,
        day: string,
        admin_name: string,
    }

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '药方列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
        this.hasData = false;
        this.list = [];
        this.searchInfo = {
            mobile: '',
            day: '',
            admin_name: '',
        }

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search();
	}

	search() {
		var urlOptions = this.url;
		if(this.searchInfo.mobile != ''){
			urlOptions += ('&mobile=' + this.searchInfo.mobile);
		}
		if(this.searchInfo.day != ''){
			urlOptions += ('&day=' + this.searchInfo.day);
		}
		if(this.searchInfo.admin_name != ''){
			urlOptions += ('&admin_name=' + this.searchInfo.admin_name);
		}
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchdrugretail(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].infoLength = results.list[i].info.length;
					}
				}
				this.list = results.list;
				this.hasData = true;
                console.log(this.list);
			}
		})
	}

	goUrl(_url) {
		this.router.navigate([_url]);
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
