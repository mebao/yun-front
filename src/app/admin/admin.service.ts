import { Headers, Http, RequestOptions }          from '@angular/http';
import { Injectable }                             from '@angular/core';

import { Data }                                   from './data';
import { config }                                 from '../config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AdminService{
	url = config.baseHTTP;
	yebkUrl = config.yebkHttp;

	constructor(
		private http: Http,
	) {
		sessionStorage.removeItem('userClinicRoles');
		sessionStorage.removeItem('userClinicRolesInfos');
		//初始化缓存数据
		this.clinicdata().then((data) => {
			if(data.status == 'no'){
				alert(data.errorMsg);
			}else{
				sessionStorage.setItem('clinicdata', JSON.stringify(data.results));
			}
		});
	}

	getUrl() {
		return this.url;
	}

	// 获取clinicdata
	getClinicdata() {
		var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			return JSON.parse(clinicdata);
		}else{
			this.clinicdata().then((data) => {
				if(data.status == 'no'){
					return 'error';
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					return results;
				}
			});
		}
	}

	//创建用户
	private createUrl = this.url + '/mebcrm/admincreate';
	create(param): Promise<Data>{
		return this.http.post(this.createUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//删除后台用户
	private deleteadminUrl = this.url + '/mebcrm/deleteadmin/';
	deleteadmin(urlOptions): Promise<Data>{
		return this.http.get(this.deleteadminUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改后台用户信息
	private adminupdateUrl = this.url + '/mebcrm/adminupdate/';
	adminupdate(urlOptions, params): Promise<Data>{
		return this.http.post(this.adminupdateUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//缓存数据
	private clinicdataUrl = this.url + '/mebcrm/clinicdata';
	clinicdata(): Promise<Data>{
		return this.http.get(this.clinicdataUrl)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建普通用户
	private createUserUrl = this.url + '/mebcrm/usercreate';
	createUser(param): Promise<Data>{
		return this.http.post(this.createUserUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建排班配置
	private schedulingConfigUrl = this.url + '/mebcrm/dutyname';
	schedulingConfig(param): Promise<Data>{
		return this.http.post(this.schedulingConfigUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改排班配置状态
	private dutystatusUrl = this.url + '/mebcrm/dutystatus/';
	dutystatus(urlOptions, params): Promise<Data>{
		return this.http.post(this.dutystatusUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response =>　response.json() as Data)
			.catch();
	}

	//陪伴配置列表
	private schedulingUrl = this.url + '/mebcrm/dutylist';
	scheduling(urlOptions): Promise<Data>{
		return this.http.get(this.schedulingUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询后台用户
	private adminlistUrl = this.url + '/mebcrm/adminlist';
	adminlist(urlOptions): Promise<Data>{
		return this.http.get(this.adminlistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//后台人员排班
	private adminSchedulingUrl = this.url + '/mebcrm/doctorduty';
	adminScheduling(param): Promise<Data>{
		return this.http.post(this.adminSchedulingUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询用户及其孩子
	private searchuserUrl = this.url + '/mebcrm/searchuser';
	searchuser(urlOptions): Promise<Data>{
		return this.http.get(this.searchuserUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//根据科室查询医生可预约日期
	private searchdoctorserviceUrl = this.url + '/mebcrm/searchdoctorservice';
	searchdoctorservice(urlOptions): Promise<Data>{
		return this.http.get(this.searchdoctorserviceUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建预约
	private bookingcreateUrl = this.url + '/mebcrm/bookingcreate';
	bookingcreate(param): Promise<Data>{
		return this.http.post(this.bookingcreateUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//新增或修改宝宝科室信息
	private clinicserviceUrl = this.url + '/mebcrm/clinicservice';
	clinicservice(param): Promise<Data>{
		return this.http.post(this.clinicserviceUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改宝宝科室状态(停用)
	private servicelisttatusUrl = this.url + '/mebcrm/clinicservicestatus/';
	clinicservicestatus(urlOptions,param): Promise<Data>{
		return this.http.post(this.servicelisttatusUrl + urlOptions, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询宝宝科室列表
	private servicelistUrl = this.url + '/mebcrm/servicelist';
	servicelist(urlOptions): Promise<Data>{
		return this.http.get(this.servicelistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//新增或修改诊所科室信息
	private clinicservicejoinUrl = this.url + '/mebcrm/clinicservicejoin';
	clinicservicejoin(params): Promise<Data>{
		return this.http.post(this.clinicservicejoinUrl, params)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询预约列表
	private searchbookingUrl = this.url + '/mebcrm/searchbooking';
	searchbooking(urlOptions): Promise<Data>{
		return this.http.get(this.searchbookingUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改预约
	private updatebookingUrl = this.url + '/mebcrm/updatebooking/';
	updatebooking(id, params): Promise<Data>{
		return this.http.post(this.updatebookingUrl + id, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询医生信息
	private doctorprofileUrl = this.url + '/mebcrm/doctorprofile';
	doctorprofile(urlOptions): Promise<Data>{
		return this.http.get(this.doctorprofileUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建或修改医生科室信息
	private doctorservicejoinUrl = this.url + '/mebcrm/doctorservicejoin';
	doctorservicejoin(params): Promise<Data>{
		return this.http.post(this.doctorservicejoinUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询医生所有科室
	private doctorserviceUrl = this.url + '/mebcrm/doctorservice';
	doctorservice(urlOptions): Promise<Data>{
		return this.http.get(this.doctorserviceUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//后台用户排班记录
	private admindutyUrl = this.url + '/mebcrm/adminduty';
	adminduty(urlOptions): Promise<Data>{
		return this.http.get(this.admindutyUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询医生的科室预约信息
	private doctordutysUrl = this.url + '/mebcrm/doctordutys';
	doctordutys(urlOptions): Promise<Data>{
		return this.http.get(this.doctordutysUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改或删除医生排班
	private updatedutyUrl = this.url + '/mebcrm/updateduty/';
	updateduty(_id, params): Promise<Data>{
		return this.http.post(this.updatedutyUrl + _id, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改预约单进度
	private updatebookstatusUrl = this.url + '/mebcrm/updatebookstatus/';
	updatebookstatus(_id, params): Promise<Data>{
		return this.http.post(this.updatebookstatusUrl + _id, JSON.stringify(params))
			.toPromise()
			.then(response =>  response.json() as Data)
			.catch();
	}

	//追加预约科室
	private addserviceUrl = this.url + '/mebcrm/addservice';
	addservice(params): Promise<Data>{
		return this.http.post(this.addserviceUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//追加或修改预约单消费费用
	private addfeeUrl = this.url + '/mebcrm/addfee';
	addfee(params): Promise<Data>{
		return this.http.post(this.addfeeUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建宝宝
	private crmchildUrl = this.url + '/mebcrm/crmchild';
	crmchild(params): Promise<Data>{
		return this.http.post(this.crmchildUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//图片上传
	private uploadUrl = 'http://upload.qiniu.com/';
	upload(params): Promise<Data>{
		let myHeaders = new Headers();
		myHeaders.set('Content-Type', 'multipart/form-data');

		let options = new RequestOptions({headers: myHeaders});
		return this.http.post(this.uploadUrl, JSON.stringify(params), options)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//获取上传权限
	private qiniutokenUrl = this.url + '/mebcrm/qiniutoken';
	qiniutoken(urlOptions): Promise<Data>{
		return this.http.get(this.qiniutokenUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建诊室
	private clinicroomUrl = this.url + '/mebcrm/clinicroom';
	clinicroom(params): Promise<Data>{
		return this.http.post(this.clinicroomUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看诊所的诊室使用情况
	private clinicconditionsUrl = this.url + '/mebcrm/clinicconditions';
	clinicconditions(urlOptions): Promise<Data>{
		return this.http.get(this.clinicconditionsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//为诊室分配医生
	private allotroomdoctorUrl = this.url + '/mebcrm/allotroomdoctor/';
	allotroomdoctor(urlOptions, params): Promise<Data>{
		return this.http.post(this.allotroomdoctorUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//为预约患者分配诊室
	private updateconditionUrl = this.url + '/mebcrm/updatecondition/';
	updatecondition(urlOptions, params): Promise<Data>{
		return this.http.post(this.updateconditionUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改诊室使用状态
	private updateconditionstatusUrl = this.url + '/mebcrm/updateconditionstatus/';
	updateconditionstatus(urlOptions, params): Promise<Data>{
		return this.http.post(this.updateconditionstatusUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//诊室清空医生
	private removeroomdoctorUrl = this.url + '/mebcrm/removeroomdoctor/';
	removeroomdoctor(urlOptions, params): Promise<Data>{
		return this.http.post(this.removeroomdoctorUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改诊室信息
	private updateclinicroomUrl = this.url + '/mebcrm/updateclinicroom/';
	updateclinicroom(urlOptions, params): Promise<Data>{
		return this.http.post(this.updateclinicroomUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询诊室使用记录
	private clinicconditionrecordsUrl = this.url + '/mebcrm/clinicconditionrecords';
	clinicconditionrecords(urlOptions): Promise<Data>{
		return this.http.get(this.clinicconditionrecordsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建医疗用品
	private medicalsuppliesUrl = this.url + '/mebcrm/medicalsupplies';
	medicalsupplies(urlOptions, params): Promise<Data>{
		return this.http.post(this.medicalsuppliesUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看医疗用品
	private medicalsupplieslistUrl = this.url + '/mebcrm/medicalsupplieslist';
	medicalsupplieslist(urlOptions): Promise<Data>{
		return this.http.get(this.medicalsupplieslistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建医疗用品供应商
	private supplierUrl = this.url + '/mebcrm/supplier';
	supplier(params): Promise<Data>{
		return this.http.post(this.supplierUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看医疗用品供应商
	private supplierlistUrl = this.url + '/mebcrm/supplierlist';
	supplierlist(urlOptions): Promise<Data>{
		return this.http.get(this.supplierlistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改医疗用品供应商
	private updatesupplierUrl = this.url + '/mebcrm/updatesupplier/';
	updatesupplier(urlOptions, params): Promise<Data>{
		return this.http.post(this.updatesupplierUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//诊所医疗用品进货
	private purchaserecordUrl = this.url + '/mebcrm/purchaserecord';
	purchaserecord(params): Promise<Data>{
		return this.http.post(this.purchaserecordUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看进货记录
	private purchaserecordsUrl = this.url + '/mebcrm/purchaserecords';
	purchaserecords(urlOptions): Promise<Data>{
		return this.http.get(this.purchaserecordsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询诊所用品信息
	private searchsuppliesUrl = this.url + '/mebcrm/searchsupplies';
	searchsupplies(urlOptions): Promise<Data>{
		return this.http.get(this.searchsuppliesUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改诊所医疗用品信息
	private updatesuppliesUrl = this.url + '/mebcrm/updatesupplies/';
	updatesupplies(urlOptions, params): Promise<Data>{
		return this.http.post(this.updatesuppliesUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//医生开方
	private doctorprescriptUrl = this.url + '/mebcrm/doctorprescript';
	doctorprescript(params): Promise<Data>{
		return this.http.post(this.doctorprescriptUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询处方
	private searchprescriptUrl = this.url + '/mebcrm/searchprescript';
	searchprescript(urlOptions): Promise<Data>{
		return this.http.get(this.searchprescriptUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//药房根据药方出药
	private outmedicineUrl = this.url + '/mebcrm/outmedicine/';
	outmedicine(urlOptions, params): Promise<Data>{
		return this.http.post(this.outmedicineUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询医疗用品报损情况
	private searchmslostUrl = this.url + '/mebcrm/searchmslost';
	searchmslost(urlOptions): Promise<Data>{
		return this.http.get(this.searchmslostUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//医疗用品报损
	private medicalsupplieslostUrl = this.url + '/mebcrm/medicalsupplieslost';
	medicalsupplieslost(params): Promise<Data>{
		return this.http.post(this.medicalsupplieslostUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//删除用户,用户下面的宝宝
	private deleteuserUrl = this.url + '/mebcrm/deleteuser/';
	deleteuser(urlOptions): Promise<Data>{
		return this.http.get(this.deleteuserUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改宝宝信息
	private updatechildUrl = this.url + '/mebcrm/updatechild/';
	updatechild(urlOptions, params): Promise<Data>{
		return this.http.post(this.updatechildUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询宝宝
	private searchchildUrl = this.url + '/mebcrm/searchchild';
	searchchild(urlOptions): Promise<Data>{
		return this.http.get(this.searchchildUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//删除宝宝
	private deletechildUrl = this.url + '/mebcrm/deletechild/';
	deletechild(urlOptions): Promise<Data>{
		return this.http.get(this.deletechildUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看诊所的检查项目
	private checkprojectsUrl = this.url + '/mebcrm/checkprojects';
	checkprojects(urlOptions): Promise<Data>{
		return this.http.get(this.checkprojectsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建诊所检查项目
	private cliniccheckprojectUrl = this.url + '/mebcrm/cliniccheckproject';
	cliniccheckproject(params): Promise<Data>{
		return this.http.post(this.cliniccheckprojectUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改诊所检查项目
	private updateclinicprojectUrl = this.url + '/mebcrm/updateclinicproject/';
	updateclinicproject(urlOptions, params): Promise<Data>{
		return this.http.post(this.updateclinicprojectUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建用户检查单
	private usercheckprojectUrl = this.url + '/mebcrm/usercheckproject';
	usercheckproject(params): Promise<Data>{
		return this.http.post(this.usercheckprojectUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看用户检查项目
	private usercheckprojectsUrl = this.url + '/mebcrm/usercheckprojects';
	usercheckprojects(urlOptions): Promise<Data>{
		return this.http.get(this.usercheckprojectsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看用户检查详情
	private usercheckprojectinfoUrl = this.url + '/mebcrm/usercheckprojectinfo';
	usercheckprojectinfo(urlOptions): Promise<Data>{
		return this.http.get(this.usercheckprojectinfoUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//删除药方
	private deleteprescriptUrl = this.url + '/mebcrm/deleteprescript/';
	deleteprescript(urlOptions): Promise<Data>{
		return this.http.get(this.deleteprescriptUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改药方数据
	private updateprescriptUrl = this.url + '/mebcrm/updateprescript/';
	updateprescript(urlOptions, params): Promise<Data>{
		return this.http.post(this.updateprescriptUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询所有医生的科室信息
	private doctorbookingUrl = this.url + '/mebcrm/doctorbooking';
	doctorbooking(urlOptions): Promise<Data>{
		return this.http.get(this.doctorbookingUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//填写用户检查结果
	private usercheckresultUrl = this.url + '/mebcrm/usercheckresult/';
	usercheckresult(urlOptions, params): Promise<Data>{
		return this.http.post(this.usercheckresultUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改检查结果
	private updatecheckresultUrl = this.url + '/mebcrm/updatecheckresult/';
	updatecheckresult(urlOptions, params): Promise<Data>{
		return this.http.post(this.updatecheckresultUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看用户回访结果
	private userfollowupsUrl = this.url + '/mebcrm/userfollowups';
	userfollowups(urlOptions): Promise<Data>{
		return this.http.get(this.userfollowupsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建用户回访
	private userfollowupUrl = this.url + '/mebcrm/userfollowup';
	userfollowup(params): Promise<Data>{
		return this.http.post(this.userfollowupUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//填写用户回访结果
	private followupresultUrl = this.url + '/mebcrm/followupresult/';
	followupresult(urlOptions, params): Promise<Data>{
		return this.http.post(this.followupresultUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询库存盘点记录
	private searchstockUrl = this.url + '/mebcrm/searchstock';
	searchstock(urlOptions): Promise<Data>{
		return this.http.get(this.searchstockUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//库存盘点
	private clinicstockUrl = this.url + '/mebcrm/clinicstock';
	clinicstock(params): Promise<Data>{
		return this.http.post(this.clinicstockUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//医生同意退药并修改药方
	private doctorbackUrl = this.url + '/mebcrm/doctorback/';
	doctorback(urlOptions, params): Promise<Data>{
		return this.http.post(this.doctorbackUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询医生同意退药处方数据
	private searchbackdrugUrl = this.url + '/mebcrm/searchbackdrug';
	searchbackdrug(urlOptions): Promise<Data>{
		return this.http.get(this.searchbackdrugUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//药剂师实际退药操作
	private backdrugUrl = this.url + '/mebcrm/backdrug/';
	backdrug(urlOptions, params): Promise<Data>{
		return this.http.post(this.backdrugUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询宝宝成长记录
	private childgrowthrecordsUrl = this.url + '/mebcrm/childgrowthrecords';
	childgrowthrecords(urlOptions): Promise<Data>{
		return this.http.get(this.childgrowthrecordsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建宝宝成长记录
	private childgrowthrecordUrl = this.url + '/mebcrm/childgrowthrecord';
	childgrowthrecord(urlOptions, params): Promise<Data>{
		return this.http.post(this.childgrowthrecordUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询宝宝病历
	private searchcasehistoryUrl = this.url + '/mebcrm/searchcasehistory';
	searchcasehistory(urlOptions): Promise<Data>{
		return this.http.get(this.searchcasehistoryUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建宝宝病历
	private casehistoryUrl = this.url + '/mebcrm/casehistory';
	casehistory(urlOptions, params): Promise<Data>{
		return this.http.post(this.casehistoryUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//增加会员类型
	private addmemberUrl = this.url + '/mebcrm/addmember';
	addmember(params): Promise<Data>{
		return this.http.post(this.addmemberUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看诊所会员
	private memberlistUrl = this.url + '/mebcrm/memberlist';
	memberlist(urlOptions): Promise<Data>{
		return this.http.get(this.memberlistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//修改会员
	private updatememberUrl = this.url + '/mebcrm/updatemember/';
	updatemember(urlOptions, params): Promise<Data>{
		return this.http.post(this.updatememberUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//复制排版
	private copydutyUrl = this.url + '/mebcrm/copyduty/';
	copyduty(urlOptions, params): Promise<Data>{
		return this.http.post(this.copydutyUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//设置会员
	private setmemberUrl = this.url + '/mebcrm/setmember/';
	setmember(urlOptions, params): Promise<Data>{
		return this.http.post(this.setmemberUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//用户充值
	private userrechargeUrl = this.url + '/mebcrm/userrecharge';
	userrecharge(params): Promise<Data>{
		return this.http.post(this.userrechargeUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看交易记录
	private searchtranUrl = this.url + '/mebcrm/searchtran';
	searchtran(urlOptions): Promise<Data>{
		return this.http.get(this.searchtranUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//交易
	private tranStatisticsUrl = this.url + '/mebcrm/transtatistics';
	transtatistics(urlOptions): Promise<Data>{
		return this.http.get(this.tranStatisticsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//预约费用详情
	private bookingfeeUrl = this.url + '/mebcrm/bookingfee/';
	bookingfee(urlOptions): Promise<Data>{
		return this.http.get(this.bookingfeeUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//支付费用 完成预约
	private feepayUrl = this.url + '/mebcrm/feepay/';
	feepay(urlOptions, params): Promise<Data>{
		return this.http.post(this.feepayUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看诊所角色
	private clinicrolelistUrl = this.url + '/mebcrm/clinicrolelist';
	clinicrolelist(urlOptions): Promise<Data>{
		return this.http.get(this.clinicrolelistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//创建诊所角色
	private clinicroleUrl = this.url + '/mebcrm/clinicrole';
	clinicrole(urlOptions, params): Promise<Data>{
		return this.http.post(this.clinicroleUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看权限列表
	private authoritylistUrl = this.url + '/mebcrm/authoritylist';
	authoritylist(urlOptions): Promise<Data>{
		return this.http.get(this.authoritylistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//设置权限
	private setroleauthUrl = this.url + '/mebcrm/setroleauth/';
	setroleauth(urlOptions, params): Promise<Data>{
		return this.http.post(this.setroleauthUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 创建宝宝儿保记录
	private healthrecordUrl = this.url + '/mebcrm/healthrecord';
	healthrecord(urlOptions, params): Promise<Data>{
		return this.http.post(this.healthrecordUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查看宝宝儿保记录
	private searchhealthrecordUrl = this.url + '/mebcrm/searchhealthrecord';
	searchhealthrecord(urlOptions): Promise<Data>{
		return this.http.get(this.searchhealthrecordUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 删除检查
	private deleteusercheckUrl = this.url + '/mebcrm/deleteusercheck/';
	deleteusercheck(urlOptions): Promise<Data>{
		return this.http.get(this.deleteusercheckUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 药品零售
	private drugretailUrl = this.url + '/mebcrm/drugretail';
	drugretail(params): Promise<Data>{
		return this.http.post(this.drugretailUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询药品零售记录
	private searchdrugretailUrl = this.url + '/mebcrm/searchdrugretail';
	searchdrugretail(urlOptions): Promise<Data>{
		return this.http.get(this.searchdrugretailUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查看减免授权记录
	private searchwaiverauthnotesUrl = this.url + '/mebcrm/searchwaiverauthnotes';
	searchwaiverauthnotes(urlOptions): Promise<Data>{
		return this.http.get(this.searchwaiverauthnotesUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 创建(发起)授权
	private waiverauthUrl = this.url + '/mebcrm/waiverauth';
	waiverauth(params): Promise<Data>{
		return this.http.post(this.waiverauthUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查看减免授权
	private searchwaiverauthUrl = this.url + '/mebcrm/searchwaiverauth/';
	searchwaiverauth(urlOptions): Promise<Data>{
		return this.http.get(this.searchwaiverauthUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 管理授权减免金额
	private waiverauthnoteUrl = this.url + '/mebcrm/waiverauthnote';
	waiverauthnote(params): Promise<Data>{
		return this.http.post(this.waiverauthnoteUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查看诊所辅助项目
	private searchassistUrl = this.url + '/mebcrm/searchassist';
	searchassist(urlOptions): Promise<Data>{
		return this.http.get(this.searchassistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 增加或修改辅助项目
	private clinicassistUrl = this.url + '/mebcrm/clinicassist';
	clinicassist(params): Promise<Data>{
		return this.http.post(this.clinicassistUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询患者的辅助项目
	private bookingassistUrl = this.url + '/mebcrm/bookingassist';
	bookingassist(urlOptions): Promise<Data>{
		return this.http.get(this.bookingassistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 预约追加辅助项目
	private addassistUrl = this.url + '/mebcrm/addassist';
	addassist(params): Promise<Data>{
		return this.http.post(this.addassistUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 病历主诉模板
	private cprtemplateUrl = this.url + '/mebcrm/cprtemplate';
	cprtemplate(urlOptions): Promise<Data>{
		return this.http.get(this.cprtemplateUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 删除预约的辅助项目
	private deleteassistUrl = this.url + '/mebcrm/deleteassist/';
	deleteassist(urlOptions): Promise<Data>{
		return this.http.get(this.deleteassistUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 会员支付预约金
	private memberbookingUrl = this.url + '/mebcrm/memberbooking/';
	memberbooking(urlOptions): Promise<Data>{
		return this.http.get(this.memberbookingUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 检查是否预约
	private checkbookingUrl = this.url + '/mebcrm/checkbooking';
	checkbooking(urlOptions): Promise<Data>{
		return this.http.get(this.checkbookingUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询小孩中等身高体重
	private childcontrastUrl = this.url + '/mebcrm/childcontrast';
	childcontrast(urlOptions): Promise<Data>{
		return this.http.get(this.childcontrastUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询医生某天值班信息
	private doctordaydutysUrl = this.url + '/mebcrm/doctordaydutys';
	doctordaydutys(urlOptions): Promise<Data>{
		return this.http.get(this.doctordaydutysUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 修改密码
	private updatepwdUrl = this.url + '/mebcrm/updatepwd';
	updatepwd(params): Promise<Data>{
		return this.http.post(this.updatepwdUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 取消预约
	private bookingcancelledUrl = this.url + '/mebcrm/bookingcancelled/';
	bookingcancelled(urlOptions): Promise<Data>{
		return this.http.get(this.bookingcancelledUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 支付挂账金额
	private payguazhangUrl = this.url + '/mebcrm/payguazhang/';
	payguazhang(urlOptions, params): Promise<Data>{
		return this.http.post(this.payguazhangUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 继续加药
	private adddrugUrl = this.url + '/mebcrm/adddrug/';
	adddrug(urlOptions, params): Promise<Data>{
		return this.http.post(this.adddrugUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 退还部分预约金
	private bookingrefundUrl = this.url + '/mebcrm/bookingrefund/';
	bookingrefund(urlOptions): Promise<Data>{
		return this.http.get(this.bookingrefundUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 身高体重成长折线图
	private childgrowthchartUrl = this.url + '/mebcrm/childgrowthchart';
	childgrowthchart(urlOptions): Promise<Data>{
		return this.http.get(this.childgrowthchartUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 追加交易信息(服全款者有新消费项目)
	private addtranUrl = this.url + '/mebcrm/addtran/';
	addtran(urlOptions): Promise<Data>{
		return this.http.get(this.addtranUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 添加小孩临时信息
	private childinfoUrl = this.url + '/mebcrm/childinfo/';
	childinfo(urlOptions, params): Promise<Data>{
		return this.http.post(this.childinfoUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询小孩临时信息
	private getChildinfoUrl = this.url + '/mebcrm/childinfo';
	getChildinfo(urlOptions): Promise<Data>{
		return this.http.get(this.getChildinfoUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 删除医生服务信息
	private deletedoctorserviceUrl = this.url + '/mebcrm/deletedoctorservice/';
	deletedoctorservice(urlOptions): Promise<Data>{
		return this.http.get(this.deletedoctorserviceUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 保存病历图片信息
	private uploadcasehistoryUrl = this.url + '/mebcrm/uploadcasehistory';
	uploadcasehistory(params): Promise<Data>{
		return this.http.post(this.uploadcasehistoryUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 删除病历图片
	private deletechfileUrl = this.url + '/mebcrm/deletechfile/';
	deletechfile(urlOptions): Promise<Data>{
		return this.http.get(this.deletechfileUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 保存儿保图片信息
	private uploadhealthrecordUrl = this.url + '/mebcrm/uploadhealthrecord';
	uploadhealthrecord(params): Promise<Data>{
		return this.http.post(this.uploadhealthrecordUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 删除儿保图片
	private deletehrfileUrl = this.url + '/mebcrm/deletehrfile/';
	deletehrfile(urlOptions): Promise<Data>{
		return this.http.get(this.deletehrfileUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询所有消息类型
	private messagetypesUrl = this.url + '/mebcrm/messagetypes';
	messagetypes(urlOptions): Promise<Data>{
		return this.http.get(this.messagetypesUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 修改订阅消息类型
	private messagejoinUrl = this.url + '/mebcrm/messagejoin';
	messagejoin(params): Promise<Data>{
		return this.http.post(this.messagejoinUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询诊所消息接口
	private searchmessageUrl = this.url + '/mebcrm/searchmessage';
	searchmessage(urlOptions): Promise<Data>{
		return this.http.get(this.searchmessageUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 完成此消息
	private finishmessageUrl = this.url + '/mebcrm/finishmessage/';
	finishmessage(urlOptions, params): Promise<Data>{
		return this.http.post(this.finishmessageUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 审核完成病例
	private checkcasehistoryUrl = this.url + '/mebcrm/checkcasehistory';
	checkcasehistory(urlOptions, params): Promise<Data>{
		return this.http.post(this.checkcasehistoryUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 审核完成病例
	private checkhealthrecordUrl = this.url + '/mebcrm/checkhealthrecord';
	checkhealthrecord(urlOptions, params): Promise<Data>{
		return this.http.post(this.checkhealthrecordUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 根据嘉宝云child_id，获取育儿宝库child_id
	private gtchildUrl = this.yebkUrl + '/mebapi/gtchild';
	gtchild(urlOptions): Promise<Data>{
		return this.http.get(this.gtchildUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询小孩回答结果
	private childreviewUrl = this.yebkUrl + '/mebapi/childreview';
	childreview(urlOptions): Promise<Data>{
		return this.http.get(this.childreviewUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 根据小孩id查询他需要回答的问题
	private growthquestionsUrl = this.yebkUrl + '/mebapi/growthquestions';
	growthquestions(urlOptions): Promise<Data>{
		return this.http.get(this.growthquestionsUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 保存成长测评结果
	private gtanswerUrl = this.yebkUrl + '/mebapi/gtanswer';
	gtanswer(params): Promise<Data>{
		return this.http.post(this.gtanswerUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 删除预约费用
	deletebkfee(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/deletebkfee/' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 修改交易信息
	updatetran(urlOptions, params): Promise<Data>{
		var url = this.url + '/mebcrm/updatetran/' + urlOptions;
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 创建修改中药药材
	clinictcm(params): Promise<Data>{
		var url = this.url + '/mebcrm/clinictcm';
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询中药药材
	searchtcm(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/searchtcm' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询中药处方
	searchpotcm(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/searchpotcm' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 创建修改中药处方
	clinicpotcm(params): Promise<Data>{
		var url = this.url + '/mebcrm/clinicpotcm';
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询中药药方
	searchtcmprescript(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/searchtcmprescript' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 医生创建/修改中药药方
	tcmprescript(params): Promise<Data>{
		var url = this.url + '/mebcrm/tcmprescript';
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 中药药方出药
	outtcmp(urlOptions, params): Promise<Data>{
		var url = this.url + '/mebcrm/outtcmp/' + urlOptions;
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 中药进货
	tcmpurchase(params): Promise<Data>{
		var url = this.url + '/mebcrm/tcmpurchase';
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 中药药方出药
	updatepinfo(urlOptions, params): Promise<Data>{
		var url = this.url + '/mebcrm/updatepinfo/' + urlOptions;
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查询活动卡列表
	searchactcard(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/searchactcard' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 新增修改活动卡
	actcard(params): Promise<Data>{
		var url = this.url + '/mebcrm/actcard';
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 用户购买活动卡
	useractcard(params): Promise<Data>{
		var url = this.url + '/mebcrm/useractcard';
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 根据起始金额查询会员卡列表
	memberstart(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/memberstart' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 会员升级
	memberup(urlOptions, params): Promise<Data>{
		var url = this.url + '/mebcrm/memberup/' + urlOptions;
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 发送预约短信提醒
	bookingsms(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/bookingsms/' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 网络电话拨打
	calluser(params): Promise<Data>{
		var url = this.url + '/mebcrm/calluser';
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 挂断网络电话
	hangupuser(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/hangupuser' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 完成此辅助治疗
	finishassist(urlOptions, params): Promise<Data>{
		var url = this.url + '/mebcrm/finishassist/' + urlOptions;
		return this.http.post(url, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 统计需手动出库辅助治疗药物
	countassist(urlOptions): Promise<Data>{
		var url = this.url + '/mebcrm/countassist' + urlOptions;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	getUser(){
		return JSON.parse(this.getCookie('user'));
	}

	// 去除左右空格
	trim(str){
		if(str == '' || str == undefined || str == null){
			return str;
		}else{
		    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
		}
	}

	// 验证手机号
	checkMobile(mobile) {
		if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(mobile))){
			return false;
		}
		return true;
	}

	//保留两位小数
	toDecimal2(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return '0.00';
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
    	//小数点不足两位
    	if(s.length <= rs + 2){
	        while (s.length <= rs + 2) {
	            s += '0';
	        }
    	}else{
    		//小数点超过两位
    		s = s.substring(0, rs + 3);
    	}
        return s;
    }

	//获取周日期
	getWeekByNumber(value) {
		//当天日期
		var nowDate = new Date();
		//当天为周几
		var nowDay = (nowDate.getDay() == 0 ? 7 : nowDate.getDay());
		//周当天日期
		var weekNowDate = new Date(nowDate.getTime() + (value * 7 * 24 * 60 * 60 * 1000));
		//周日期列表
		var weekArray = new Array();
		//该周周一
		var weekFirst = new Date(weekNowDate.getTime() - ((nowDay - 1) * 24 * 60 * 60 * 1000));
		//周日起
		for(var i = 0; i < 7; i++){
			var weekDay = new Date(weekFirst.getTime() + i * 24 * 60 * 60 * 1000);
			weekArray.push(this.getDayByDate(weekDay));
		}
		return weekArray;
	}

	//根据date获取日期
	getDayByDate(date) {
      	var d = date.getDate(),
      		m = date.getMonth(),
      		y = date.getFullYear();
      	return y + '-' + ((m + 1) > 9 ? (m + 1) : ('0' + (m + 1))) + '-' + (d > 9 ? d : ('0' + d));
    }

	// 日期格式转换
	dateFormat(date) {
		if(!this.isFalse(date)){
			var dateArray = date.split('-');
			return dateArray[0] + '年' + dateArray[1] + '月' + dateArray[2] + '日';
		}else{
			return '';
		}
	}

	// 日期转换
	dateFormatHasWord(date) {
		date = date.replace('年', '-');
		date = date.replace('月', '-');
		date = date.replace('日', '');
		return date;
	}

    //获取周几
	getWeekTitle(value) {
		var title = '';
		switch(value){
			case 0:
				title = '星期一';
				break;
			case 1:
				title = '星期二';
				break;
			case 2:
				title = '星期三';
				break;
			case 3:
				title = '星期四';
				break;
			case 4:
				title = '星期五';
				break;
			case 5:
				title = '星期六';
				break;
			case 6:
				title = '星期天';
				break;
		}
		return title;
	}

	//删除cookie
	delCookie(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 2*24*60*60*1000);
		var cval= this.getCookie(name);
		if(cval!=null){
			var pathList = [
				'/',
				'/admin',
				'/admin/workbench',
				'/admin/material',
				'/admin/medical',
				'/admin/scheduling',
				'/admin/prescript',
				'/admin/authorize',
				'/admin/doctor',
				'/admin/crmuser',
				'/admin/docbooking',
			]
			for(var i in pathList){
				document.cookie = name + "=" + cval + ";expires=" + exp + ";Path=" + pathList[i];
			}
		}
	}

	//设置cookie
	setCookie(name, value, time){
		var Days = time;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "=" + value + ";expires=" + exp + ";Path=/";
	}

	//读取cookie
	getCookie(name){
        var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return arr[2];
        else
        return null;
    }

	// 非空
	isFalse(_value) {
		switch(_value){
			case null:
				return true;
			case undefined:
				return true;
			case '':
				return true;
			default:
				return false;
		}
	}

	//获取参数json
	getUrlParams(url) {
		var urlQuery = url.substring(url.indexOf('?') + 1).split('&');
		var queryString = '{';
		for(var i = 0; i < urlQuery.length; i++){
			queryString += '"' + urlQuery[i].split('=')[0] + '":' + '"' + urlQuery[i].split('=')[1].replace('%2F', '/') + '",';
		}
		if(queryString.length > 1){
			queryString = queryString.slice(0, queryString.length -1);
		}
		queryString += '}';
		return JSON.parse(queryString);
	}

	// 颜色码
	colorList() {
		return [
			'color1',
			'color2',
			'color3',
			'color4',
			'color5',
			'color6',
			'color7',
			'color8',
			'color9',
			'color10',
			'color11',
			'color12',
			'color13',
			'color14',
			'color15',
		];
	}

	isArray(o) {
		return Object.prototype.toString.call(o)=='[object Array]';
	}

	compare(val1,val2) {
	    // 转换为拼音
	    val1 = Pinyin.getCamelChars(val1.name).toLowerCase();
	    val2 = Pinyin.getCamelChars(val2.name).toLowerCase();

	    // 获取较长的拼音的长度
	    var length =  val1.length > val2.length ? val1.length:val2.length ;

	    // 依次比较字母的unicode码，相等时返回0，小于时返回-1，大于时返回1
	    for(var i = 0; i < length; i++ ) {
	        var differ = val1.charCodeAt(i) - val2.charCodeAt(i);
	        if(differ == 0) {
	            continue;
	        }else {
	            if(val1.charAt(i) == '_' ) {
	                return -1;
	            }
	            return differ;
	        }
	    }
	    if(i == length) {
	        return val1.length - val2.length;
	    }
	}

	stopl(str, digit) {
		return Math.round(parseFloat(str) * Math.pow(10, digit));
	}
}
