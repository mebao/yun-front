import { Component, OnInit }            from '@angular/core';
import { Location }                     from '@angular/common';
import { Router, ActivatedRoute }       from '@angular/router';
import { NzMessageService }             from 'ng-zorro-antd';

import { AdminService }                 from '../admin.service';

@Component({
	selector: 'app-create-admin',
	templateUrl: './crm-user.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class CrmUserComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
    id: string;
    url: string;
	roleList: any[];
    clinicRoleList: any[];
	academicTitleList: any[];
	clinicalTitleList: any[];
	addDoctor: boolean;
	token: string;
	editType: string;
    userInfo: {
        mobile: string,
        real_name: string,
        role: string,
        clinic_role: any,
        gender: string,
        clinical_title: string,
        description: string,
    }
	// 不可连续点击
	btnCanEdit: boolean;
    _isSpinning: boolean;

	constructor(
		private location: Location,
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
        this.topBar = {
            title: '员工信息',
            back: true,
        }

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		})

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.roleList = [];
		this.clinicRoleList = [];
        this.academicTitleList = [];
        this.clinicalTitleList = [];
        this.addDoctor = false;
        this.token = '';
        this.btnCanEdit = false;
        this._isSpinning = true;
        this.userInfo = {
            mobile: '',
            real_name: '',
            role: '',
            clinic_role: {},
            gender: '',
            clinical_title: '',
            description: '',
        }

		if(this.id && this.id != ''){
			this.editType = 'update';
			//获取用户信息
			var urlOptions = this.url + '&id=' + this.id;
			this.adminService.adminlist(urlOptions).then((data) => {
				if(data.status == 'no'){
                    this._isSpinning = false;
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.adminlist.length > 0){
                        this.userInfo = {
                            mobile: results.adminlist[0].mobile,
                            real_name: results.adminlist[0].realName,
                            role: results.adminlist[0].role,
                            clinic_role: {
								id: results.adminlist[0].clinicRoleId
							},
                            gender: results.adminlist[0].doctorProfile.gender,
                            clinical_title: results.adminlist[0].doctorProfile.ctitle,
                            description: results.adminlist[0].doctorProfile.description,
                        }

						//判断是否为医生
						if(JSON.stringify(results.adminlist[0].doctorProfile).length != 2){
							this.addDoctor = true;
						}
						if(results.adminlist[0].avatarUrl && results.adminlist[0].avatarUrl != ''){
							document.getElementById('imgEle').setAttribute('src', results.adminlist[0].avatarUrl);
						}
						document.getElementById('file').setAttribute('value', results.adminlist[0].avatarUrl);

						this.getClinicRole();
					}
				}
			}).catch(() => {
                this._isSpinning = false;
                this._message.error('服务器错误');
            });
		}else{
			this.editType = 'create';
			this.getClinicRole();
		}

		//获取头像上传token
		var tokenUrl  = '?type=static';
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

	}

	setClinicData(results) {
		//角色
		var roleList = [];
		for(var i in results.roles){
			roleList.push({id: i, name: results.roles[i]});
		}
		this.roleList = roleList;
		//学术职称
		var academicTitleList = [];
		for(var i in results.academicTitle){
			academicTitleList.push({id: i, name: results.academicTitle[i]});
		}
		this.academicTitleList = academicTitleList;
		//医生职称
		var clinicalTitleList = [];
		for(var i in results.clinicalTitle){
			clinicalTitleList.push({id: i, name: results.clinicalTitle[i]});
		}
		this.clinicalTitleList = clinicalTitleList;
	}

	getClinicRole() {
		//获取角色列表
		var roleUrl = this.url + '&status=1';
		this.adminService.clinicrolelist(roleUrl).then((data) => {
			if(data.status == 'no'){
                this._isSpinning = false;
				this._message.error(data.errorMsg);
			}else{
				var updateClinicRole = false;
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						//修改时，通过clinicRoleId获取默认角色
						if(results.list[i].id == this.userInfo.clinic_role.id){
							this.userInfo.clinic_role = results.list[i];
							updateClinicRole = true;
						}
					}
				}
				//若没有匹配的，则默认为空
				if(!updateClinicRole){
                    this.userInfo.clinic_role = null;
				}
				this.clinicRoleList = results.list;
                this._isSpinning = false;
			}
		}).catch(() => {
            this._isSpinning = false;
            this._message.error('服务器错误');
        });
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

	create(): void {
		this.btnCanEdit = true;
		this.userInfo.mobile = this.userInfo.mobile.trim();
		this.userInfo.real_name = this.userInfo.real_name.trim();
		if(this.userInfo.mobile == ''){
			this._message.error('手机号码不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.userInfo.mobile.length != 11 || !this.adminService.checkMobile(this.userInfo.mobile)){
			this._message.error('手机号码输入不正确');
			this.btnCanEdit = false;
			return;
		}
		// if(!this.user.user_name.match(/^\w+$/)){
		// 	this.toastTab('用户名只能由字母、数字和下划线组成', 'error');
		// 	this.btnCanEdit = false;
		// 	return;
		// };
		if(this.userInfo.real_name == ''){
			this._message.error('真实姓名不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.userInfo.role == ''){
			this._message.error('类型不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.userInfo.clinic_role == ''){
			this._message.error('角色不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.addDoctor){
			if(this.userInfo.gender == ''){
				this._message.error('性别不可为空');
				this.btnCanEdit = false;
				return;
			}
		}

		var imgUrl = document.getElementById('file').getAttribute('value');
		if(this.editType == 'create'){
			var param = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				mobile: this.userInfo.mobile,
				real_name: this.userInfo.real_name,
				clinic_id: this.adminService.getUser().clinicId,
				role: this.userInfo.role,
				clinic_role_id: (this.userInfo.clinic_role == '' || this.adminService.isFalse(this.userInfo.clinic_role)) ? null : this.userInfo.clinic_role.id,
				clinic_role_name: (this.userInfo.clinic_role == '' || this.adminService.isFalse(this.userInfo.clinic_role)) ? null : this.userInfo.clinic_role.name,
				gender: this.addDoctor ? this.userInfo.gender : null,
				clinical_title: this.addDoctor ? this.userInfo.clinical_title : null,
				description: this.addDoctor ? this.userInfo.description : null,
				avatar_url: this.addDoctor ? (imgUrl == '' ? '' : ('http://static.meb168.com/' + imgUrl)) : null,
			}
			this.adminService.create(param).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('创建成功');
					setTimeout(() => {
	        			this.location.back();
					}, 2000)
				}
			}).catch(() => {
                this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}else{
			var updateParam = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				mobile: this.userInfo.mobile,
				real_name: this.userInfo.real_name,
				clinic_role_id: this.userInfo.clinic_role == '' ? null : this.userInfo.clinic_role.id,
				clinic_role_name: this.userInfo.clinic_role == '' ? null : this.userInfo.clinic_role.name,
				gender: this.addDoctor ? this.userInfo.gender : null,
				clinical_title: this.addDoctor ? this.userInfo.clinical_title : null,
				description: this.addDoctor ? this.userInfo.description : null,
				avatar_url: this.addDoctor ? (imgUrl == '' ? '' : (imgUrl.indexOf('http') == -1 ? 'http://static.meb168.com/' + imgUrl : imgUrl)) : null,
			}
			this.adminService.adminupdate(this.id, updateParam).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('修改成功');
					setTimeout(() => {
	        			this.location.back();
					}, 2000)
				}
			}).catch(() => {
                this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}
	}

	goUrl(_url) {
		this.router.navigate([_url])
	}

	roleChange($event) {
		if(!$event){
			if(this.userInfo.role == '2'){
				this.addDoctor = true;
			}else{
				this.addDoctor = false;
			}
		}
	}
}
