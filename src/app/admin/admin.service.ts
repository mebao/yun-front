import { Headers, Http, RequestOptions }          from '@angular/http';
import { Injectable }                             from '@angular/core';
import { Data }                                   from './data';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AdminService{
	// private url = 'http://192.168.31.114/mebnew';
	private url = 'http://wapapi.jiabaokangle.com';

	constructor(private http: Http) {}

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
		return this.http.delete(this.deleteadminUrl + urlOptions)
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

	//查询诊所服务
	private clinicservicesUrl = this.url + '/mebcrm/clinicservices';
	clinicservices(urlOptions): Promise<Data>{
		return this.http.get(this.clinicservicesUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//根据服务查询医生可预约日期
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

	//新增或修改小孩服务信息
	private clinicserviceUrl = this.url + '/mebcrm/clinicservice';
	clinicservice(param): Promise<Data>{
		return this.http.post(this.clinicserviceUrl, JSON.stringify(param))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询小孩服务列表
	private servicelistUrl = this.url + '/mebcrm/servicelist';
	servicelist(): Promise<Data>{
		return this.http.get(this.servicelistUrl)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//新增或修改诊所服务信息
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

	//创建或修改医生服务信息
	private doctorservicejoinUrl = this.url + '/mebcrm/doctorservicejoin';
	doctorservicejoin(params): Promise<Data>{
		return this.http.post(this.doctorservicejoinUrl, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	//查询医生所有服务
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

	//查询医生的服务预约信息
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

	//追加预约服务
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

	//创建小孩
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

	getUser(){
		return JSON.parse(this.getCookie('user'));
	}

	//获取周日期
	getWeekByNumber(value) {
		//当天日期
		var nowDate = new Date();
		//当天为周几
		var nowDay = nowDate.getDay();
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
		exp.setTime(exp.getTime() - 1*24*60*60*1000);
		var cval= this.getCookie(name);
		if(cval!=null)
		document.cookie = name + "=" + cval + ";expires=" + exp;
	}

	//设置cookie
	setCookie(name, value, time){
		var Days = time;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "=" + value + ";expires=" + exp;
	}

	//读取cookie
	getCookie(name){
        var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return arr[2];
        else
        return null;
    }

}