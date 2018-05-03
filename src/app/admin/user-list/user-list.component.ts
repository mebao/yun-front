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
		start_amount: string,
		give_scale: string,
		upgradeMember: any,
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
	//充值
	modalTabCharge: boolean;
	upgradeMemberList: any[];
	// 不可连续点击
	btnCanEdit: boolean;
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
			start_amount: '',
			give_scale: '',
			upgradeMember: {},
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

		//充值
		this.modalTabCharge = false;
		this.upgradeMemberList = [];

		// this.search();

		this.btnCanEdit = false;

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
			start_amount: '',
			give_scale: '',
			upgradeMember: {},
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

	// 会员卡升级
	upgradeMember(user) {
		this.loadingShow = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
		}
		this.adminService.memberup(user.id, params).then((data) => {
			this.loadingShow = false;
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this._message.success('会员升级成功');
				this.search();
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	//充值
	closeCharge() {
		this.modalTabCharge = false;
		this.selector = {
			id: '',
			start_amount: '',
			give_scale: '',
			upgradeMember: {},
			member: '',
			member_id: '',
			text: '',
			userBalance: '',
			amount: '',
			give_amount: '',
			pay_way: this.selector.pay_way == '' ? null : '',
			actcard: {},
		}
	}

	charge(user) {
		if(user.memberId != null && user.isNew == 0){
			this._message.error('老会员类型，暂不支持继续充值');
		}else{
			this.loadingShow = true;
			// 通过用户起始金额，获取升级会员等级
			var urlOptions = '?username=' + this.adminService.getUser().username
				+ '&token=' + this.adminService.getUser().token
				+ '&clinic_id=' + this.adminService.getUser().clinicId
				+ '&start_amount=' + user.start_amount;
			this.adminService.memberstart(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this._message.error(data.errorMsg);
				}else{
					this.loadingShow = false;
					var results = JSON.parse(JSON.stringify(data.results));
					this.upgradeMemberList = results.list;
					this.modalTabCharge = true;
					this.selector = {
						id: user.id,
						start_amount: user.start_amount,
						give_scale: user.give_scale,
						upgradeMember: {},
						member: user.memberName,
						member_id: user.memberId,
						text: user.name,
						userBalance: user.userBalance ? user.userBalance : '0.00',
						amount: '',
						give_amount: '',
						pay_way: this.selector.pay_way == '' ? null : '',
						actcard: {},
					}
				}
			}).catch(() => {
				this.loadingShow = false;
				this._message.error('服务器错误');
			});
		}
	}

	changeAmount() {
		this.resetGiveAmount();
	}

	resetGiveAmount() {
		var hasUpgrade = false;
		var give_scale = this.selector.give_scale;
		if(this.upgradeMemberList.length > 0){
			for(var i = 0; i < this.upgradeMemberList.length; i++){
				if(!hasUpgrade){
					if(parseFloat(this.selector.amount) >= ((parseFloat(this.upgradeMemberList[i].startAmount) * 100 - parseFloat(this.selector.start_amount) * 100) / 100)){
						hasUpgrade = true;
						this.selector.upgradeMember = this.upgradeMemberList[i];
					}
				}
			}
			if(hasUpgrade){
				give_scale = this.selector.upgradeMember.giveScale;
			}
		}
		this.selector.give_amount = (parseFloat(this.selector.amount) * 100 * parseFloat(give_scale) / 10000).toString();
	}

	confirmCharge() {
		this.btnCanEdit = true;
		this.doCharge();
	}

	validate() {
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
			type: '2',
			// 升级后的会员等级
			member_id: this.selector.upgradeMember.id ? this.selector.upgradeMember['id'] : null,
			member_name: this.selector.upgradeMember.id ? this.selector.upgradeMember['name'] : null,
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
			start_amount: '',
			give_scale: '',
			upgradeMember: {},
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

	changeActcard() {
		this.selector.amount = this.selector.actcard.price;
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
			start_amount: '',
			give_scale: '',
			upgradeMember: {},
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
			start_amount: '',
			give_scale: '',
			upgradeMember: {},
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
		if(!this.selector.actcard){
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
			if(parseFloat(this.selector.userBalance == null ? '0' : this.selector.userBalance) < parseFloat(this.selector.amount)){
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
