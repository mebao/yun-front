import { Component }                           from '@angular/core';
import { Router }                              from '@angular/router';

import { NzMessageService }                    from 'ng-zorro-antd';

import { AdminService }                        from '../admin.service';

@Component({
	selector: 'admin-child-list',
	templateUrl: './child-list.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class ChildListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		info: boolean,
		booking: boolean,
		bookingHistory: boolean,
	}
	loadingShow: boolean;
	childList: any[];
	hasData: boolean;
	searchInfo: {
		name: string,
		mobile: string,
	}
	url: string;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '病人库',
			back: false,
		}

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

		this.loadingShow = false;

		this.childList = [];
		this.hasData = false;

		if(JSON.parse(sessionStorage.getItem('search-childList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-childList'));
		}else{
			this.searchInfo = {
				name: '',
				mobile: '',
			}
		}

		//获取宝宝列表
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		// this.search();
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-childList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
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
				this.loadingShow = false;
				this._message.error(data.errorMsg);
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
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	goInfo(child) {
		this.router.navigate(['./admin/child/info'], {queryParams: {id: child.childId}});
	}

	//宝宝详情
	childInfo(_id) {
		window.open('./admin/child/info?id=' + _id);
	}

	call(child) {
		window.open('./admin/child/info?id=' + child.childId + '&pageType=call');
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
}
