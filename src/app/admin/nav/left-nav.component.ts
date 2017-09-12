import { Component, Input }              from '@angular/core';
import { Router, ActivatedRoute }        from '@angular/router';

import { AdminService }                  from '../admin.service';

@Component({
	selector: 'left-nav',
	templateUrl: './left-nav.component.html'
})
export class LeftNavComponent{
	@Input() title: string;
	userRole: string;
	clinicRole: {
		//前台工作台
		workerPanel: {
			use: string,
			infos: any[],
		},
		//排班
		scheduling: {
			use: string,
			infos: any[],
		},
		//预约列表
		bookingList: {
			use: string,
			infos: any[],
		},
		//预约确认
		bookingConfirm: {
			use: string,
			infos: any[],
		},
		//登记
		bookingIn: {
			use: string,
			infos: any[],
		},
		//收费
		bookingCharge: {
			use: string,
			infos: any[],
		},
		//小孩服务列表
		childServiceList: {
			use: string,
			infos: any[],
		},
		//诊室列表
		clinicroomList: {
			use: string,
			infos: any[],
		},
		//医生列表
		doctorList: {
			use: string,
			infos: any[],
		},
		//供应商管理
		medicalSupplierList: {
			use: string,
			infos: any[],
		},
		//物资管理
		materialList: {
			use: string,
			infos: any[],
		},
		//药房
		medicalList: {
			use: string,
			infos: any[],
		},
		//药方
		prescriptList: {
			use: string,
			infos: any[],
		},
		//检查项目
		setupInspectList: {
			use: string,
			infos: any[],
		},
		//实验室检查
		inspectResultsList: {
			use: string,
			infos: any[],
		},
		//随访管理
		bookingFollowupsList: {
			use: string,
			infos: any[],
		},
		//病人库
		childList: {
			use: string,
			infos: any[],
		},
		//用户管理
		userList: {
			use: string,
			infos: any[],
		},
		//会员管理
		memberList: {
			use: string,
			infos: any[],
		},
		//角色管理
		crmRoleList: {
			use: string,
			infos: any[],
		},
		//后台用户管理
		crmUserList: {
			use: string,
			infos: any[],
		},
		//交易记录
		transactionRecordList: {
			use: string,
			infos: any[],
		},
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.userRole = this.adminService.getUser().role;

		this.clinicRole = {
			workerPanel: {
				use: '',
				infos: [],
			},
			scheduling: {
				use: '',
				infos: [],
			},
			bookingList: {
				use: '',
				infos: [],
			},
			bookingConfirm: {
				use: '',
				infos: [],
			},
			bookingIn: {
				use: '',
				infos: [],
			},
			bookingCharge: {
				use: '',
				infos: [],
			},
			childServiceList: {
				use: '',
				infos: [],
			},
			clinicroomList: {
				use: '',
				infos: [],
			},
			doctorList: {
				use: '',
				infos: [],
			},
			medicalSupplierList: {
				use: '',
				infos: [],
			},
			materialList: {
				use: '',
				infos: [],
			},
			medicalList: {
				use: '',
				infos: [],
			},
			prescriptList: {
				use: '',
				infos: [],
			},
			setupInspectList: {
				use: '',
				infos: [],
			},
			inspectResultsList: {
				use: '',
				infos: [],
			},
			bookingFollowupsList: {
				use: '',
				infos: [],
			},
			childList: {
				use: '',
				infos: [],
			},
			userList: {
				use: '',
				infos: [],
			},
			memberList: {
				use: '',
				infos: [],
			},
			crmRoleList: {
				use: '',
				infos: [],
			},
			crmUserList: {
				use: '',
				infos: [],
			},
			transactionRecordList: {
				use: '',
				infos: [],
			},
		}

		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().clinicRoleId == '0'){
			for(var key in this.clinicRole){
				this.clinicRole[key] = {
					use: key,
					infos: [],
				}
			}
		}else{
			var clinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
			if(clinicRoles.length > 0){
				for(var i = 0; i < clinicRoles.length; i++){
					this.clinicRole[clinicRoles[i].keyName] = {
						use: clinicRoles[i].keyName,
						infos: clinicRoles[i].infos,
					};
				}
			}
		}
	}

	logout() {
		this.adminService.delCookie('user');
		sessionStorage.removeItem('userClinicRoles');
		sessionStorage.removeItem('userClinicRolesInfos');
		this.router.navigate(['./login']);
	}
}
