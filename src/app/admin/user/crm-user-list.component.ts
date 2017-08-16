import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'app-crm-user-list',
	templateUrl: './crm-user-list.component.html',
	styleUrls: ['./crm-user-list.component.scss'],
})
export class CrmUserListComponent{
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;
	adminlist: any[];
	role: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasData = false;

		this.adminlist = [];
		this.role = '';
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
		}

		this.getData();
	}

	getData() {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + (this.role == '' ? '' : ('&role=' + this.role));
		this.adminService.adminlist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.adminlist = results.adminlist;
				this.hasData = true;
			}
		})
	}

	roleChange() {
		this.getData();
	}

	delete(_id) {
		this.selector.id = _id;
		this.selector.text = '确认删除？';
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.modalConfirmTab = false;
		this.adminService.deleteadmin(this.selector.id).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('删除成功', '');
				this.getData();
			}
		})
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/crmUser'], {queryParams: {id: _id}});
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