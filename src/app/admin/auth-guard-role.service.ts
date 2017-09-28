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
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0'){
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
				if((url.indexOf('noPermissions') != -1) || (url.indexOf('admin/home') != -1)){
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
		if((url.indexOf('noPermissions') != -1) || (url.indexOf('admin/home') != -1)){
			return true;
		}else{
			//sessionStorage中userClinicRolesInfos是否为当前url，若是，则无需权限判断
			if(JSON.parse(sessionStorage.getItem('userClinicRolesInfos')) && JSON.parse(sessionStorage.getItem('userClinicRolesInfos')).url == url){
				return true;
			}else{
				var authorityList = [
					{
						firstKey: 'workbenchReception',
						firstUrl: 'workbenchReception',
						second: [
							{
								url: '/admin/workbenchReception',
								authority: 'workerPanel',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'scheduling',
						firstUrl: '',
						second: [
							{
								url: '/admin/scheduling',
								authority: 'see',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'bookingList',
						firstUrl: '',
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
						firstUrl: '',
						second: [
							{
								url: '/admin/bookingConfirm',
								authority: 'see',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'bookingIn',
						firstUrl: '',
						second: [
							{
								url: '/admin/bookingIn',
								authority: 'bookingIn',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'bookingReceive',
						firstUrl: '',
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
							// 追加服务
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
						firstUrl: '',
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
						]
					},
					{
						firstKey: 'childServiceList',
						firstUrl: '',
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
					{
						firstKey: 'clinicroomList',
						firstUrl: '',
						second: [
							{
								url: '/admin/clinicroomList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/clinicroomList',
								authority: 'personal',
								queryType: '',
								queryParams: '',
							},
							// 编辑诊室
							{
								url: '/admin/clinicroom',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							},
							// 诊室使用记录
							{
								url: '/admin/clinicroomRecords',
								authority: 'records',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'doctorList',
						firstUrl: '',
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
						]
					},
					{
						firstKey: 'medicalSupplierList',
						firstUrl: '',
						second: [
							{
								url: '/admin/medicalSupplierList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/medicalSupplier',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'materialList',
						firstUrl: '',
						second: [
							// 物资管理
							{
								url: '/admin/materialList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							// 编辑物资
							{
								url: '/admin/material',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							},
							// 入库管理
							{
								url: '/admin/materialPurchaseList',
								authority: 'seePut',
								queryType: '',
								queryParams: '',
							},
							// 编辑入库
							{
								url: '/admin/materialPurchase',
								authority: 'editPut',
								queryType: '',
								queryParams: '',
							},
							// 库存管理
							{
								url: '/admin/materialHasList',
								authority: 'seeHas',
								queryType: '',
								queryParams: '',
							},
							// 编辑库存
							{
								url: '/admin/materialHas',
								authority: 'editHas',
								queryType: '',
								queryParams: '',
							},
							// 报损管理
							{
								url: '/admin/materialLostList',
								authority: 'seeLost',
								queryType: '',
								queryParams: '',
							},
							// 编辑报损
							{
								url: '/admin/materialLost',
								authority: 'editLost',
								queryType: '',
								queryParams: '',
							},
							// 盘点管理
							{
								url: '/admin/materialCheckList',
								authority: 'seeCheck',
								queryType: '',
								queryParams: '',
							},
							// 编辑盘点
							{
								url: '/admin/materialCheck',
								authority: 'editCheck',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'medicalList',
						firstUrl: '',
						second: [
							// 药品管理
							{
								url: '/admin/medicalList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							// 编辑药品
							{
								url: '/admin/medical',
								authority: 'edit',
								queryType: '',
								queryParams: '',
							},
							// 入库管理
							{
								url: '/admin/medicalPurchaseList',
								authority: 'seePut',
								queryType: '',
								queryParams: '',
							},
							// 编辑入库
							{
								url: '/admin/medicalPurchase',
								authority: 'editPut',
								queryType: '',
								queryParams: '',
							},
							// 库存管理
							{
								url: '/admin/medicalHasList',
								authority: 'seeHas',
								queryType: '',
								queryParams: '',
							},
							// 编辑库存
							{
								url: '/admin/medicalHas',
								authority: 'editHas',
								queryType: '',
								queryParams: '',
							},
							// 报损管理
							{
								url: '/admin/medicalLostList',
								authority: 'seeLost',
								queryType: '',
								queryParams: '',
							},
							// 编辑报损
							{
								url: '/admin/medicalLost',
								authority: 'editLost',
								queryType: '',
								queryParams: '',
							},
							// 盘点管理
							{
								url: '/admin/medicalCheckList',
								authority: 'seeCheck',
								queryType: '',
								queryParams: '',
							},
							// 编辑盘点
							{
								url: '/admin/medicalCheck',
								authority: 'editCheck',
								queryType: '',
								queryParams: '',
							},
						]
					},
					{
						firstKey: 'prescriptList',
						firstUrl: '',
						second: [
							{
								url: '/admin/prescriptList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							},
							{
								url: '/admin/prescriptBackList',
								authority: 'seeBack',
								queryType: '',
								queryParams: '',
							}
						]
					},
					{
						firstKey: 'setupInspectList',
						firstUrl: '',
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
						firstUrl: '',
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
						firstUrl: '',
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
						firstUrl: '',
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
						]
					},
					{
						firstKey: 'userList',
						firstUrl: '',
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
							}
						]
					},
					{
						firstKey: 'memberList',
						firstUrl: '',
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
						firstUrl: '',
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
						firstUrl: '',
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
						firstUrl: '',
						second: [
							{
								url: '/admin/transactionRecordList',
								authority: 'see',
								queryType: '',
								queryParams: '',
							}
						]
					},
				];
				var userClinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));

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
								var queryParams = this.getUrlParams(url);
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
					this.router.navigate(['./admin/noPermissions']);
					return false;
				}else{
					sessionStorage.setItem('userClinicRolesInfos', JSON.stringify(authority));

					//url中是否有参数
					if(authority.url.indexOf('?') == -1){
						this.router.navigate(['.' + authority.url]);
					}else{
						//构造带参数路由重定向
						var redirectUrl = authority.url.substring(0, authority.url.indexOf('?'));
						this.router.navigate(['.' + redirectUrl], {queryParams: this.getUrlParams(authority.url)});
					}
					return true;
				}
			}
		}
	}

	//获取参数json
	getUrlParams(url) {
		var urlQuery = url.substring(url.indexOf('?') + 1).split('&');
		var queryString = '{';
		for(var i = 0; i < urlQuery.length; i++){
			queryString += '"' + urlQuery[i].split('=')[0] + '":' + '"' + urlQuery[i].split('=')[1] + '",';
		}
		if(queryString.length > 1){
			queryString = queryString.slice(0, queryString.length -1);
		}
		queryString += '}';
		return JSON.parse(queryString);
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
