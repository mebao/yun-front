import { Component }                          from '@angular/core';
import { Router }                             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-booking-receive',
	templateUrl: './booking-receive.component.html',
	styleUrls: ['./booking-receive.component.scss'],
})
export class BookingReceiveComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		receive: boolean,
		receiveAll: boolean,
	}
	loadingShow: boolean;
	url: string;
	doctorlist: any[];
	servicelist: [{}];
	searchInfo: {
		doctor_id: string;
		service_id: string;
		mobile: string,
		creator_name: string,
		cdate_less: string,
		cdate_less_num: number,
		cdate_less_text: string,
		cdate_big: string,
		cdate_big_num: number,
		cdate_big_text: string,
		bdate_less: string,
		bdate_less_num: number,
		bdate_less_text: string,
		bdate_big: string,
		bdate_big_num: number,
		bdate_big_text: string,
	}
	bookinglist: any[];
	hasData: boolean;

	constructor(
		public adminService: AdminService,
		public router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '接诊列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		//权限
		this.moduleAuthority = {
			see: false,
			receive: false,
			receiveAll: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.hasData = false;
		this.loadingShow = true;

		var todayDate = this.adminService.getDayByDate(new Date());
		if(JSON.parse(sessionStorage.getItem('search-bookingReceive'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-bookingReceive'));
		}else{
			this.searchInfo = {
				doctor_id: '',
				service_id: '',
				mobile: '',
				creator_name: '',
				cdate_less: '',
				cdate_less_num: 0,
				cdate_less_text: '',
				cdate_big: '',
				cdate_big_num: 0,
				cdate_big_text: '',
				bdate_less: todayDate,
				bdate_less_num: new Date(todayDate).getTime(),
				bdate_less_text: this.adminService.dateFormat(todayDate),
				bdate_big: todayDate,
				bdate_big_num: new Date(todayDate).getTime(),
				bdate_big_text: this.adminService.dateFormat(todayDate),
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		this.search();
		this.getDoctorList();
		this.getServiceList();
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&clinic_id='
			 + this.adminService.getUser().clinicId + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		})
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.clinicservices(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.servicelist = results.servicelist;
				this.servicelist.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择科室'});
			}
		})
	}

	//预约列表
	getList(urlOptions) {
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					for(var i = 0; i < results.weekbooks.length; i++){
						var allFee = 0;
						if(results.weekbooks[i].fees.length > 0){
							for(var j = 0; j < results.weekbooks[i].fees.length; j++){
								allFee += Number(results.weekbooks[i].fees[j].fee);
							}
						}
						results.weekbooks[i].allFee = parseFloat(allFee.toString());
					}
				}
				this.bookinglist = results.weekbooks;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	//查询
	search() {
		// 记录搜索条件
		sessionStorage.setItem('search-bookingReceive', JSON.stringify(this.searchInfo));
		//列表
		var urlOptionsList = this.getUrlOptios();
		//接诊个人和接诊所有
		if(this.moduleAuthority.receive && !this.moduleAuthority.receiveAll){
			urlOptionsList += '&mybooking=1';
		}
		if(this.searchInfo.cdate_less && this.searchInfo.cdate_less != ''){
			urlOptionsList += '&cdate_less=' + this.searchInfo.cdate_less;
		}
		if(this.searchInfo.cdate_big && this.searchInfo.cdate_big != ''){
			urlOptionsList += '&cdate_big=' + this.searchInfo.cdate_big;
		}
		if(this.searchInfo.bdate_less && this.searchInfo.bdate_less != ''){
			urlOptionsList += '&bdate_less=' + this.searchInfo.bdate_less;
		}
		if(this.searchInfo.bdate_big && this.searchInfo.bdate_big != ''){
			urlOptionsList += '&bdate_big=' + this.searchInfo.bdate_big;
		}
		this.getList(urlOptionsList);
	}

	// 选择日期
	changeDate(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
		this.searchInfo[key + '_text'] = this.adminService.dateFormat(JSON.parse(_value).value);
	}

	//查看
	info(booking, service){
		//可编辑日期
		//重置详情选中模块
		sessionStorage.setItem('doctorBookingTab', '3');
		this.router.navigate(['./admin/docbooking'], {queryParams: {id: booking.bookingId, doctorId: service.userDoctorId}});
	}

	getUrlOptios() {
		var urlOptions = this.url;
		urlOptions += '&clinic_id=' + this.adminService.getUser().clinicId + '&statuslist=4,5,11';
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptions += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.mobile && this.searchInfo.mobile != ''){
			urlOptions += '&mobile=' + this.searchInfo.mobile;
		}
		if(this.searchInfo.creator_name && this.searchInfo.creator_name != ''){
			urlOptions += '&creator_name=' + this.searchInfo.creator_name;
		}
		return urlOptions;
	}

	//付款
	payment(booking) {
		sessionStorage.setItem('bookingInfo', JSON.stringify(booking));
		this.router.navigate(['./admin/bookingPayment'], {queryParams: {id: booking.bookingId}});
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
