import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute }        from '@angular/router';

import { AdminService }                  from '../../admin.service';

@Component({
	selector: 'app-create-user',
	templateUrl: './create-user.component.html'
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
	}
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	childlist: any[];
	bloodTypeList: any[];
	horoscopeList: any[];
	shengxiaoList: any[];
	fileList: any[];
	token: string;
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '创建用户',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.user = {
			name: '',
			mobile: '',
			gender: '',
		}

		this.childlist = [];
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
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.setClinicData(results);
				}
			});
		}

		//获取头像上传token
		var tokenUrl  = '?type=childCircle';
		this.adminService.qiniutoken(tokenUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.token = JSON.parse(JSON.stringify(data)).uptoken;
			}
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

	// 选择日期
	changeDate(value, key) {
		this.childlist[key].birth_date = JSON.parse(value).value;
	}

	create(f): void {
		this.btnCanEdit = true;
		f.value.name = this.adminService.trim(f.value.name);
		f.value.mobile = this.adminService.trim(f.value.mobile);
		if(f.value.name == ''){
			this.toastTab('姓名不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.name.length > 10){
			this.toastTab('姓名最多十位', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.mobile == ''){
			this.toastTab('手机号码不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.mobile.length != 11 || !this.adminService.checkMobile(f.value.mobile)){
			this.toastTab('手机号码不正确', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.gender == ''){
			this.toastTab('性别不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		//宝宝信息
		var childData = [];
		if(this.childlist.length > 0){
			var childNum = 0;
			for(var i = 0; i < this.childlist.length; i++){
				if(this.childlist[i].use){
					childNum++;
					var child = {};
					child['username'] = this.adminService.getUser().username;
					child['token'] = this.adminService.getUser().token;
					child['clinic_id'] = this.adminService.getUser().clinicId;
					child['user_id'] = '';
					f.value['name_' + this.childlist[i].key] = this.adminService.trim(f.value['name_' + this.childlist[i].key]);
					f.value['nickname_' + this.childlist[i].key] = this.adminService.trim(f.value['nickname_' + this.childlist[i].key]);
					//判断姓名
					if(f.value['name_' + this.childlist[i].key]){
						child['name'] = f.value['name_' + this.childlist[i].key];
					}else{
						this.toastTab('宝宝的姓名不可为空', 'error');
						this.btnCanEdit = false;
						return;
					}
					//判断性别
					if(f.value['gender_' + this.childlist[i].key]){
						child['gender'] = f.value['gender_' + this.childlist[i].key];
					}else{
						this.toastTab('宝宝的性别不可为空', 'error');
						this.btnCanEdit = false;
						return;
					}
					//判断出生日期
					if(!this.adminService.isFalse(this.childlist[i].birth_date)){
						child['birth_date'] = this.childlist[i].birth_date;
					}else{
						this.toastTab('宝宝的出生日期不可为空', 'error');
						this.btnCanEdit = false;
						return;
					}
					//判断头像(不必传)
					if(document.getElementById('file_' + this.childlist[i].key).getAttribute('value') == ''){
						child['remote_domain'] = '';
						child['remote_file_key'] = '';
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
						this.btnCanEdit = false;
						return;
					}
					if(!this.adminService.isFalse(f.value['height_' + this.childlist[i].key])){
						child['height'] = f.value['height_' + this.childlist[i].key];
					}
					//判断体重
					if(!this.adminService.isFalse(f.value['weight_' + this.childlist[i].key]) && parseFloat(f.value['weight_' + this.childlist[i].key]) <= 0){
						this.toastTab('宝宝体重不可小于等于0', 'error');
						this.btnCanEdit = false;
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
						this.btnCanEdit = false;
						return;
					}
					if(!this.adminService.isFalse(f.value['head_circum_' + this.childlist[i].key])){
						child['head_circum'] = f.value['head_circum_' + this.childlist[i].key];
					}
					//判断胸围
					if(!this.adminService.isFalse(f.value['breast_circum_' + this.childlist[i].key]) && parseFloat(f.value['breast_circum_' + this.childlist[i].key]) <= 0){
						this.toastTab('宝宝胸围不可小于等于0', 'error');
						this.btnCanEdit = false;
						return;
					}
					if(!this.adminService.isFalse(f.value['breast_circum_' + this.childlist[i].key])){
						child['breast_circum'] = f.value['breast_circum_' + this.childlist[i].key];
					}
					childData.push(child);
				}
			}
		}
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			mobile: f.value.mobile,
			gender: f.value.gender,
			name: f.value.name,
		}
		this.adminService.createUser(param).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(childData.length > 0){
					for(var i = 0; i < childData.length; i++){
						childData[i]['user_id'] = results.userid;
						this.adminService.crmchild(childData[i]).then((data) => {
							if(data.status == 'no'){
								this.toastTab(data.errorMsg, 'error');
								this.btnCanEdit = false;
							}else{
								this.toastTab('用户创建成功', '');
								setTimeout(() =>　{
									this.router.navigate(['./admin/userInfo'], {queryParams: {id: results.userid}});
								}, 2000);
							}
						})
					}
				}else{
					this.toastTab('用户创建成功', '');
					setTimeout(() =>　{
						this.router.navigate(['./admin/userInfo'], {queryParams: {id: results.userid}});
					}, 2000);
				}
			}
		})
	}

	goUrl(_url) {
		this.router.navigate([_url])
	}

	addChild() {
		var key = this.childlist.length;
		if(this.childlist.length > 0){
			for(var i = 0; i < this.childlist.length; i++){
				this.childlist[i].show = false;
			}
		}
		this.childlist.push({key: key, show: true, use: true});
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
