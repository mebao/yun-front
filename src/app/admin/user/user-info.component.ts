import { Component, OnInit }                     from '@angular/core';
import { ActivatedRoute, Router }                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	id: string;
	userInfo: {
		id: string,
		name: string,
		mobile: string,
		gender: string,
	}
	childs: any[];
	bloodTypeList: any[];
	horoscopeList: any[];
	shengxiaoList: any[];
	childlist: any[];
	token: string;
	editType: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
	}

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '用户详情',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
		})

		this.userInfo = {
			id: '',
			name: '',
			mobile: '',
			gender: '',
		}

		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
		}

		this.childs = [];
		this.bloodTypeList = [];
		this.horoscopeList = [];
		this.shengxiaoList = [];
		this.childlist = [];

		this.getUserInfo();

		//获取头像上传token
		var tokenUrl  = '?type=childCircle';
		this.adminService.qiniutoken(tokenUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.token = JSON.parse(JSON.stringify(data)).uptoken;
			}
		})

		//从缓存中获取clinicdata
		var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			this.setClinicData(JSON.parse(clinicdata));
		}else{
			this.adminService.clinicdata().then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.setClinicData(results);
				}
			});
		}
	}

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
			 + '&id=' + this.id
			 + '&childs=1';
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					this.userInfo = results.users[0];
					this.childs = results.users[0].childs;
					// 更新宝宝生日格式
					if(results.users[0].childs.length > 0){
						for(var i = 0; i < results.users[0].childs.length; i++){
							results.users[0].childs[i].birthday = results.users[0].childs[i].birthday.slice(0, results.users[0].childs[i].birthday.indexOf(' '));
							results.users[0].childs[i].birthdayString = results.users[0].childs[i].birthday;
							results.users[0].childs[i].birthday = this.adminService.dateFormatHasWord(results.users[0].childs[i].birthday);
						}
					}
				}
			}
		})
	}

	selectedFile(_file, key) {
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
		        var imgEle = document.getElementById('imgEle_' + key);
		        reader.readAsDataURL(file);
		        reader.onload = function(f) {
		        	imgEle.setAttribute('src', reader.result);
		        }

		        var xhr = new XMLHttpRequest();
		        xhr.open('post', 'http://upload.qiniu.com/', false);
		        xhr.onreadystatechange = function () {
		            if (xhr.readyState == 4) {
		                if (xhr.status == 200) {
		                    var fileEle = document.getElementById('file_' + key);
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
		var key = this.childlist.length + 1;
		if(this.childlist.length > 0){
			for(var i = 0; i < this.childlist.length; i++){
				this.childlist[i].show = false;
			}
		}
		this.childlist.push({key: key, show: true, use: true});
	}

	update(childInfo) {
		this.editType = 'update';
		var key = this.childlist.length + 1;
		if(this.childlist.length > 0){
			for(var i = 0; i < this.childlist.length; i++){
				this.childlist[i].show = false;
			}
		}
		var child = {
			key: key,
			show: true,
			use: true,
			id: childInfo.childId,
			name: childInfo.childName,
			nickname: childInfo.nickName,
			gender: childInfo.gender == '男' ? 'M' : 'F',
			birth_date: childInfo.birthday,
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
		}
		this.childlist.push(child);
	}

	hideTab(_key) {
		for(var i = 0; i < this.childlist.length; i++){
			if(this.childlist[i].key == _key){
				this.childlist[i].show = !this.childlist[i].show;
			}
		}
	}

	removeChild(_key) {
		for(var i = 0; i < this.childlist.length; i++){
			if(this.childlist[i].key == _key){
				this.childlist[i].use = false;
			}
		}
	}

	createChild(f) {
		// 宝宝信息
		var childData = [];
		if(this.childlist.length > 0){
			var childNum = 0;
			for(var i = 0; i < this.childlist.length; i++){
				if(this.childlist[i].use){
					childNum++;
					var child = {};
					child['username'] = this.adminService.getUser().username;
					child['token'] = this.adminService.getUser().token;
					child['user_id'] = this.id;
					child['id'] = f.value['id_' + this.childlist[i].key];
					//判断姓名
					if(f.value['name_' + this.childlist[i].key]){
						child['name'] = f.value['name_' + this.childlist[i].key];
					}else{
						this.toastTab('宝宝的姓名不可为空', 'error');
						return;
					}
					//判断性别
					if(f.value['gender_' + this.childlist[i].key]){
						child['gender'] = f.value['gender_' + this.childlist[i].key];
					}else{
						this.toastTab('宝宝的性别不可为空', 'error');
						return;
					}
					//判断出生日期
					if(f.value['birth_date_' + this.childlist[i].key]){
						child['birth_date'] = f.value['birth_date_' + this.childlist[i].key];
					}else{
						this.toastTab('宝宝的出生日期不可为空', 'error');
						return;
					}
					//判断头像(不必传)
					if(document.getElementById('file_' + this.childlist[i].key).getAttribute('value') == ''){
						//判断是否存在头像，并且没有修改
						if(this.childlist[i].imageUrl && this.childlist[i].imageUrl != ''){
						}else{
							child['remote_domain'] = '';
							child['remote_file_key'] = '';
						}
					}else{
						child['remote_domain'] = 'http://bcircle.meb.meb168.com';
						child['remote_file_key'] = document.getElementById('file_' + this.childlist[i].key).getAttribute('value');
					}

					//判断血型
					if(f.value['blood_type_' + this.childlist[i].key]){
						child['blood_type'] = f.value['blood_type_' + this.childlist[i].key];
					}
					//判断星座
					if(f.value['horoscope_' + this.childlist[i].key]){
						child['horoscope'] = f.value['horoscope_' + this.childlist[i].key];
					}
					//判断生肖
					if(f.value['shengxiao_' + this.childlist[i].key]){
						child['shengxiao'] = f.value['shengxiao_' + this.childlist[i].key];
					}
					//判断身高
					if(!this.adminService.isFalse(f.value['height_' + this.childlist[i].key]) && parseFloat(f.value['height_' + this.childlist[i].key]) <= 0){
						this.toastTab('宝宝身高不可小于等于0', 'error');
						return;
					}
					if(!this.adminService.isFalse(f.value['height_' + this.childlist[i].key])){
						child['height'] = f.value['height_' + this.childlist[i].key];
					}
					//判断体重
					if(!this.adminService.isFalse(f.value['weight_' + this.childlist[i].key]) && parseFloat(f.value['weight_' + this.childlist[i].key]) <= 0){
						this.toastTab('宝宝体重不可小于等于0', 'error');
						return;
					}
					if(!this.adminService.isFalse(f.value['weight_' + this.childlist[i].key])){
						child['weight'] = f.value['weight_' + this.childlist[i].key];
					}
					//判断昵称
					if(f.value['nickname_' + this.childlist[i].key]){
						child['nickname'] = f.value['nickname_' + this.childlist[i].key];
					}
					//判断头围
					if(!this.adminService.isFalse(f.value['head_circum_' + this.childlist[i].key]) && parseFloat(f.value['head_circum_' + this.childlist[i].key]) <= 0){
						this.toastTab('宝宝头围不可小于等于0', 'error');
						return;
					}
					if(!this.adminService.isFalse(f.value['head_circum_' + this.childlist[i].key])){
						child['head_circum'] = f.value['head_circum_' + this.childlist[i].key];
					}
					//判断胸围
					if(!this.adminService.isFalse(f.value['breast_circum_' + this.childlist[i].key]) && parseFloat(f.value['breast_circum_' + this.childlist[i].key]) <= 0){
						this.toastTab('宝宝胸围不可小于等于0', 'error');
						return;
					}
					if(!this.adminService.isFalse(f.value['breast_circum_' + this.childlist[i].key])){
						child['breast_circum'] = f.value['breast_circum_' + this.childlist[i].key];
					}
					childData.push(child);
				}
			}
			for(var i = 0; i < childData.length; i++){
				if(this.editType == 'create'){
					//新增宝宝
					this.adminService.crmchild(childData[i]).then((data) => {
						if(data.status == 'no'){
							this.toastTab(data.errorMsg, 'error');
						}else{
							this.toastTab('宝宝创建成功', '');
							this.getUserInfo();
							this.childlist = [];
						}
					});
				}else{
					//修改宝宝
					this.adminService.updatechild(childData[i].id, childData[i]).then((data) => {
						if(data.status == 'no'){
							this.toastTab(data.errorMsg, 'error');
						}else{
							this.toastTab('修改成功', '');
							this.getUserInfo();
							this.childlist = [];
						}
					});
				}
			}
		}else{
			this.toastTab('请先录入宝宝信息', 'error');
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
		this.modalConfirmTab = false;
		var urlOptions = this.selector.id + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
		}
		this.adminService.deletechild(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('删除成功', '');
				this.getUserInfo();
				this.childlist = [];
			}
		});
	}

	//宝宝详情
	childInfo(_id) {
		window.open('./admin/childInfo?id=' + _id);
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
