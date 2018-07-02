import { Component, OnInit }                      from '@angular/core';
import { Router }                                 from '@angular/router';

import { NzMessageService }                       from 'ng-zorro-antd';

import { AdminService }                           from '../admin.service';

@Component({
	selector: 'admin-inspect-results-list',
	templateUrl: './inspect-results-list.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class InspectResultsListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	userCheckList: any[];
	checkProjestList: any[];
	searchInfo: {
		check_name: string,
		doctor_name: string,
		child_name: string,
		ischeck: string,
		date: [Date, Date]
	}
	url: string;

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '检查项目列表',
			back: false,
		}

		this.moduleAuthority = {
			see: false,
			edit: false,
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

		this.searchInfo = {
			check_name: '',
			doctor_name: '',
			child_name: '',
			ischeck: '0',
			date: [new Date(), new Date()]
		}
		var todayDate = this.adminService.getDayByDate(new Date());
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-inspectResultsList'));
        if(sessionSearch){
			this.searchInfo = {
                check_name: sessionSearch.check_name,
                doctor_name: sessionSearch.doctor_name,
                child_name: sessionSearch.child_name,
				ischeck: sessionSearch.ischeck,
				date: [sessionSearch.date[0] ? new Date(sessionSearch.date[0]): null, sessionSearch.date[1] ? new Date(sessionSearch.date[1]) : null]
            }
		}

		this.hasData = false;
		this.userCheckList = [];
		this.checkProjestList = [];

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.adminService.checkprojects(this.url).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.checkProjestList = results.list;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
		this.search();
	}

	getData(urlOptions) {
		this.adminService.usercheckprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				var newList = [];
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						// 判断该bookingId是否已经存在
						if(newList.length > 0){
							var hasBoolean = false;
							for(var j = 0; j < newList.length; j++){
								if(results.list[i].bookingId == newList[j].bookingId){
									hasBoolean = true;
									newList[j].infoList.push(results.list[i]);
								}
							}
							if(!hasBoolean){
								newList.push({
									bookingId: results.list[i].bookingId,
									infoList: [results.list[i]],
								});
							}
						}else{
							newList.push({
								bookingId: results.list[i].bookingId,
								infoList: [results.list[i]],
							});
						}
					}
				}
				this.userCheckList = newList;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-inspectResultsList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.check_name && this.searchInfo.check_name != ''){
			urlOptions += '&check_name=' + this.searchInfo.check_name;
		}
		if(this.searchInfo.doctor_name && this.searchInfo.doctor_name != ''){
			urlOptions += '&doctor_name=' + this.searchInfo.doctor_name;
		}
		if(this.searchInfo.child_name && this.searchInfo.child_name != ''){
			urlOptions += '&child_name=' + this.searchInfo.child_name;
		}
		if(this.searchInfo.ischeck && this.searchInfo.ischeck != ''){
			urlOptions += '&ischeck=' + this.searchInfo.ischeck;
		}
        if(this.searchInfo.date[0]){
            urlOptions += '&b_date=' + this.adminService.getDayByDate(new Date(this.searchInfo.date[0]));
        }
        if(this.searchInfo.date[1]){
            urlOptions += '&e_date=' + this.adminService.getDayByDate(new Date(this.searchInfo.date[1]));
        }
		this.getData(urlOptions);
	}

	check(_id) {
		this.router.navigate(['./admin/inspectResults'], {queryParams: {id: _id}});
	}

	//宝宝详情
	childInfo(_id) {
		window.open('./admin/child/info?id=' + _id);
	}
}
