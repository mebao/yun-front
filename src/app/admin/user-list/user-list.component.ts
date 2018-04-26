import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

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
	// 权限
	moduleAuthority: {
		see: boolean,
		add: boolean,
		info: boolean,
		delete: boolean,
		member: boolean,
		recharge: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	users: any[];
	role: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		members: any[],
		member: string,
		member_id: string,
		text: string,
		userBalance: string,
		amount: string,
		give_amount: string,
		pay_way: string,
		actcard: any,
	}
	searchInfo: {
		name: string,
		mobile: string,
		child_name: string,
	}
	url: string;
	memberList: any[];
	uMemberList: any[];
	//充值
	modalTabCharge: boolean;
	// 不可连续点击
	btnCanEdit: boolean;
	modalTabMember: boolean;
	showAddMember: boolean;
	// 购买活动卡
	actcardList: any[];
	modalActcardTab: boolean;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '用户管理',
			back: false,
		}

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

		this.loadingShow = false;

		this.hasData = false;
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			members: [],
			member: '',
			member_id: '',
			text: '',
			userBalance: '',
			amount: '',
			give_amount: '',
			pay_way: '',
			actcard: {},
		}

		if(JSON.parse(sessionStorage.getItem('search-userList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-userList'));
		}else{
			this.searchInfo = {
				name: '',
				mobile: '',
				child_name: '',
			}
		}

		this.users = [];
		this.role = this.adminService.getUser().role;

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.memberList = [];
		this.uMemberList = [];

		//充值
		this.modalTabCharge = false;

		this.search();

		//获取会员列表
		var memberUrl = this.url + '&status=1';
		this.adminService.memberlist(memberUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.memberList = results.list;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});

		this.btnCanEdit = false;
		this.modalTabMember = false;
		this.showAddMember = false;

		// 获取活动卡列表
		this.actcardList = [];
		this.modalActcardTab = false;
		this.getActcardList();
	}

	getData(urlOptions) {
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					for(var i = 0; i < results.users.length; i++){
						results.users[i].membersLength = results.users[i].members.length;
						if(results.users[i].members.length > 0){
							for(var j = 0; j < results.users[i].members.length; j++){
								results.users[i].members[j].use = results.users[i].members[j].canUse == '0' ? false : true;
							}
						}
					}
				}
				this.users = results.users;
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
		sessionStorage.setItem('search-userList', JSON.stringify(this.searchInfo));
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
			members: [],
			member: '',
			member_id: '',
			text: '确认删除该用户？',
			userBalance: '',
			amount: '',
			give_amount: '',
			pay_way: '',
			actcard: {},
		}
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.btnCanEdit = true;
		this.modalConfirmTab = false;
		var urlOptions = this.selector.id + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		this.adminService.deleteuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this.search();
				this._message.success('删除成功');
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	//充值
	closeCharge() {
		this.modalTabCharge = false;
		this.selector = {
			id: '',
			members: [],
			member: '',
			member_id: '',
			text: '',
			userBalance: '',
			amount: '',
			give_amount: '',
			pay_way: '',
			actcard: {},
		}
	}

	charge(user) {
		this.modalTabCharge = true;
		this.selector = {
			id: user.id,
			members: user.members,
			member: '',
			member_id: '',
			text: user.name,
			userBalance: user.userBalance ? user.userBalance : 0,
			amount: '',
			give_amount: '',
			pay_way: '',
			actcard: {},
		}
	}

	confirmCharge() {
		this.btnCanEdit = true;
		// 若是会员存在，则修改
		// if(!this.adminService.isFalse(this.selector.member)){
		//
		// }else{
			this.doCharge();
		// }
	}

	validate() {
		if(this.adminService.isFalse(this.selector.member)){
			this._message.error('会员类型不可为空');
			this.btnCanEdit = false;
			return false;
		}
		if(this.adminService.isFalse(this.selector.amount)){
			this._message.error('支付金额不可为空');
			this.btnCanEdit = false;
			return false;
		}
		if(parseFloat(this.selector.amount) < 0){
			this._message.error('支付金额不可为负数');
			this.btnCanEdit = false;
			return false;
		}
		if(this.adminService.isFalse(this.selector.give_amount)){
			this.selector.give_amount = '0';
		}
		if(parseFloat(this.selector.give_amount) < 0){
			this._message.error('赠送金额不可为负数');
			this.btnCanEdit = false;
			return false;
		}
		if(this.adminService.isFalse(this.selector.pay_way) || this.selector.pay_way == ''){
			this._message.error('支付方式不可为空');
			this.btnCanEdit = false;
			return false;
		}
		// 会员支付时，判断会员余额是否充足
		if(this.selector.pay_way.indexOf('member') != 1){
			if(this.selector.members.length > 0){
				var selectedPayMember = {};
				for(var i = 0; i < this.selector.members.length; i++){
					if(this.selector.members[i].umId == this.selector.pay_way.split('_')[1]){
						selectedPayMember = this.selector.members[i];
					}
				}
				if(parseFloat(this.selector.amount) > parseFloat(selectedPayMember['balance'])){
					this._message.error(selectedPayMember['memberName'] + '余额不足');
					this.btnCanEdit = false;
					return false;
				}
			}
		}
		return true;
	}

	doCharge() {
		if(!this.validate()){
			this.btnCanEdit = false;
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
			pay_way: this.selector.pay_way.indexOf('member_') != -1 ? 'member' : this.selector.pay_way,
			// 为会员充值
			um_id: this.selector.member,
			// 选择会员支付方式
			pay_umid: this.selector.pay_way.indexOf('member_') != -1 ? this.selector.pay_way.split('_')[1] : null,
			type: '2',
		}

		this.adminService.userrecharge(params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('充值成功');
				this.closeCharge();
				this.search();
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	// 设置会员
	setUpMember(user) {
		this.selector = {
			id: user.id,
			members: user.members,
			member: '',
			member_id: '',
			text: user.name,
			userBalance: user.userBalance ? user.userBalance : 0,
			amount: '',
			give_amount: '',
			pay_way: '',
			actcard: {},
		}
		this.uMemberList = [];
		if(this.memberList.length > 0){
			for(var i = 0; i < this.memberList.length; i++){
				if(user.members.length > 0){
					var userHas = false;
					for(var j = 0; j < user.members.length; j++){
						if(this.memberList[i].id == user.members[j].memberId){
							userHas = true;
						}
					}
					if(!userHas){
						this.uMemberList.push(this.memberList[i]);
					}
				}else{
					this.uMemberList = JSON.parse(JSON.stringify(this.memberList));
				}
			}
		}
		if(user.members.length > 0){
			this.showAddMember = false;
		}else{
			this.showAddMember = true;
		}
		this.modalTabMember = true;
	}

	closeMember() {
		this.modalTabMember = false;
		this.closeCharge();
	}

	addMember() {
		this.showAddMember = true;
	}

	confirmMember() {
		this.btnCanEdit = true;
		if(this.adminService.isFalse(this.selector.member)){
			this._message.error('会员类型不可为空');
			this.btnCanEdit = false;
			return false;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			member_id: JSON.parse(this.selector.member).id,
			member_name: JSON.parse(this.selector.member).name,
		}
		this.setmember(this.selector.id, params, 'add', '');
	}

	updateMember(uMember) {
		this.loadingShow = true;
		this.btnCanEdit = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			member_id: uMember.memberId,
			member_name: uMember.memberName,
			um_id: uMember.umId,
			can_use: uMember.canUse == '1' ? '0' : '1',
		}
		this.setmember(this.selector.id, params, 'update', uMember);
	}

	setmember(userId, params, type, uMember) {
		this.adminService.setmember(userId, params).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				if(type == 'update'){
					this.selector.members[this.selector.members.indexOf(uMember)].use = uMember.canUse == '0' ? false : true;
				}
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this.search();
				if(type == 'add'){
					this.closeMember();
				}else{
					this._message.success('会员状态修改成功');
				}
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			if(type == 'update'){
				this.selector.members[this.selector.members.indexOf(uMember)].use = uMember.canUse == '0' ? false : true;
			}
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	changeMember() {
		// 切换购买的会员类型
		if(!this.adminService.isFalse(this.selector.member)){
			this.selector.member_id = this.selector.member;
			this.selector.pay_way = this.selector.pay_way == null ? '' : null;
		}
	}

	// 购买活动卡
	getActcardList() {
		this.adminService.searchactcard(this.url).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.actcardList = results.list;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	closeActcard() {
		this.modalActcardTab = false;
		this.selector = {
			id: '',
			members: [],
			member: '',
			member_id: '',
			text: '',
			userBalance: '',
			amount: '',
			give_amount: '',
			pay_way: '',
			actcard: {},
		}
	}

	setUpActcard(user) {
		this.modalActcardTab = true;
		this.selector = {
			id: user.id,
			members: user.members,
			member: '',
			member_id: '',
			text: user.name,
			userBalance: user.userBalance ? user.userBalance : 0,
			amount: '',
			give_amount: '',
			pay_way: this.selector.pay_way == null ? '' : null,
			actcard: null,
		}
	}

	confirmActcard() {
		if(!this.selector.actcard.id){
			this._message.error('活动卡不可为空');
			return;
		}
		if(!this.selector.amount || this.selector.amount == ''){
			this._message.error('支付金额不可为空');
			return;
		}
		if(!this.selector.pay_way || this.selector.pay_way == ''){
			this._message.error('支付方式不可为空');
			return;
		}
		if(this.selector.pay_way.indexOf('member') != -1){
			var um_id = this.selector.pay_way.split('_')[1];
			var canPay = false;
			for(var index in this.selector.members){
				if(this.selector.members[index].umId == um_id){
					if(parseFloat(this.selector.members[index].balance) >= parseFloat(this.selector.amount)){
						canPay = true;
					}
				}
			}
			if(!canPay){
				this._message.error('会员余额不足');
				return;
			}
		}
		this.btnCanEdit = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			user_id: this.selector.id,
			user_name: this.selector.text,
			activity_id: this.selector.actcard.id,
			amount: this.selector.amount.toString(),
			need_amount: this.selector.actcard.price,
			give_amount: '0',
			pay_way: this.selector.pay_way.indexOf('member') != -1 ? 'member' : this.selector.pay_way,
			um_id: this.selector.pay_way.indexOf('member') != -1 ? this.selector.pay_way.split('_')[1] : null,
		}
        this.adminService.useractcard(params).then((data) => {
            if(data.status == 'no'){
				this.btnCanEdit = false;
                this._message.error(data.errorMsg);
            }else{
				this.btnCanEdit = false;
				this.closeActcard();
                this._message.success('活动卡购买成功');
				this.search();
            }
        }).catch(() => {
			this.btnCanEdit = false;
            this._message.error('服务器错误');
        });
	}
}
