import { Component, Input, OnInit, ChangeDetectorRef, NgZone, Output, EventEmitter } from '@angular/core';
import { Router }                               from '@angular/router';

import { AdminService }                         from '../admin.service';

import { NzMessageService, NzModalService }     from 'ng-zorro-antd';

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
	// web主题
	@Input() theme: string;
	theme_name: string;
	@Output() onVotedTheme = new EventEmitter<string>();
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
	modalConfirmMessage: boolean;
	selectedMessage: {
		message: any,
		index: string,
		type: string,
		feedback: string,
	}

	constructor(
		public adminService: AdminService,
        private _message: NzMessageService,
		private confirmServ: NzModalService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
		private _ngZone: NgZone
	) {}

	ngOnInit(): void {
		this.username = this.adminService.getUser().realname;
		this.clinicRole = this.adminService.getUser().clinicRoleName;
		this.clinicName = this.adminService.getUser().clinicName;
		document.title = this.clinicName;
		this.messageList = [];
		this.messageBtn = false;

		this.changeThemeName(this.theme);

		this.showSetup = false;
		this.modalTabMessage = false;
		this.loadingShow = false;
		this.messageTabType = '';
		this.payMessageList = [];
		this.getPayMessage('');

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
			if(this.hasShowPayMessage){
				this.getPushPayMessage();
			}
		}

		this.modalConfirmMessage = false;
		this.selectedMessage = {
			message: {},
			index: '',
			type: '',
			feedback: '',
		}
	}

	changeThemeName(theme) {
		switch(theme) {
			case '':
				this.theme_name = '默认';
				break;
			case 'theme_green':
				this.theme_name = '绿色';
				break;
			case 'theme_green2':
				this.theme_name = '淡绿色';
				break;
			case 'theme_gray':
				this.theme_name = '深灰色';
				break;
			case 'theme_blue':
				this.theme_name = '蓝色';
				break;
			case 'theme_4':
				this.theme_name = '4';
				break;
			case 'theme_brown':
				this.theme_name = '棕色';
				break;
			case 'theme_brown2':
				this.theme_name = '淡棕色';
				break;
			case 'theme_yellow':
				this.theme_name = '淡黄色';
				break;
		}
	}

	logout() {
		var that = this;
		this.confirmServ.confirm({
	      	title: '提示',
	      	content: '确认退出？',
	      	okText: '确定',
	      	cancelText: '取消',
			onOk() {
				that.adminService.delCookie('user');
				sessionStorage.removeItem('userClinicRoles');
				sessionStorage.removeItem('userClinicRolesInfos');
				that.router.navigate(['./login']);
	      	},
	      	onCancel() {

	      	}
		});
	}

	showTab(_type) {
		if(_type == 'showSetup'){
			this.showSetup = !this.showSetup;
		}else{
			this.messageTabType = _type;
			this.loadingShow = true;
			this.messageList = [];
			if(_type.indexOf('showMessage') != -1){
				var urlOptions = '?username=' + this.adminService.getUser().username
					+ '&token=' + this.adminService.getUser().token
					+ '&clinic_id=' + this.adminService.getUser().clinicId
					+ '&mtlist=' + this.adminService.getUser().messageTypes
					+ (_type == 'showMessage_myself' ? '&myself=1' : '');
				this.adminService.searchmessage(urlOptions).then((data) => {
					if(data.status == 'no'){
						this.loadingShow = false;
						this._message.error(data.errorMsg);
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
					this._message.error('服务器错误');
				});
			}else{
				this.getPayMessage('modalTabMessage');
			}
		}
	}

	handlerTab(handler, _key) {
		if(handler == 'leave'){
			this[_key] = false;
		}
	}

	getPayMessage(_type) {
		var urlOptions = '?username=' + this.adminService.getUser().username
			+ '&token=' + this.adminService.getUser().token
			+ '&clinic_id=' + this.adminService.getUser().clinicId
			+ '&type=pay';
		this.adminService.searchmessage(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
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
			this._message.error('服务器错误');
		});
	}

	getPushPayMessage() {
		let that = this;
		// 接受授权推送
		var goEasy = new GoEasy({
			appkey: 'BS-7bc92c359e3c48399dc20be67c1013a4'
			// appkey: 'BS-d413e9f485094b26b4158b18655dfca4'
		});

		// 开启通道前，先关闭通道
		// goEasy.unsubscribe({
		// 	channel: config.message_tran(),
		// });

		goEasy.subscribe({
			channel: config.message_tran(),
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

	closeModalComplateM() {
		this.modalConfirmMessage = false;
		this.selectedMessage = {
			message: {},
			index: '',
			type: '',
			feedback: '',
		}
	}

	showModalMessage(message, index, type) {
		this.selectedMessage = {
			message: message,
			index: index,
			type: type,
			feedback: '',
		}
		this.modalConfirmMessage = true;
	}

	complate(message, index, type) {
		// this.modalTabMessage = false;
		this.loadingShow = true;
		this.messageBtn = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			id: message.id,
			feedback: type == '' ? this.selectedMessage.feedback : null,
		}
		this.adminService.finishmessage(message.id, params).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				if(type == 'pay'){
					this.payMessageList.splice(index, 1);
					this.getPayMessage('');
				}else{
					this.loadingShow = false;
					this.messageList.splice(index, 1);
					this.closeModalComplateM();
				}
				this._message.success('消息已完成');
			}
			this.messageBtn = false;
		}).catch(() => {
			this.loadingShow = false;
			this.messageBtn = false;
			this.closeModalComplateM();
			this._message.error('服务器错误');
		});
	}

	closeMessage() {
		this.modalTabMessage = false;
	}

	goDetail(message) {
		this.modalTabMessage = false;
		if(message.typeId == '0'){
			// 支付提醒
			this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: message.messageUrl}});
		}else if(message.typeId == '2'){
			//会员余额提醒
			this.router.navigate(['./admin/userInfo'], {queryParams: {id: message.messageUrl}});
		}else if(message.typeId == '3' || message.typeId == '5'){
			// 预约就诊提醒
			this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: message.messageUrl}});
		}
	}

	goUrl(_url) {
		this.router.navigate(['./admin/' + _url]);
	}

	changeTheme(_theme) {
		this.onVotedTheme.emit(_theme);
		this.changeThemeName(_theme);
	}
}
