import { Component, Input, OnInit, ChangeDetectorRef, NgZone }             from '@angular/core';
import { Router }                               from '@angular/router';

import { AdminService }                         from '../admin.service';

import { ToastService }                         from '../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }               from '../../common/nll-toast/toast-model';

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
	showMessage: boolean;
	messageLoading: boolean;
	messageList: any[];
	messageBtn: boolean;
	showPayMessage: boolean;
	payMessageList: any[];
	showSetup: boolean;
	// 支付消息权限
	hasShowPayMessage: boolean;

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
		this.showMessage = false;
		this.messageLoading = false;
		this.messageList = [];
		this.messageBtn = false;

		this.showPayMessage = false;
		this.payMessageList = [];
		this.showSetup = false;
		this.getPayMessage();
		this.getPushPayMessage();

		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			this.hasShowPayMessage = true;
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRoles'));
			var hasBookingInfo = false;
			var hasTransactionStatistics = false;
			if(authority.length > 0){
				for(var i = 0; i < authority.length; i++){
					if(authority[i].keyName == 'bookingList'){
						if(authority[i].infos.length > 0){
							for(var j = 0; j < authority[i].infos.length; j++){
								if(authority[i].infos[j].keyName == 'info'){
									hasBookingInfo = true;
								}
							}
						}
					}
					if(authority[i].keyName == 'transactionStatistics'){
						if(authority[i].infos.length > 0){
							for(var j = 0; j < authority[i].infos.length; j++){
								if(authority[i].infos[j].keyName == 'see'){
									hasTransactionStatistics = true;
								}
							}
						}
					}
				}
			}
			this.hasShowPayMessage = hasBookingInfo && hasTransactionStatistics;
		}
	}

	logout() {
		this.adminService.delCookie('user');
		sessionStorage.removeItem('userClinicRoles');
		sessionStorage.removeItem('userClinicRolesInfos');
		this.router.navigate(['./login']);
	}

	showTab(_key) {
		this[_key] = !this[_key];
		if(_key == 'showMessage'){
			this.messageLoading = true;
			this.messageList = [];
			var urlOptions = '?username=' + this.adminService.getUser().username
				+ '&token=' + this.adminService.getUser().token
				+ '&clinic_id=' + this.adminService.getUser().clinicId
				+ '&mtlist=' + this.adminService.getUser().messageTypes;
			this.adminService.searchmessage(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.messageLoading = false;
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
				}else{
					this.messageLoading = false;
					var results = JSON.parse(JSON.stringify(data.results));
					for(var i = 0; i < results.messages.length; i++){
						results.messages[i].complate = false;
					}
					this.messageList = results.messages;
				}
			}).catch(() => {
				this.messageLoading = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
				this.toastService.toast(toastCfg);
			});
		}
	}

	handlerTab(handler, _key) {
		if(handler == 'leave'){
			this[_key] = false;
		}
	}

	getPayMessage() {
		var urlOptions = '?username=' + this.adminService.getUser().username
			+ '&token=' + this.adminService.getUser().token
			+ '&clinic_id=' + this.adminService.getUser().clinicId
			+ '&type=pay';
		this.adminService.searchmessage(urlOptions).then((data) => {
			if(data.status == 'no'){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				for(var i = 0; i < results.messages.length; i++){
					results.messages[i].complate = false;
				}
				this.payMessageList = results.messages;
				// this.changeDetectorRef.markForCheck();
          //  		this.changeDetectorRef.detectChanges();
			}
		}).catch(() => {
			this.messageLoading = false;
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	getPushPayMessage() {
		let that = this;
		// 接受授权推送
		var goEasy = new GoEasy({
			appkey: 'BS-7bc92c359e3c48399dc20be67c1013a4'
		});

		goEasy.subscribe({
			channel: 'message_tran',
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

	bookingInfo(message) {
		this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: message.messageUrl}});
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

	goUrl(_url) {
		this.router.navigate(['./admin/' + _url]);
	}
}
