import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent{
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
	users: any[];
	role: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
	}
	searchInfo: {
		name: string,
		mobile: string,
		child_name: string,
	}
	url: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '用户管理',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasData = false;
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
		}

		this.searchInfo = {
			name: '',
			mobile: '',
			child_name: '',
		}

		this.users = [];
		this.role = this.adminService.getUser().role;

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		this.search();
	}

	getData(urlOptions) {
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.users = results.users;
				this.hasData = true;
			}
		});
	}

	search() {
		var urlOptions = this.url;
		if(this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		if(this.searchInfo.mobile != ''){
			urlOptions += '&mobile=' + this.searchInfo.mobile;
		}
		if(this.searchInfo.child_name != ''){
			urlOptions += '&child_name=' + this.searchInfo.child_name;
		}

		this.getData(urlOptions);
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	goInfo(_id) {
		this.router.navigate(['./admin/userInfo'], {queryParams: {id: _id}});
	}

	delete(_id) {
		this.selector = {
			id: _id,
			text: '确认删除该用户？',
		}
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.modalConfirmTab = false;
		var urlOptions = this.selector.id + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		this.adminService.deleteuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.search();
				this.toastTab('删除成功', '');
			}
		});
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