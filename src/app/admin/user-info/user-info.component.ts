import { Component, OnInit }                     from '@angular/core';
import { ActivatedRoute, Router }                from '@angular/router';

import { NzMessageService }                      from 'ng-zorro-antd';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.scss', '../../../assets/css/ant-common.scss'],
})
export class UserInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		info_delete: boolean,
	}
	loadingShow: boolean;
	id: string;
	userInfo: {
		id: string,
		name: string,
		mobile: string,
		gender: string,
		address: string,
		call_sid: string,
	}
	olduserInfo: {
		id: string,
		name: string,
		mobile: string,
		gender: string,
		address: string,
		userBalance: string,
		memberId: string,
		memberName: string,
	}
	childList: any[];
	bloodTypeList: any[];
	horoscopeList: any[];
	shengxiaoList: any[];
	token: string;
	editType: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
	}
	// 不可连续点击
	btnCanEdit: boolean;
	btnUserCanEdit: boolean;
	// 详情还是网络电话
	pageType: string;
	childInfo: {
		type: string,
		id: string,
		name: string,
		nickname: string,
		gender: string,
		birth_date: Date,
		blood_type: string,
		height: string,
		weight: string,
		horoscope: string,
		shengxiao: string,
		imageUrl: string,
		leg_length: string,
		head_circum: string,
		waist_circum: string,
		breast_circum: string,
		remark: string,
	}

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '用户详情',
			back: true,
		}

		// 权限
		this.moduleAuthority = {
			info_delete: false,
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

		this.loadingShow = true;

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
			this.pageType = params.pageType;
		})

		this.userInfo = {
			id: '',
			name: '',
			mobile: '',
			gender: '',
			address: '',
			call_sid: '',
		}

		this.olduserInfo = {
			id: '',
			name: '',
			mobile: '',
			gender: '',
			address: '',
			userBalance: '',
			memberId: '',
			memberName: '',
		}

		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
		}

		this.childList = [];
		this.bloodTypeList = [];
		this.horoscopeList = [];
		this.shengxiaoList = [];

		this.getUserInfo();

		//获取头像上传token
		var tokenUrl  = '?type=childCircle';
		this.adminService.qiniutoken(tokenUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this.token = JSON.parse(JSON.stringify(data)).uptoken;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });

		//从缓存中获取clinicdata
		var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			this.setClinicData(JSON.parse(clinicdata));
		}else{
			this.adminService.clinicdata().then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.setClinicData(results);
				}
			}).catch(() => {
                this._message.error('服务器错误');
            });
		}

		this.btnCanEdit = false;
		this.btnUserCanEdit = false;
		this.initChildInfo();
	}

	initChildInfo() {
		this.childInfo = {
			type: '',
			id: '',
			name: '',
			nickname: '',
			gender: '',
			birth_date: null,
			blood_type: '',
			height: '',
			weight: '',
			horoscope: '',
			shengxiao: '',
			imageUrl: '',
			leg_length: '',
			head_circum: '',
			waist_circum: '',
			breast_circum: '',
			remark: '',
		}
	}

    _disabledStartDate = (startValue) => {
        if (!startValue || !new Date()) {
            return false;
        }
        return startValue.getTime() > new Date().getTime();
    };

	setClinicData(results) {
		for(var index in results.bloodType){
			this.bloodTypeList.push({key: index, value: results.bloodType[index]});
		}
		for(var index in results.horoscope){
			this.horoscopeList.push({key: index, value: results.horoscope[index]});
		}
		for(var index in results.shengxiao){
			this.shengxiaoList.push({key: index, value: results.shengxiao[index]});
		}
	}

	getUserInfo() {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&id=' + this.id
			 + '&childs=1';
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					this.userInfo = results.users[0];
					this.olduserInfo = JSON.parse(JSON.stringify(results.users[0]));
					// 更新宝宝生日格式
					if(results.users[0].childs.length > 0){
						for(var i = 0; i < results.users[0].childs.length; i++){
							results.users[0].childs[i].birthday = results.users[0].childs[i].birthday.slice(0, results.users[0].childs[i].birthday.indexOf(' '));
							results.users[0].childs[i].birthdayString = results.users[0].childs[i].birthday;
							results.users[0].childs[i].birthday = this.adminService.dateFormatHasWord(results.users[0].childs[i].birthday);
						}
					}
					this.childList = results.users[0].childs;
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

	selectedFile(_file) {
		var fff = [];
    	var fileJson = _file.target['files'];
    	for(var index in fileJson){
    		if(fileJson[index]['name'] && fileJson[index]['size']){
	    		var file = fileJson[index];
		        var formData = new FormData();
		        formData.append('file', file);
		        formData.append('name', file.name);
		        formData.append('type', file.type);
		        formData.append('lastModifiedDate', file.lastModifiedDate);
		        formData.append('size', file.size);
		        formData.append('token', this.token);// the qiniu upload accessKey.
		        formData.append('key', (new Date()).getTime() + Math.floor(Math.random() * 100)+'.'+file.name.substr(file.name.lastIndexOf('.')+1));

		        var reader = new FileReader();
		        var imgEle = document.getElementById('imgEle');
		        reader.readAsDataURL(file);
		        reader.onload = function(f) {
		        	imgEle.setAttribute('src', reader.result);
		        }

		        var xhr = new XMLHttpRequest();
		        xhr.open('post', 'http://upload.qiniu.com/', false);
		        xhr.onreadystatechange = function () {
		            if (xhr.readyState == 4) {
		                if (xhr.status == 200) {
		                    var fileEle = document.getElementById('file');
		                    fileEle.setAttribute('value', JSON.parse(xhr.responseText).key);
		                } else {

		                }
		            }
		        };
		        xhr.send(formData);
    		}
    	}
    }

	addChild() {
		this.editType = 'create';
		this.initChildInfo();
		this.childInfo.type = 'create';
	}

	updateuser(){
		this.editType = 'updateuser';
	}

	update(childInfo) {
		this.editType = 'update';
		this.childInfo = {
			type: 'update',
			id: childInfo.childId,
			name: childInfo.childName,
			nickname: childInfo.nickName,
			gender: childInfo.gender == '男' ? 'M' : 'F',
			birth_date: new Date(childInfo.birthday),
			blood_type: childInfo.bloodType,
			height: childInfo.height,
			weight: childInfo.weight,
			horoscope: childInfo.horoscope,
			shengxiao: childInfo.shengxiao,
			imageUrl: childInfo.imageUrl,
			leg_length: childInfo.legLength,
			head_circum: childInfo.headCircum,
			waist_circum: childInfo.waistCircum,
			breast_circum: childInfo.breastCircum,
			remark: childInfo.remark,
		}
	}

	// 预约
	booking(child) {
		sessionStorage.setItem('childList-childName', child.childName);
		this.router.navigate(['./admin/booking'], {queryParams: {childId: child.childId, type: 'createUserInfo'}});
	}

	cancel() {
		this.editType = '';
		this.initChildInfo();
	}

	createUser(){
		this.userInfo.name = this.adminService.trim(this.userInfo.name);
		this.userInfo.mobile = this.adminService.trim(this.userInfo.mobile);
		if(this.userInfo.name == ''){
			this._message.error('姓名不可为空');
			this.btnUserCanEdit = false;
			return;
		}
		if(this.userInfo.name.length > 10){
			this._message.error('姓名最多十位');
			this.btnUserCanEdit = false;
			return;
		}
		if(this.userInfo.mobile == ''){
			this._message.error('手机号码不可为空');
			this.btnUserCanEdit = false;
			return;
		}
		if(this.userInfo.mobile.length != 11 || !this.adminService.checkMobile(this.userInfo.mobile)){
			this._message.error('手机号码不正确');
			this.btnUserCanEdit = false;
			return;
		}
		if(this.userInfo.gender == ''){
			this._message.error('性别不可为空');
			this.btnUserCanEdit = false;
			return;
		}
		this.loadingShow = true;
		// 修改个人信息
		var user = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			id: this.userInfo.id,
			name: this.userInfo.name,
			mobile: this.userInfo.mobile,
			gender: this.userInfo.gender,
			address: this.userInfo.address,
		}
		this.adminService.createUser(user).then((data) => {
			this.loadingShow = false;
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnUserCanEdit = false;
			}else{
				this.editType = '';
				this._message.success('修改成功');
				this.getUserInfo();
				this.btnUserCanEdit = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
			this.btnUserCanEdit = false;
        });
	}

	createChild() {
		this.btnCanEdit = true;
		// 宝宝信息
		var childNum = 0;
		childNum++;
		var child = {};
		child['username'] = this.adminService.getUser().username;
		child['token'] = this.adminService.getUser().token;
		child['clinic_id'] = this.adminService.getUser().clinicId;
		child['user_id'] = this.id;
		child['id'] = this.childInfo.id;
		this.childInfo.name = this.adminService.trim(this.childInfo.name);
		this.childInfo.nickname = this.adminService.trim(this.childInfo.nickname);
		this.childInfo.remark = this.adminService.trim(this.childInfo.remark);
		//判断姓名
		if(this.childInfo.name){
			child['name'] = this.childInfo.name;
		}else{
			this._message.error('宝宝的姓名不可为空');
			this.btnCanEdit = false;
			return;
		}
		//判断性别
		if(this.childInfo.gender){
			child['gender'] = this.childInfo.gender;
		}else{
			this._message.error('宝宝的性别不可为空');
			this.btnCanEdit = false;
			return;
		}
		//判断出生日期
		if(!this.adminService.isFalse(this.childInfo.birth_date)){
			child['birth_date'] = this.adminService.getDayByDate(new Date(this.childInfo.birth_date));
		}else{
			this._message.error('宝宝的出生日期不可为空');
			this.btnCanEdit = false;
			return;
		}
		//判断头像(不必传)
		if(document.getElementById('file').getAttribute('value') == ''){
			//判断是否存在头像，并且没有修改
			if(this.childInfo.imageUrl && this.childInfo.imageUrl != ''){
			}else{
				child['remote_domain'] = '';
				child['remote_file_key'] = '';
			}
		}else{
			child['remote_domain'] = 'http://bcircle.meb.meb168.com';
			child['remote_file_key'] = document.getElementById('file').getAttribute('value');
		}

		//判断血型
		if(this.childInfo.blood_type){
			child['blood_type'] = this.childInfo.blood_type;
		}
		//判断星座
		if(this.childInfo.horoscope){
			child['horoscope'] = this.childInfo.horoscope;
		}
		//判断生肖
		if(this.childInfo.shengxiao){
			child['shengxiao'] = this.childInfo.shengxiao;
		}
		//判断身高
		if(!this.adminService.isFalse(this.childInfo.height) && parseFloat(this.childInfo.height) <= 0){
			this._message.error('宝宝身高不可小于等于0');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.childInfo.height)){
			child['height'] = this.childInfo.height;
		}
		//判断体重
		if(!this.adminService.isFalse(this.childInfo.weight) && parseFloat(this.childInfo.weight) <= 0){
			this._message.error('宝宝体重不可小于等于0');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.childInfo.weight)){
			child['weight'] = this.childInfo.weight;
		}
		//判断昵称
		if(this.childInfo.nickname){
			child['nickname'] = this.childInfo.nickname;
		}
		//判断头围
		if(!this.adminService.isFalse(this.childInfo.head_circum) && parseFloat(this.childInfo.head_circum) <= 0){
			this._message.error('宝宝头围不可小于等于0');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.childInfo.head_circum)){
			child['head_circum'] = this.childInfo.head_circum;
		}
		//判断胸围
		if(!this.adminService.isFalse(this.childInfo.breast_circum) && parseFloat(this.childInfo.breast_circum) <= 0){
			this._message.error('宝宝胸围不可小于等于0');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.childInfo.breast_circum)){
			child['breast_circum'] = this.childInfo.breast_circum;
		}
		//判断备注
		if(this.childInfo.remark){
			child['remark'] = this.childInfo.remark;
		}
		this.loadingShow = true;
		if(this.editType == 'update'){
			//修改宝宝
			this.adminService.updatechild(child['id'], child).then((data) => {
				this.loadingShow = false;
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this.editType = '';
					this._message.success('修改成功');
					this.getUserInfo();
					this.initChildInfo();
					this.btnCanEdit = false;
				}
			}).catch(() => {
				this.loadingShow = false;
                this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}else{
			//新增宝宝
			this.adminService.crmchild(child).then((data) => {
				this.loadingShow = false;
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('宝宝创建成功');
					this.getUserInfo();
					this.initChildInfo();
					this.btnCanEdit = false;
				}
			}).catch(() => {
				this.loadingShow = false;
                this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	delete(child) {
		this.selector = {
			id: child.childId,
			text: '确认删除该宝宝？',
		}
		this.modalConfirmTab = true;
	}

	confirm() {
		this.loadingShow = true;
		this.btnCanEdit = true;
		this.modalConfirmTab = false;
		var urlOptions = this.selector.id + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		this.adminService.deletechild(urlOptions).then((data) => {
			this.loadingShow = false;
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('删除成功');
				this.getUserInfo();
				this.initChildInfo();
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}

	//宝宝详情
	showChildInfo(_id) {
		window.open('./admin/child/info?id=' + _id);
	}
}
