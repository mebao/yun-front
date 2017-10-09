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
	// 权限
	moduleAuthority: {
		see: boolean,
		add: boolean,
		info: boolean,
		delete: boolean,
		member: boolean,
		recharge: boolean,
	}
	hasData: boolean;
	users: any[];
	role: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		member: string,
		text: string,
		balance: string,
		amount: string,
		give_amount: string,
		pay_way: string,
	}
	searchInfo: {
		name: string,
		mobile: string,
		child_name: string,
	}
	url: string;
	//设置会员
	modalTab: boolean;
	memberList: any[];
	//充值
	modalTabCharge: boolean;

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

		// 权限
		this.moduleAuthority = {
			see: false,
			add: false,
			info: false,
			delete: false,
			member: false,
			recharge: false,
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
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			member: '',
			text: '',
			balance: '',
			amount: '',
			give_amount: '',
			pay_way: '',
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

		//设置会员
		this.modalTab = false;
		this.memberList = [];

		//充值
		this.modalTabCharge = false;

		this.search();

		//获取会员列表
		var memberUrl = this.url + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&status=1';
		this.adminService.memberlist(memberUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.memberList = results.list;
			}
		});
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

	//删除用户
	delete(_id) {
		this.selector = {
			id: _id,
			member: '',
			text: '确认删除该用户？',
			balance: '',
			amount: '',
			give_amount: '',
			pay_way: '',
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

	//设置会员
	close() {
		this.modalTab = false;
	}

	setMember(user) {
		this.modalTab = true;
		this.selector = {
			id: user.id,
			member: '',
			text: user.name,
			balance: '',
			amount: '',
			give_amount: '',
			pay_way: '',
		}
		if(this.memberList.length > 0){
			for(var i = 0; i < this.memberList.length; i++){
				if(this.memberList[i].id == user.memberId){
					this.selector.member = this.memberList[i].string;
				}
			}
		}
	}

	confirmMember() {
		if(this.selector.member == ''){
			this.toastTab('会员类型不可为空', 'error');
			return;
		}
		this.modalTab = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			member_id: JSON.parse(this.selector.member).id,
			member_name: JSON.parse(this.selector.member).name,
		}
		this.adminService.setmember(this.selector.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('会员设置成功', '');
				this.search();
			}
		});
	}

	//充值
	closeCharge() {
		this.modalTabCharge = false;
	}

	charge(user) {
		this.modalTabCharge = true;
		this.selector = {
			id: user.id,
			member: '',
			text: user.name,
			balance: user.balance ? user.balance : 0,
			amount: '',
			give_amount: '',
			pay_way: '',
		}
	}

	confirmCharge() {
		if(this.adminService.isFalse(this.selector.amount)){
			this.toastTab('支付金额不可为空', 'error');
			return;
		}
		if(parseFloat(this.selector.amount) < 0){
			this.toastTab('支付金额不可为负数', 'error');
			return;
		}
		if(this.adminService.isFalse(this.selector.give_amount)){
			this.toastTab('赠送金额不可为空', 'error');
			return;
		}
		if(parseFloat(this.selector.give_amount) < 0){
			this.toastTab('赠送金额不可为负数', 'error');
			return;
		}
		if(this.selector.pay_way == ''){
			this.toastTab('支付方式不可为空', 'error');
			return;
		}

		this.modalTabCharge = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			user_id: this.selector.id,
			user_name: this.selector.text,
			amount: this.selector.amount,
			give_amount: this.selector.give_amount.toString(),
			pay_way: this.selector.pay_way,
			type: '2',
		}

		this.adminService.userrecharge(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('充值成功', '');
				this.search();
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
