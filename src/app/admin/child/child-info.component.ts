import { Component }                       from '@angular/core';
import { Router, ActivatedRoute }          from '@angular/router';

import { NzMessageService }                from 'ng-zorro-antd';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-child-info',
	templateUrl: './child-info.component.html',
	styleUrls: ['./child-info.component.scss'],
})
export class ChildInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	userInfo: {
		id: string,
		name: string,
		mobile: string,
		gender: string,
		memberId: string,
		memberName: string,
		userBalance: string,
		call_sid: string,
	}
	childInfo: {
		age: string,
		address: string,
		birthday: string,
		bloodType: string,
		bloodTypeText: string,
		childId: string,
		childName: string,
		gender: string,
		headCircum: string,
		height: string,
		horoscope: string,
		horoscopeText: string,
		imageUrl: string,
		isDefault: string,
		legLength: string,
		nickName: string,
		shengxiao: string,
		shengxiaoText: string,
		weight: string,
		remark: string,
	}
	otherChildList: any[];
	url: string;
	pageType: string;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '宝宝详情',
			back: true,
		}

		this.loadingShow = true;

		this.userInfo = {
			id: '',
			name: '',
			mobile: '',
			gender: '',
			memberId: '',
			memberName: '',
			userBalance: '',
			call_sid: '',
		}
		this.childInfo = {
			age: '',
			address: '',
			birthday: '',
			bloodType: '',
			bloodTypeText: '',
			childId: '',
			childName: '',
			gender: '',
			headCircum: '',
			height: '',
			horoscope: '',
			horoscopeText: '',
			imageUrl: '',
			isDefault: '',
			legLength: '',
			nickName: '',
			shengxiao: '',
			shengxiaoText: '',
			weight: '',
			remark: '',
		};
		this.otherChildList = [];

		this.route.queryParams.subscribe((params) => {
			this.childInfo.childId = params.id;
			this.pageType = params.pageType;
		});

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		var urlOptions = this.url + '&childs=1&child_id=' + this.childInfo.childId;
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					this.userInfo = {
						id: results.users[0].id,
						name: results.users[0].name,
						mobile: results.users[0].mobile,
						gender: results.users[0].gender,
						memberId: results.users[0].memberId,
						memberName: results.users[0].memberName,
						userBalance: results.users[0].userBalance,
						call_sid: results.users[0].call_sid,
					}
					if(results.users[0].childs.length > 0){
						for(var i = 0; i < results.users[0].childs.length; i++){
							// 小孩生日更改样式
							if(!this.adminService.isFalse(results.users[0].childs[i].birthday)){
								results.users[0].childs[i].birthday = results.users[0].childs[i].birthday.slice(0, results.users[0].childs[i].birthday.indexOf(' '));
							}
							if(this.childInfo.childId == results.users[0].childs[i].childId){
								this.childInfo = results.users[0].childs[i];
							}else{
								this.otherChildList.push(results.users[0].childs[i]);
							}
							this.childInfo.address = results.users[0].address;
						}
					}
				}
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	calluser() {
		this.loadingShow = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			mobile: this.userInfo.mobile,
			user_id: this.userInfo.id,
		}

		this.adminService.calluser(params).then((data) => {
			this.loadingShow = false;
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.userInfo.call_sid = results.call_sid;
				this._message.success('网络电话拨打成功');
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	hangupuser() {
		this.loadingShow = true;
		var urlOptions = '?username=' + this.adminService.getUser().username
			+ '&token=' + this.adminService.getUser().token
			+ '&clinic_id=' + this.adminService.getUser().clinicId
			+ '&callSid=' + this.userInfo.call_sid;

		this.adminService.hangupuser(urlOptions).then((data) => {
			this.loadingShow = false;
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this.userInfo.call_sid = '';
				this._message.success('网络电话已挂断');
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}
}
