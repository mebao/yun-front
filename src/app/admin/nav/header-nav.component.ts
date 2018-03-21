import { Component, Input, OnInit, ChangeDetectorRef, NgZone }             from '@angular/core';
import { Router }                               from '@angular/router';

import { AdminService }                         from '../admin.service';

import { ToastService }                         from '../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }               from '../../common/nll-toast/toast-model';

import { config }                               from '../../config';

///<reference path="../../common/goeasy/goeasy.d.ts">

@Component({
	selector: 'header-nav',
	templateUrl: './header-nav.component.html',
	styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent {
	@Input() title: string;
	@Input() username: string;
	clinicRole: string;
	clinicName: string;
	messageList: any[];
	messageBtn: boolean;
	payMessageList: any[];
	showSetup: boolean;
	// 支付消息权限
	hasShowPayMessage: boolean;
	modalTabMessage: boolean;
	loadingShow: boolean;
	messageTabType: string;

	constructor(
		public adminService: AdminService,
        private toastService: ToastService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
		private _ngZone: NgZone
	) {}

	ngOnInit(): void {
		this.username = this.adminService.getUser().realname;
		this.clinicRole = this.adminService.getUser().clinicRoleName;
		this.clinicName = this.adminService.getUser().clinicName;
		this.messageList = [];
		this.messageBtn = false;

		this.showSetup = false;
		this.modalTabMessage = false;
		this.loadingShow = false;
		this.messageTabType = '';
		this.getPayMessage('');
		this.getPushPayMessage();

		this.modalTabMessage = false;
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			this.hasShowPayMessage = true;
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRoles'));
			if(authority.length > 0){
				for(var i = 0; i < authority.length; i++){
					if(authority[i].keyName == 'message'){
						if(authority[i].infos.length > 0){
							for(var j = 0; j < authority[i].infos.length; j++){
								if(authority[i].infos[j].keyName == 'pay'){
									this.hasShowPayMessage = true;
								}
							}
						}
					}
				}
			}
		}
	}

	logout() {
		this.adminService.delCookie('user');
		sessionStorage.removeItem('userClinicRoles');
		sessionStorage.removeItem('userClinicRolesInfos');
		this.router.navigate(['./login']);
	}

	showTab(_type) {
		this.messageTabType = _type;
		this.loadingShow = true;
		this.messageList = [];
		if(_type == 'showMessage'){
			var urlOptions = '?username=' + this.adminService.getUser().username
				+ '&token=' + this.adminService.getUser().token
				+ '&clinic_id=' + this.adminService.getUser().clinicId
				+ '&mtlist=' + this.adminService.getUser().messageTypes;
			this.adminService.searchmessage(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					for(var i = 0; i < results.messages.length; i++){
						results.messages[i].complate = false;
					}
					this.messageList = results.messages;
					this.loadingShow = false;
					this.modalTabMessage = true;
				}
			}).catch(() => {
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
				this.toastService.toast(toastCfg);
			});
		}else{
			this.getPayMessage('modalTabMessage');
		}
	}

	handlerTab(handler, _key) {
		if(handler == 'leave'){
			this[_key] = false;
		}
	}

	getPayMessage(_type) {
		this.payMessageList = [];
		var urlOptions = '?username=' + this.adminService.getUser().username
			+ '&token=' + this.adminService.getUser().token
			+ '&clinic_id=' + this.adminService.getUser().clinicId
			+ '&type=pay';
		this.adminService.searchmessage(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				for(var i = 0; i < results.messages.length; i++){
					results.messages[i].complate = false;
				}
				this.payMessageList = results.messages;
				this.loadingShow = false;
				if(_type != ''){
					this.modalTabMessage = true;
				}
				// this.changeDetectorRef.markForCheck();
          		// this.changeDetectorRef.detectChanges();
			}
		}).catch(() => {
			this.loadingShow = false;
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	getPushPayMessage() {
		let that = this;
		// 接受授权推送
		var goEasy = new GoEasy({
			// appkey: 'BS-7bc92c359e3c48399dc20be67c1013a4'
			appkey: 'BS-d413e9f485094b26b4158b18655dfca4'
		});

		// 开启通道前，先关闭通道
		// goEasy.unsubscribe({
		// 	channel: config.message_tran,
		// });

		goEasy.subscribe({
			channel: config.message_tran,
			onMessage: function (message) {
				var tran = JSON.parse(message.content);
				that._ngZone.run(() =>
					that.payMessageList.push({
						id: tran.id,
						typeId: tran.typeId,
						message: tran.message,
						messageUrl: tran.message_url,
						dateCreated: tran.dateCreated,
						complate: false,
					})
				);
			}
		});
	}

	complate(message, index, type) {
		this.messageBtn = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			id: message.id,
		}
		this.adminService.finishmessage(message.id, params).then((data) => {
			if(data.status == 'no'){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				if(type == 'pay'){
					this.payMessageList.splice(index, 1);
				}else{
					this.messageList.splice(index, 1);
				}
				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '消息已完成', 3000);
				this.toastService.toast(toastCfg);
			}
			this.messageBtn = false;
		}).catch(() => {
			this.messageBtn = false;
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误123', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	closeMessage() {
		this.modalTabMessage = false;
	}

	goDetail(message) {
		if(message.typeId == '0'){
			// 支付提醒
			this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: message.messageUrl}});
		}else if(message.typeId == '2'){
			//会员余额提醒
			this.router.navigate(['./admin/userInfo'], {queryParams: {id: message.messageUrl}});
		}else if(message.typeId == '3'){
			// 预约就诊提醒
			this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: message.messageUrl}});
		}
	}

	goUrl(_url) {
		this.router.navigate(['./admin/' + _url]);
	}
}
