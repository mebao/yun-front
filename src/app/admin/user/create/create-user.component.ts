import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute }        from '@angular/router';

import { NzMessageService }              from 'ng-zorro-antd';

import { AdminService }                  from '../../admin.service';

@Component({
	selector: 'app-create-user',
	templateUrl: './create-user.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss'],
})
export class CreateUserComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	role: string;
	user: {
		name: string,
		mobile: string,
		gender: string,
		address: string,
	}
	child: {
		type: string,
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
	}
	bloodTypeList: any[];
	horoscopeList: any[];
	shengxiaoList: any[];
	fileList: any[];
	token: string;
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '创建用户',
			back: true,
		}

		this.user = {
			name: '',
			mobile: '',
			gender: '',
			address: '',
		}
		this.child = {
			type: '',
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
		}

		this.bloodTypeList = [];
		this.horoscopeList = [];
		this.shengxiaoList = [];
		this.fileList = [];

		this.role = this.adminService.getUser().role;

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

		this.btnCanEdit = false;
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

    _disabledStartDate = (startValue) => {
        if (!startValue || !new Date()) {
            return false;
        }
        return startValue.getTime() > new Date().getTime();
    };

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

	create(): void {
		this.btnCanEdit = true;
		this.user.name = this.user.name.trim();
		this.user.mobile = this.user.mobile.trim();
		if(this.user.name == ''){
			this._message.error('姓名不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.user.name.length > 10){
			this._message.error('姓名最多十位');
			this.btnCanEdit = false;
			return;
		}
		if(this.user.mobile == ''){
			this._message.error('手机号码不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.user.mobile.length != 11 || !this.adminService.checkMobile(this.user.mobile)){
			this._message.error('手机号码不正确');
			this.btnCanEdit = false;
			return;
		}
		if(this.user.gender == ''){
			this._message.error('性别不可为空');
			this.btnCanEdit = false;
			return;
		}
		//宝宝信息
		var childInfo = {};
		if(this.child.type != ''){
			var childNum = 0;
			childNum++;
			childInfo['username'] = this.adminService.getUser().username;
			childInfo['token'] = this.adminService.getUser().token;
			childInfo['clinic_id'] = this.adminService.getUser().clinicId;
			childInfo['user_id'] = '';
			this.child.name = this.child.name.trim();
			this.child.nickname = this.child.nickname.trim();
			//判断姓名
			if(this.child.name){
				childInfo['name'] = this.child.name;
			}else{
				this._message.error('宝宝的姓名不可为空');
				this.btnCanEdit = false;
				return;
			}
			//判断性别
			if(this.child.gender){
				childInfo['gender'] = this.child.gender;
			}else{
				this._message.error('宝宝的性别不可为空');
				this.btnCanEdit = false;
				return;
			}
			//判断出生日期
			if(!this.adminService.isFalse(this.child.birth_date)){
				childInfo['birth_date'] = this.adminService.getDayByDate(new Date(this.child.birth_date));
			}else{
				this._message.error('宝宝的出生日期不可为空');
				this.btnCanEdit = false;
				return;
			}
			//判断头像(不必传)
			if(document.getElementById('file').getAttribute('value') == ''){
				childInfo['remote_domain'] = '';
				childInfo['remote_file_key'] = '';
			}else{
				childInfo['remote_domain'] = 'http://bcircle.meb.meb168.com';
				childInfo['remote_file_key'] = document.getElementById('file').getAttribute('value');
			}
			//判断血型
			if(this.child.blood_type){
				childInfo['blood_type'] = this.child.blood_type;
			}
			//判断星座
			if(this.child.horoscope){
				childInfo['horoscope'] = this.child.horoscope;
			}
			//判断生肖
			if(this.child.shengxiao){
				childInfo['shengxiao'] = this.child.shengxiao;
			}
			//判断身高
			if(!this.adminService.isFalse(this.child.height) && parseFloat(this.child.height) <= 0){
				this._message.error('宝宝身高不可小于等于0');
				this.btnCanEdit = false;
				return;
			}
			if(!this.adminService.isFalse(this.child.height)){
				childInfo['height'] = this.child.height;
			}
			//判断体重
			if(!this.adminService.isFalse(this.child.weight) && parseFloat(this.child.weight) <= 0){
				this._message.error('宝宝体重不可小于等于0');
				this.btnCanEdit = false;
				return;
			}
			if(!this.adminService.isFalse(this.child.weight)){
				childInfo['weight'] = this.child.weight;
			}
			//判断昵称
			if(this.child.nickname){
				childInfo['nickname'] = this.child.nickname;
			}
			//判断头围
			if(!this.adminService.isFalse(this.child.head_circum) && parseFloat(this.child.head_circum) <= 0){
				this._message.error('宝宝头围不可小于等于0');
				this.btnCanEdit = false;
				return;
			}
			if(!this.adminService.isFalse(this.child.head_circum)){
				childInfo['head_circum'] = this.child.head_circum;
			}
			//判断胸围
			if(!this.adminService.isFalse(this.child.breast_circum) && parseFloat(this.child.breast_circum) <= 0){
				this._message.error('宝宝胸围不可小于等于0');
				this.btnCanEdit = false;
				return;
			}
			if(!this.adminService.isFalse(this.child.breast_circum)){
				childInfo['breast_circum'] = this.child.breast_circum;
			}
		}
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			mobile: this.user.mobile,
			gender: this.user.gender,
			name: this.user.name,
			address: this.user.address,
		}
		this.adminService.createUser(param).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(childInfo['name']){
					childInfo['user_id'] = results.userid;
					this.adminService.crmchild(childInfo).then((data) => {
						if(data.status == 'no'){
							this._message.error(data.errorMsg);
							this.btnCanEdit = false;
						}else{
							this._message.success('用户创建成功');
							setTimeout(() =>　{
								this.router.navigate(['./admin/userInfo'], {queryParams: {id: results.userid}});
							}, 2000);
						}
					}).catch(() => {
		                this._message.error('服务器错误');
						this.btnCanEdit = false;
		            });
				}else{
					this._message.success('用户创建成功');
					setTimeout(() =>　{
						this.router.navigate(['./admin/userInfo'], {queryParams: {id: results.userid}});
					}, 2000);
				}
			}
		}).catch(() => {
            this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}

	goUrl(_url) {
		this.router.navigate([_url])
	}

	addChild() {
		this.child = {
			type: 'add',
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
		}
	}

	removeChild(_key) {
		this.child = {
			type: '',
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
		}
	}
}
