import { Component, OnInit }            from '@angular/core';
import { Router }                       from '@angular/router';

import { AuthService }                  from '../../auth.service';
import { AdminService }                 from '../admin.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent{
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	admininfo: {
		clinicId: string,
		clinicName: string,
		clinicRoleId: string,
		clinicRoleName: string,
		role: string,
		token: string,
		uid: string,
		username: string,
		realname: string,
	}
	clinicRole: {
		//前台工作台
		workbenchReception: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//排班
		scheduling: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//预约列表
		bookingList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//预约确认
		bookingConfirm: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//登记
		bookingIn: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		// 接诊管理
		doctorVisit: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//接诊
		bookingReceive: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		}
		//收费
		bookingCharge: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		guazhangList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//宝宝科室列表
		childServiceList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//诊室列表
		clinicroomList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//医生列表
		doctorList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//供应商管理
		medicalSupplierList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//物资管理
		materialList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//药房
		medicalList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//药方
		prescriptList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		// 辅助项目
		assistList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//检查项目
		setupInspectList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//实验室检查
		inspectResultsList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//随访管理
		bookingFollowupsList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//病人库
		childList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//用户管理
		userList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//会员管理
		memberList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//角色管理
		crmRoleList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//后台用户管理
		crmUserList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//交易记录
		transactionRecordList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		//交易统计
		transactionStatistics: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
		// 接诊金额记录
		givefeeList: {
			use: string,
			authority: any[],
			url: string,
			infos: any[],
		},
	}

	constructor(
		public authService: AuthService,
		public adminService: AdminService,
		public router: Router,
	) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.admininfo = {
			clinicId: '',
			clinicName: '',
			clinicRoleId: '',
			clinicRoleName: '',
			role: '',
			token: '',
			uid: '',
			username: '',
			realname: '',
		}

		this.clinicRole = {
			workbenchReception: {
				use: '',
				authority: ['workerPanel'],
				url: '/admin/workbench/reception',
				infos: [],
			},
			scheduling: {
				use: '',
				authority: ['see'],
				url: '/admin/scheduling/index',
				infos: [],
			},
			bookingList: {
				use: '',
				authority: ['see'],
				url: '/admin/bookingList',
				infos: [],
			},
			bookingConfirm: {
				use: '',
				authority: ['see'],
				url: '/admin/bookingConfirm',
				infos: [],
			},
			bookingIn: {
				use: '',
				authority: ['bookingIn'],
				url: '/admin/bookingIn',
				infos: [],
			},
			doctorVisit: {
				use: '',
				authority: ['see', 'personal'],
				url: '/admin/docbooking/visit',
				infos: [],
			},
			bookingReceive: {
				use: '',
				authority: ['see'],
				url: '/admin/bookingReceive',
				infos: []
			},
			bookingCharge: {
				use: '',
				authority: ['see'],
				url: '/admin/bookingCharge',
				infos: [],
			},
			guazhangList: {
				use: '',
				authority: ['see'],
				url: '/admin/guazhangList',
				infos: [],
			},
			childServiceList: {
				use: '',
				authority: ['see'],
				url: '/admin/childServiceList',
				infos: [],
			},
			clinicroomList: {
				use: '',
				authority: ['see', 'personal'],
				url: '',
				infos: [],
			},
			doctorList: {
				use: '',
				authority: ['see', 'personal'],
				url: '/admin/doctor/list',
				infos: [],
			},
			medicalSupplierList: {
				use: '',
				authority: ['see'],
				url: '/admin/medical/supplierList',
				infos: [],
			},
			materialList: {
				use: '',
				authority: ['see'],
				url: '/admin/material/list',
				infos: [],
			},
			medicalList: {
				use: '',
				authority: ['see'],
				url: '/admin/medical/list',
				infos: [],
			},
			prescriptList: {
				use: '',
				authority: ['see'],
				url: '/admin/prescript/list',
				infos: [],
			},
			assistList: {
				use: '',
				authority: ['see'],
				url: '/admin/assistList',
				infos: [],
			},
			setupInspectList: {
				use: '',
				authority: ['see'],
				url: '/admin/setupInspectList',
				infos: [],
			},
			inspectResultsList: {
				use: '',
				authority: ['see'],
				url: '/admin/inspectResultsList',
				infos: [],
			},
			bookingFollowupsList: {
				use: '',
				authority: ['see'],
				url: '/admin/bookingFollowupsList',
				infos: [],
			},
			childList: {
				use: '',
				authority: ['see'],
				url: '/admin/childList',
				infos: [],
			},
			userList: {
				use: '',
				authority: ['see'],
				url: '/admin/userList',
				infos: [],
			},
			memberList: {
				use: '',
				authority: ['see'],
				url: '/admin/memberList',
				infos: [],
			},
			crmRoleList: {
				use: '',
				authority: ['see'],
				url: '/admin/crmRoleList',
				infos: [],
			},
			crmUserList: {
				use: '',
				authority: ['see'],
				url: '/admin/crmuser/list',
				infos: [],
			},
			transactionRecordList: {
				use: '',
				authority: ['see'],
				url: '/admin/transactionRecordList',
				infos: [],
			},
			transactionStatistics: {
				use: '',
				authority: ['see'],
				url: '/admin/transactionStatistics',
				infos: [],
			},
			givefeeList: {
				use: '',
				authority: ['see'],
				url: '/admin/givefeeList',
				infos: [],
			},
		}
	}

	login(username, password): void{
		username = username.trim();
		if(username == ''){
			this.toastTab('用户名不可为空', 'error');
			return;
		}
		if(!username.match(/^\w+$/)){
			this.toastTab('用户名只能由字母、数字和下划线组成', 'error');
			return;
		};
		password = password.trim();
		if(password == ''){
			this.toastTab('密码不可为空','error');
			return;
		}
		this.authService.login(username, password).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				//用户信息存储在cookie中
				this.admininfo = {
					clinicId: results.admininfo.clinicId,
					clinicName: results.admininfo.clinicName,
					clinicRoleId: results.admininfo.clinicRoleId,
					clinicRoleName: results.admininfo.clinicRoleName,
					role: results.admininfo.role,
					token: results.admininfo.token,
					uid: results.admininfo.uid,
					username: results.admininfo.username,
					realname: results.admininfo.realname,
				}
				this.adminService.delCookie('user');
				this.adminService.setCookie('user', JSON.stringify(this.admininfo), 1);
				//角色信息存储在sessionStorage中
				sessionStorage.setItem('userClinicRoles', JSON.stringify(results.admininfo.clinicRoles));
				//清空sessionStorage中角色权限信息
				sessionStorage.removeItem('userClinicRolesInfos');

				//默认进入所有权限中，第一个一级页面
				var firstUrl = '';
				if(results.admininfo.role == '0' || results.admininfo.role == '9'){
					firstUrl = '/admin/workbench/reception';
				}else{
					if(results.admininfo.clinicRoles.length == 0){
						firstUrl = '/admin/noPermissions';
					}else{
						for(var i = 0; i < results.admininfo.clinicRoles.length; i++){
							if(firstUrl == ''){
								//判断是否具有进入一级页面的权限
								var hasAuthority = false;
								for(var j = 0; j < this.clinicRole[results.admininfo.clinicRoles[i].keyName].authority.length; j++){
									for(var k = 0; k < results.admininfo.clinicRoles[i].infos.length; k++){
										if(this.clinicRole[results.admininfo.clinicRoles[i].keyName].authority[j] == results.admininfo.clinicRoles[i].infos[k].keyName){
											hasAuthority = true;
										}
									}
								}
								if(hasAuthority){
									firstUrl = this.clinicRole[results.admininfo.clinicRoles[i].keyName].url;
								}
							}
						}
					}
				}
				let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : firstUrl;
				if(redirect.indexOf('?') != -1){
					this.router.navigate([redirect.slice(0, redirect.indexOf('?'))], {queryParams: this.adminService.getUrlParams(redirect)});
				}else{
					this.router.navigate([redirect]);
				}

			}
		})
	}

	// 忘记密码
	forgetpwd() {
		this.router.navigate(['./forgetpwd']);
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
