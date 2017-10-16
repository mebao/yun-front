import { Component }                           from '@angular/core';
import { Router }                              from '@angular/router';

import { AdminService }                        from '../admin.service';

@Component({
	selector: 'admin-child-list',
	templateUrl: './child-list.component.html',
})
export class ChildListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		info: boolean,
		booking: boolean,
		bookingHistory: boolean,
	}
	childList: any[];
	hasData: boolean;
	searchInfo: {
		name: string,
		mobile: string,
	}
	url: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '病人库',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.moduleAuthority = {
			see: false,
			info: false,
			booking: false,
			bookingHistory: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.childList = [];
		this.hasData = false;
		this.searchInfo = {
			name: '',
			mobile: '',
		}

		//获取宝宝列表
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search();
	}

	search() {
		var urlOptions = this.url;
		if(this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		if(this.searchInfo.mobile != ''){
			urlOptions += '&mobile=' + this.searchInfo.mobile;
		}

		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchchild(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.child.length > 0){
					for(var i = 0; i < results.child.length; i++){
						if(!this.adminService.isFalse(results.child[i].birthday)){
							results.child[i].birthday = this.adminService.dateFormat(results.child[i].birthday);
						}
					}
				}
				this.childList = results.child;
				this.hasData = true;
			}
		});
	}

	goInfo(child) {
		this.router.navigate(['./admin/childInfo'], {queryParams: {id: child.childId}});
	}

	//宝宝详情
	childInfo(_id) {
		window.open('./admin/childInfo?id=' + _id);
	}

	//预约
	goBooking(child) {
		sessionStorage.setItem('childList-childName', child.childName);
		this.router.navigate(['./admin/booking'], {queryParams: {childId: child.childId, type: 'createChildList'}});
	}

	// 预约记录
	goBookingHistory(child) {
		this.router.navigate(['./admin/bookingHistory'], {queryParams: {childId: child.childId}});
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
