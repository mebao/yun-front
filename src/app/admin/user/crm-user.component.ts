import { Component, OnInit }            from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';

import { AdminService }                 from '../admin.service';
import { LeftNavComponent }             from '../nav/left-nav.component';
import { HeaderNavComponent }           from '../nav/header-nav.component';
import { DropDownComponent }            from '../../common/dropdown/dropdown.component';

@Component({
	selector: 'app-create-admin',
	templateUrl: './crm-user.component.html'
})
export class CrmUserComponent implements OnInit{
	clinics: any[];
	roles: any[];
	academicTitle: any[];
	clinicalTitle: any[];
	addDoctor: boolean;
	user: {
		mobile: string,
		user_name: string,
		real_name: string,
		role: string,
		gender: string,
		academical_title: string,
		clinical_title: string,
		description: string,
	}
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	token: string;
	id: string;
	editType: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.addDoctor = false;

		this.user = {
			mobile: '',
			user_name: '',
			real_name: '',
			role: '',
			gender: '',
			academical_title: '',
			clinical_title: '',
			description: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		})

		if(this.id && this.id != ''){
			this.editType = 'update';
			//获取用户信息
			var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
			this.adminService.adminlist(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.adminlist.length > 0){
						for(var i = 0; i < results.adminlist.length; i++){
							if(this.id == results.adminlist[i].id){
								this.user.mobile = results.adminlist[i].mobile;
								this.user.user_name = results.adminlist[i].username;
								this.user.real_name = results.adminlist[i].realName;
								this.user.gender = results.adminlist[i].doctorProfile.gender;
								this.user.academical_title = results.adminlist[i].doctorProfile.atitle;
								this.user.clinical_title = results.adminlist[i].doctorProfile.ctitle;
								this.user.description = results.adminlist[i].doctorProfile.description;
								//判断是否为医生
								if(JSON.stringify(results.adminlist[i].doctorProfile).length != 2){
									this.addDoctor = true;
								}
								document.getElementById('imgEle').setAttribute('src', results.adminlist[i].avatarUrl);
								document.getElementById('file').setAttribute('value', results.adminlist[i].avatarUrl);
							}
						}
					}
				}
			})
		}else{
			this.editType = 'create';
		}


		//获取头像上传token
		var tokenUrl  = '?type=childCircle';
		this.adminService.qiniutoken(tokenUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.token = JSON.parse(JSON.stringify(data)).uptoken;
			}
		})

		this.adminService.clinicdata().then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.clinics = results.clinics;
				//角色
				var roles = [];
				for(var i in results.roles){
					roles.push({id: i, name: results.roles[i]});
				}
				this.roles = roles;
				//学术职称
				var academicTitle = [];
				for(var i in results.academicTitle){
					academicTitle.push({id: i, name: results.academicTitle[i]});
				}
				this.academicTitle = academicTitle;
				//医生职称
				var clinicalTitle = [];
				for(var i in results.clinicalTitle){
					clinicalTitle.push({id: i, name: results.clinicalTitle[i]});
				}
				this.clinicalTitle = clinicalTitle;
			}
		})
	}

	selectedFile(_file) {
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

	create(f): void {
		var imgUrl = document.getElementById('file').getAttribute('value');
		if(imgUrl == ''){
			this.toastTab('头像未上传', 'error');
			return;
		}
		if(f.value.mobile == ''){
			this.toastTab('手机号码不可为空', 'error');
			return;
		}
		if(f.value.mobile.length != 11){
			this.toastTab('手机号码输入不正确', 'error');
			return;
		}
		if(f.value.user_name == ''){
			this.toastTab('用户名不可为空', 'error');
			return;
		}
		if(f.value.real_name == ''){
			this.toastTab('真实姓名不可为空', 'error');
			return;
		}
		if(f.value.role == ''){
			this.toastTab('角色不可为空', 'error');
			return;
		}
		if(this.addDoctor){
			if(f.value.gender == ''){
				this.toastTab('性别不可为空', 'error');
				return;
			}
			if(f.value.academical_title == ''){
				this.toastTab('学术职称不可为空', 'error');
				return;
			}
			if(f.value.clinical_title == ''){
				this.toastTab('医生职称不可为空', 'error');
				return;
			}
			if(f.value.description == ''){
				this.toastTab('医生简介不可为空', 'error');
				return;
			}
		}
		if(this.editType == 'create'){
			var param = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				mobile: f.value.mobile,
				user_name: f.value.user_name,
				real_name: f.value.real_name,
				clinic_id: this.adminService.getUser().clinicId,
				role: f.value.role,
				gender: this.addDoctor ? f.value.gender : null,
				academical_title: this.addDoctor ? f.value.academical_title : null,
				clinical_title: this.addDoctor ? f.value.clinical_title : null,
				description: this.addDoctor ? f.value.description : null,
				avatar_url: this.addDoctor ? 'http://static.jiabaokangle.com/' + imgUrl : null,
			}
			this.adminService.create(param).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/crmUserList']);
					}, 2000)
				}
			})
		}else{
			var updateParam = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				mobile: f.value.mobile,
				user_name: f.value.user_name,
				real_name: f.value.real_name,
				gender: this.addDoctor ? f.value.gender : null,
				academical_title: this.addDoctor ? f.value.academical_title : null,
				clinical_title: this.addDoctor ? f.value.clinical_title : null,
				description: this.addDoctor ? f.value.description : null,
				avatar_url: this.addDoctor ? (imgUrl.indexOf('http') == -1 ? 'http://static.jiabaokangle.com/' + imgUrl : imgUrl) : null,
			}
			this.adminService.adminupdate(this.id, updateParam).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/crmUserList']);
					}, 2000)
				}
			})
		}
	}

	goUrl(_url) {
		this.router.navigate([_url])
	}

	roleChange(_role) {
		if(_role == '2'){
			this.addDoctor = true;
		}else{
			this.addDoctor = false;
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