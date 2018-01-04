import { Component, Input }              from '@angular/core';
import { Router, ActivatedRoute }        from '@angular/router';

import { AdminService }                  from '../admin.service';

@Component({
	selector: 'left-nav',
	templateUrl: './left-nav.component.html',
	styleUrls: ['./left-nav.component.scss'],
})
export class LeftNavComponent{
	@Input() title: string;
	userRole: string;
	selectedTab: string;
	showTab: boolean;
	clinicRole: {
		//前台工作台
		workbenchReception: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//排班
		scheduling: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//预约列表
		bookingList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//预约确认
		bookingConfirm: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//登记
		bookingIn: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//接诊
		bookingReceive: {
			use: string,
			authority: any[],
			infos: any[],
		}
		//收费
		bookingCharge: {
			use: string,
			authority: any[],
			infos: any[],
		},
		// 挂账收费
		guazhangList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//宝宝科室列表
		childServiceList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//诊室列表
		doctorVisit: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//医生列表
		doctorList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//供应商管理
		medicalSupplierList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//物资管理
		materialList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//药房
		medicalList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//药方
		prescriptList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		// 辅助项目
		assistList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//检查项目
		setupInspectList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//实验室检查
		inspectResultsList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		// 预约辅助治疗
		bookingAssistList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//随访管理
		bookingFollowupsList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//病人库
		childList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//用户管理
		userList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//会员管理
		memberList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//角色管理
		crmRoleList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//后台用户管理
		crmUserList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//交易记录
		transactionRecordList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		//交易统计
		transactionStatistics: {
			use: string,
			authority: any[],
			infos: any[],
		},
		// 减免金额记录
		givefeeList: {
			use: string,
			authority: any[],
			infos: any[],
		},
		// 授权
		authority: {
			use: string,
			authority: any[],
			infos: any[],
		},
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.userRole = this.adminService.getUser().role;

		// this.selectedTab = sessionStorage.getItem('leftTab') ? sessionStorage.getItem('leftTab') : '';
		// this.showTab = sessionStorage.getItem('leftShowTab') ? true : false;

		this.clinicRole = {
			workbenchReception: {
				use: '',
				authority: ['workerPanel'],
				infos: [],
			},
			scheduling: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			bookingList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			bookingConfirm: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			bookingIn: {
				use: '',
				authority: ['bookingIn'],
				infos: [],
			},
			bookingReceive: {
				use: '',
				authority: ['see'],
				infos: []
			},
			bookingCharge: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			guazhangList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			childServiceList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			doctorVisit: {
				use: '',
				authority: ['see', 'personal'],
				infos: [],
			},
			doctorList: {
				use: '',
				authority: ['see', 'personal'],
				infos: [],
			},
			medicalSupplierList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			materialList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			medicalList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			prescriptList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			assistList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			setupInspectList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			inspectResultsList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			bookingAssistList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			bookingFollowupsList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			childList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			userList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			memberList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			crmRoleList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			crmUserList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			transactionRecordList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			transactionStatistics: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			givefeeList: {
				use: '',
				authority: ['see'],
				infos: [],
			},
			authority: {
				use: '',
				authority: ['see'],
				infos: [],
			},
		}

		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.clinicRole){
				this.clinicRole[key] = {
					use: key,
					authority: [],
					infos: [],
				}
			}
		}else{
			var clinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
			if(clinicRoles.length > 0){
				for(var i = 0; i < clinicRoles.length; i++){
					//判断是否具有进入一级页面的权限
					var hasAuthority = false;
					for(var j = 0; j < this.clinicRole[clinicRoles[i].keyName].authority.length; j++){
						for(var k = 0; k < clinicRoles[i].infos.length; k++){
							if(this.clinicRole[clinicRoles[i].keyName].authority[j] == clinicRoles[i].infos[k].keyName){
								hasAuthority = true;
							}
						}
					}
					if(hasAuthority){
						this.clinicRole[clinicRoles[i].keyName] = {
							use: clinicRoles[i].keyName,
							authority: [],
							infos: clinicRoles[i].infos,
						};
					}
				}
			}
		}
	}

	// changeTab(_value) {
	// 	this.selectedTab = _value;
	// 	this.showTab = !this.showTab;
	// 	sessionStorage.setItem('leftTab', _value);
	// 	sessionStorage.setItem('leftShowTab', String(this.showTab));
	// }
}
