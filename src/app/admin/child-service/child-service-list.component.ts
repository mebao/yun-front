import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { NzMessageService }                      from 'ng-zorro-antd';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-child-service-list',
	templateUrl: './child-service-list.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class ChildServiceListComponent implements OnInit{
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
	childServiceList: any[];
	hasData: boolean;
	searchInfo: {
		status: string,
	}
	selectedInfo: {
		showTab: boolean,
		service: any,
		type: string,
		text: string,
	}

	constructor(
		public adminService: AdminService,
		public router: Router,
		private _message: NzMessageService,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '宝宝科室列表',
			back: false,
		}

		//权限
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

		this.hasData = false;

		this.childServiceList = [];

		this.searchInfo = {
			status: '1'
		}

		this.selectedInfo = {
			showTab: false,
			service: {},
			type: '',
			text: '',
		}

		this.getData();
	}

	getData(){
		this.loadingShow = true;
		var servicelistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&status=' + this.searchInfo.status;
		this.adminService.servicelist(servicelistUrl).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.childServiceList = results.servicelist;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	update(service){
		this.router.navigate(['./admin/childService'], {queryParams: {id: service.serviceId}});
	}

	updateInfo(service, type){
		var text = '是否确认';
		if(type == 'status'){
			if(service.status == '0'){
				text += '-状态-可用';
			}else{
				text += '-状态-停用';
			}
		}else{
			if(service.mobileBooking == '0'){
				text += '-开放-自主预约';
			}else{
				text += '-关闭-自主预约';
			}
		}
		this.selectedInfo = {
			showTab: true,
			service: service,
			type: type,
			text: text,
		}
	}

	closeConfirm() {
		this.selectedInfo = {
			showTab: false,
			service: {},
			type: '',
			text: '',
		}
	}

	confirm() {var param = {
		username: this.adminService.getUser().username,
		token: this.adminService.getUser().token,
		status: this.selectedInfo.type == 'status' ? (this.selectedInfo.service.status == 1 ? '0' : '1') : null,
		mobile_booking: this.selectedInfo.type == 'booking' ? (this.selectedInfo.service.mobileBooking == '1' ? '0' : '1') : null,
	}
	this.adminService.clinicservicestatus(this.selectedInfo.service.serviceId, param).then((data) => {
		if(data.status == 'no'){
			this.loadingShow = false;
			this._message.error(data.errorMsg);
		}else{
			this._message.success((this.selectedInfo.type == 'status' ? '状态' : '自主预约') + '修改成功');
			this.closeConfirm();
			this.getData();
		}
	}).catch(() => {
		this.loadingShow = false;
		this._message.error('服务器错误');
	});
	}

	goCreate() {
		this.router.navigate(['./admin/childService']);
	}
}
