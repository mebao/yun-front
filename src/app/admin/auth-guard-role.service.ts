import {Injectable}           from '@angular/core';
import { CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	}                         from '@angular/router';
import { AdminService }       from './admin.service';

@Injectable()
export class AuthGuardRole implements CanActivate{
	constructor(
		private router: Router,
		private adminService: AdminService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = state.url;
		return this.checkUserClinicRoles(url);
	}

	checkUserClinicRoles(url: string): boolean{
		// 验证url为''和'/admin'------没有默认首页
		if((this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9') && (url == '' || url == '/admin' || url == '/admin/home')){
			this.router.navigate(['./admin/workbench/reception']);
			return false;
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			return true;
		}
		//判断sessionStorage中是否含有userClinicRoles信息，没有,需再次请求
		var userClinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
		if(userClinicRoles){
			return this.checkRole(url);
		}else{
			//获取userClinicRoles
			var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&role_id=' + this.adminService.getUser().clinicRoleId;
			this.adminService.authoritylist(urlOptions).then((data) => {
				if(data.status == 'no'){
					alert(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					//构造角色权限数据
					if(results.list.length > 0){
						var resultsUserClinicRoles = [];
						for(var i = 0; i < results.list.length; i++){
							if(results.list[i].info.length > 0){
								var info = [];
								var hasInfo = false;
								for(var j = 0; j < results.list[i].info.length; j++){
									//判断是否具备权限
									if(results.list[i].info[j].isCheck == 1){
										hasInfo = true;
										info.push({
											infoId: results.list[i].info[j].id,
											infoName: results.list[i].info[j].name,
											keyName: results.list[i].info[j].keyName,
										});
									}
								}
								if(hasInfo){
									resultsUserClinicRoles.push({
										id: results.list[i].id,
										name: results.list[i].name,
										keyName: results.list[i].keyName,
										infos: info,
									});
								}
							}
						}
					}
					sessionStorage.setItem('userClinicRoles', JSON.stringify(resultsUserClinicRoles));
				}
				if(url.indexOf('noPermissions') != -1){
					this.router.navigate(['.' + url]);
					return false;
				}else{
					return this.checkRole(url);
				}
			});
		}
	}

	//筛选模块，病将二级权限存储到sessionStorage中
	checkRole(url: string): boolean{
		//根据url筛选权限
		if(url.indexOf('noPermissions') != -1){
			return true;
		}else{
			//sessionStorage中userClinicRolesInfos是否为当前url，若是，则无需权限判断
			if(JSON.parse(sessionStorage.getItem('userClinicRolesInfos')) && JSON.parse(sessionStorage.getItem('userClinicRolesInfos')).url == url){
				return true;
			}else{
				var authorityList = [
					{
						firstKey: 'workbenchReception',
						firstUrl: '/admin/workbench/reception',
						authority: ['workerPanel'],
						second: [
							{
								url: '/admin/workbench/reception',
								authority: 'workerPanel',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/booking',
								authority: 'workerPanel',
								queryType: 'type',
								queryParams: 'createScheduling',
							},
						]
					},
					{
						firstKey: 'scheduling',
						firstUrl: '/admin/scheduling/index',
						authority: ['see'],
						second: [
							{
								url: '/admin/scheduling/index',
								authority: 'see',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'bookingList',
						firstUrl: '/admin/bookingList',
						authority: ['see'],
						second: [
							{
								url: '/admin/bookingList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/booking',
								authority: 'add',
								queryType: 'type',
								queryParams: 'create',
							},
							// 支付预约金
							{
								url: '/admin/paymentBookingFee',
								authority: 'add',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/bookingInfo',
								authority: 'info',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/booking',
								authority: 'update',
								queryType: 'type',
								queryParams: 'update',
							}
						]
					},
					{
						firstKey: 'bookingConfirm',
						firstUrl: '/admin/bookingConfirm',
						authority: ['see'],
						second: [
							{
								url: '/admin/bookingConfirm',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							// 支付预约金
							{
								url: '/admin/paymentBookingFee',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'bookingIn',
						firstUrl: '/admin/bookingIn',
						authority: ['bookingIn'],
						second: [
							{
								url: '/admin/bookingIn',
								authority: 'bookingIn',
								queryType: '',
								queryParams: '',
							},
							// 支付预约金
							{
								url: '/admin/paymentBookingFee',
								authority: 'bookingIn',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'bookingReceive',
						firstUrl: '/admin/bookingReceive',
						authority: ['see'],
						second: [
							{
								url: '/admin/bookingReceive',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorBooking',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							// 开方
							{
								url: '/admin/doctorPrescript',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							// 追加科室
							{
								url: '/admin/bookingAddService',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							// 随访
							{
								url: '/admin/bookingFollowups',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							// 成长记录
							{
								url: '/admin/doctorBookingGrowthrecords',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/bookingGrowthrecord',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							// 病例
							{
								url: '/admin/doctorBookingCasehistory',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/bookingCasehistory',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							// 儿保记录
							{
								url: '/admin/doctorBookingHealthrecord',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/bookingHealthrecord',
								authority: 'receive',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'bookingCharge',
						firstUrl: '/admin/bookingCharge',
						authority: ['see'],
						second: [
							{
								url: '/admin/bookingCharge',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							// 收费
							{
								url: '/admin/bookingPayment',
								authority: 'payment',
								queryType: '',
								queryParams: '',
							},
							// 收费打印
							{
								url: '/admin/paymentPrint',
								authority: 'payment',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'guazhangList',
						firstUrl: '/admin/guazhangList',
						authority: ['see'],
						second: [
							{
								url: '/admin/guazhangList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'childServiceList',
						firstUrl: '/admin/childServiceList',
						authority: ['see'],
						second: [
							{
								url: '/admin/childServiceList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/childService',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							}
						]
					},
					// {
					// 	firstKey: 'clinicroomList',
					// 	firstUrl: '',
					// 	second: [
					// 		{
					// 			url: '/admin/clinicroomList',
					// 			authority: 'see',
					// 			queryType: '',
					// 			queryParams: '',
					// 		},
					// 		{
					// 			url: '/admin/clinicroomList',
					// 			authority: 'personal',
					// 			queryType: '',
					// 			queryParams: '',
					// 		},
					// 		// 编辑诊室
					// 		{
					// 			url: '/admin/clinicroom',
					// 			authority: 'edit',
					// 			queryType: '',
					// 			queryParams: '',
					// 		},
					// 		// 诊室使用记录
					// 		{
					// 			url: '/admin/clinicroomRecords',
					// 			authority: 'records',
					// 			queryType: '',
					// 			queryParams: '',
					// 		},
					// 	]
					// },
					{
						firstKey: 'doctorVisit',
						firstUrl: '/admin/doctorVisit',
						authority: ['see', 'personal'],
						second: [
							{
								url: '/admin/doctorVisit',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorVisit',
								authority: 'personal',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'doctorList',
						firstUrl: '/admin/doctorList',
						authority: ['see', 'personal'],
						second: [
							{
								url: '/admin/doctorList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorList',
								authority: 'personal',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorServiceList',
								authority: 'service',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorService',
								authority: 'service',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorInfo',
								authority: 'scheduling',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorRecordTempletList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorRecordTemplet',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorRecordTempletList',
								authority: 'personal',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorRecordTemplet',
								authority: 'personal',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorCaseTempletList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorCaseTemplet',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorCaseTempletList',
								authority: 'personal',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorCaseTemplet',
								authority: 'personal',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'medicalSupplierList',
						firstUrl: '/admin/medical/supplierList',
						authority: ['see'],
						second: [
							{
								url: '/admin/medical/supplierList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/medical/supplier',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'materialList',
						firstUrl: '/admin/material/list',
						authority: ['see'],
						second: [
							// 物资管理
							{
								url: '/admin/material/list',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							// 编辑物资
							{
								url: '/admin/material/index',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							},
							// 入库管理
							{
								url: '/admin/material/purchaseList',
								authority: 'seePut',
								queryType: '',
								queryParams: '',
							},
							// 新增入库
							{
								url: '/admin/material/purchase',
								authority: 'editPut',
								queryType: '',
								queryParams: '',
							},
							// 入库详情
							{
								url: '/admin/material/purchaseInfo',
								authority: 'infoPut',
								queryType: '',
								queryParams: '',
							},
							// 库存管理
							{
								url: '/admin/material/hasList',
								authority: 'seeHas',
								queryType: '',
								queryParams: '',
							},
							// 编辑库存
							{
								url: '/admin/material/has',
								authority: 'editHas',
								queryType: '',
								queryParams: '',
							},
							// 报损管理
							{
								url: '/admin/material/lostList',
								authority: 'seeLost',
								queryType: '',
								queryParams: '',
							},
							// 编辑报损
							{
								url: '/admin/material/lost',
								authority: 'editLost',
								queryType: '',
								queryParams: '',
							},
							// 盘点管理
							{
								url: '/admin/material/checkList',
								authority: 'seeCheck',
								queryType: '',
								queryParams: '',
							},
							// 编辑盘点
							{
								url: '/admin/material/check',
								authority: 'addCheck',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'medicalList',
						firstUrl: '/admin/medical/list',
						authority: ['see'],
						second: [
							// 药品管理
							{
								url: '/admin/medical/list',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							// 编辑药品
							{
								url: '/admin/medical/index',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							},
							// 入库管理
							{
								url: '/admin/medical/purchaseList',
								authority: 'seePut',
								queryType: '',
								queryParams: '',
							},
							// 新增入库
							{
								url: '/admin/medical/purchase',
								authority: 'addPut',
								queryType: '',
								queryParams: '',
							},
							// 入库详情
							{
								url: '/admin/medical/purchaseInfo',
								authority: 'infoPut',
								queryType: '',
								queryParams: '',
							},
							// 库存管理
							{
								url: '/admin/medical/hasList',
								authority: 'seeHas',
								queryType: '',
								queryParams: '',
							},
							// 编辑库存
							{
								url: '/admin/medical/has',
								authority: 'editHas',
								queryType: '',
								queryParams: '',
							},
							// 报损管理
							{
								url: '/admin/medical/lostList',
								authority: 'seeLost',
								queryType: '',
								queryParams: '',
							},
							// 编辑报损
							{
								url: '/admin/medical/lost',
								authority: 'editLost',
								queryType: '',
								queryParams: '',
							},
							// 盘点管理
							{
								url: '/admin/medical/checkList',
								authority: 'seeCheck',
								queryType: '',
								queryParams: '',
							},
							// 编辑盘点
							{
								url: '/admin/medical/check',
								authority: 'addCheck',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'prescriptList',
						firstUrl: '/admin/prescript/list',
						authority: ['see'],
						second: [
							{
								url: '/admin/prescript/list',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/prescript/backList',
								authority: 'seeBack',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/prescript/saleList',
								authority: 'seeSale',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/prescript/sale',
								authority: 'editSale',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'assistList',
						firstUrl: '/admin/assistList',
						authority: ['see'],
						second: [
							{
								url: '/admin/assistList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/assist',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'setupInspectList',
						firstUrl: '/admin/setupInspectList',
						authority: ['see'],
						second: [
							{
								url: '/admin/setupInspectList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/setupInspect',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'inspectResultsList',
						firstUrl: '/admin/inspectResultsList',
						authority: ['see'],
						second: [
							{
								url: '/admin/inspectResultsList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/inspectResults',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'bookingFollowupsList',
						firstUrl: '/admin/bookingFollowupsList',
						authority: ['see'],
						second: [
							{
								url: '/admin/bookingFollowupsList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/bookingFollowups',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'childList',
						firstUrl: '/admin/childList',
						authority: ['see'],
						second: [
							{
								url: '/admin/childList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/childInfo',
								authority: 'info',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/booking',
								authority: 'booking',
								queryType: 'type',
								queryParams: 'createChildList',
							},
							{
								url: '/admin/bookingHistory',
								authority: 'bookingHistory',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/doctorBooking',
								authority: 'bookingHistory',
								queryType: 'pageType',
								queryParams: 'history',
							},
							// 成长记录
							{
								url: '/admin/doctorBookingGrowthrecords',
								authority: 'bookingHistory',
								queryType: 'pageType',
								queryParams: 'history',
							},
							// 病例
							{
								url: '/admin/doctorBookingCasehistory',
								authority: 'bookingHistory',
								queryType: 'pageType',
								queryParams: 'history',
							},

							// 儿保记录
							{
								url: '/admin/doctorBookingHealthrecord',
								authority: 'bookingHistory',
								queryType: 'pageType',
								queryParams: 'history',
							},
						]
					},
					{
						firstKey: 'userList',
						firstUrl: '/admin/userList',
						authority: ['see'],
						second: [
							{
								url: '/admin/userList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/createUser',
								authority: 'add',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/userInfo',
								authority: 'info',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/booking',
								authority: 'info',
								queryType: 'type',
								queryParams: 'createUserInfo',
							}
						]
					},
					{
						firstKey: 'memberList',
						firstUrl: '/admin/memberList',
						authority: ['see'],
						second: [
							{
								url: '/admin/memberList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/member',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'crmRoleList',
						firstUrl: '/admin/crmRoleList',
						authority: ['see'],
						second: [
							{
								url: '/admin/crmRoleList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/crmRole',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/roleAuthorityList',
								authority: 'authority',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'crmUserList',
						firstUrl: '/admin/crmUserList',
						authority: ['see'],
						second: [
							{
								url: '/admin/crmUserList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/crmUser',
								authority: 'add',
								queryType: 'type',
								queryParams: 'create',
							},
							{
								url: '/admin/crmUser',
								authority: 'update',
								queryType: 'type',
								queryParams: 'update',
							}
						]
					},
					{
						firstKey: 'transactionRecordList',
						firstUrl: '/admin/transactionRecordList',
						authority: ['see'],
						second: [
							{
								url: '/admin/transactionRecordList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'givefeeList',
						firstUrl: '/admin/givefeeList',
						authority: ['see'],
						second: [
							{
								url: '/admin/givefeeList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'authority',
						firstUrl: '',
						authority: [],
						second: [
							{
								url: '/admin/authorize/givefee',
								authority: 'givefee',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/authorize/success',
								authority: 'givefee',
								queryType: '',
								queryParams: '',
							}
						]
					},
				];

				var userClinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
				// 验证url为''和'/admin'------没有默认首页
				if(url == '' || url == '/admin' || url == '/admin/home'){
					if(userClinicRoles.length > 0){
						// 遍历用户拥有的权限
						for(var i = 0; i < userClinicRoles.length; i++){
							// 遍历所有权限
							for(var j = 0; j < authorityList.length; j++){
								if(userClinicRoles[i].keyName == authorityList[j].firstKey){
									// 遍历拥有的二级权限
									if(userClinicRoles[i].infos.length > 0){
										for(var k = 0; k < userClinicRoles[i].infos.length; k++){
											if(authorityList[j].authority.indexOf(userClinicRoles[i].infos[k].keyName) != -1){
												this.router.navigate([authorityList[j].firstUrl]);
												return false;
											}
										}
									}
								}
							}
						}
					}else{
						this.router.navigate(['./admin/noPermissions']);
					}
					return false;
				}

				var authority = {
					firstKey: '',
					url: '',
					infos: [],
				};
				for(var i = 0; i < authorityList.length; i++){
					for(var j = 0; j < authorityList[i].second.length; j++){
						//通过url找到所属firstKey
						//url与firstKey需要完全匹配，url: 1=>'admin/booking' 2=>'admin/booking?id=1'
						var urlString = '';
						//不含参
						if(url.indexOf('?') == -1){
							urlString = url;
						}else{
							urlString = url.slice(0, url.indexOf('?'));
						}
						if(urlString == authorityList[i].second[j].url){
							//修改和新增有的是同一个url，所以通过参数类型来判断
							if(authorityList[i].second[j].queryParams != ''){
								//若需要通过参数判断，url: 'admin/booking?type="create"'
								var urlBoolean = false;
								var queryParams = this.adminService.getUrlParams(url);
								urlBoolean = (urlString == authorityList[i].second[j].url) && (queryParams[authorityList[i].second[j].queryType] == authorityList[i].second[j].queryParams);
								if(urlBoolean){
									authority = this.getAuthority(url, userClinicRoles, authorityList, i, j, authority);
								}
							}else{
								authority = this.getAuthority(url, userClinicRoles, authorityList, i, j, authority);
							}
						}
					}
				}

				//根据一级权限筛选路由
				//没有该模块权限，重定向到无权限页面
				if(authority.firstKey == ''){
					this.router.navigate(['./admin/noPermissions'], {queryParams: {layout: 'all'}});
					return false;
				}else{
					sessionStorage.setItem('userClinicRolesInfos', JSON.stringify(authority));

					//url中是否有参数
					if(authority.url.indexOf('?') == -1){
						this.router.navigate(['.' + authority.url]);
					}else{
						//构造带参数路由重定向
						var redirectUrl = authority.url.substring(0, authority.url.indexOf('?'));
						this.router.navigate(['.' + redirectUrl], {queryParams: this.adminService.getUrlParams(authority.url)});
					}
					return true;
				}
			}
		}
	}

	//获取是否具有权限
	getAuthority(url, userClinicRoles, authorityList, i, j, authority) {
		//找到一级权限key之后，需要判断，权限列表中，是否含有该一级权限,若是没有响应权限模块，则authority为空
		for(var k = 0; k < userClinicRoles.length; k++){
			if(authorityList[i].firstKey == userClinicRoles[k].keyName){
				//找到一级权限，需要验证，是否具有进入该页面的权限
				for(var m = 0; m < userClinicRoles[k].infos.length; m++){
					if(authorityList[i].second[j].authority == userClinicRoles[k].infos[m].keyName){
						authority = {
							firstKey: authorityList[i].firstKey,
							url: url,
							infos: userClinicRoles[k].infos,
						}
					}
				}
			}
		}
		return authority;
	}
}
