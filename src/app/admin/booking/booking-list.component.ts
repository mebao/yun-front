import { Component, OnInit }           from '@angular/core';
import { Router, ActivatedRoute }     from '@angular/router';

import { AdminService }                from '../admin.service';

@Component({
	selector: 'app-booking-list',
	templateUrl: './booking-list.component.html'
})
export class BookingListComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
	selectedTab: number;
	url: string;
	clinics: [{}];
	doctorlist: any[];
	servicelist: [{}];
	searchInfo: {
		doctor_id: string;
		service_id: string;
		mobile: string,
		creator_name: string,
		cdate_less: string,
		cdate_big: string,
		bdate_less: string,
		bdate_big: string,
	}
	bookinglist: any[];
	weeklist: any[];
	weektitle: any[];
	timelist: any[];
	weekNum: number;
	showBookinglist: any[];
	use: boolean;
	modalTab: boolean;
	modalConfirmTab: boolean;
	selectorBooking: {
		age: string,
		bookingDate: string,
		bookingId: string,
		childId: string,
		childName: string,
		creatorId: string,
		creatorName: string,
		mobile: string,
		refNo: string,
		serviceId: string,
		serviceName: string,
		status: string,
		statusText: string,
		time: string,
		type: string,
		userDoctorId: string,
		userDoctorName: string,
		text: string,
	}
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;

	constructor(
		public adminService: AdminService,
		public router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '预约列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasData = false;

		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			mobile: '',
			creator_name: '',
			cdate_less: '',
			cdate_big: '',
			bdate_less: '',
			bdate_big: '',
		}

		this.use = true;

		this.weekNum = 0;
		this.modalTab = false;
		this.modalConfirmTab = false;
		//timelist
		this.timelist = [
			{key: '08:00'},
			{key: '08:30'},
			{key: '09:00'},
			{key: '09:30'},
			{key: '10:00'},
			{key: '10:30'},
			{key: '11:00'},
			{key: '11:30'},
			{key: '12:00'},
			{key: '12:30'},
			{key: '13:00'},
			{key: '13:30'},
			{key: '14:00'},
			{key: '14:30'},
			{key: '15:00'},
			{key: '15:30'},
			{key: '16:00'},
			{key: '16:30'},
			{key: '17:00'},
			{key: '17:30'},
		];
		this.selectedTab = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		//诊所列表
		this.adminService.clinicdata().then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.clinics.length > 0){
					//week列表
					this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId + '&weekindex=0', 'week');
					//booking列表
					this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId, 'list');
					this.getDoctorList();
					this.getServiceList();
				}
				this.clinics = results.clinics;
			}
		})
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

	//服务列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.clinicservices(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.servicelist = results.servicelist;
				this.servicelist.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择服务'});
			}
		})
	}

	//预约列表
	getList(urlOptions, type) {
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var todayTime = new Date().getTime();
				if(type == 'week'){
					var weekbooks = JSON.parse(JSON.stringify(data.results)).weekbooks;
					var weekArray = this.adminService.getWeekByNumber(this.weekNum);
					//weeklist
					var weeklist = new Array();
					//weektitle
					var weektitle = new Array();
					for(var i = 0; i < 7; i++){
						var title = {
							date: weekArray[i],
							title: this.adminService.getWeekTitle(i)
						}
						weektitle.push(title);
						var week = {
							date: weekArray[i],
							use: true,
							timeList: [
								{key: '08:00', value: []},
								{key: '08:30', value: []},
								{key: '09:00', value: []},
								{key: '09:30', value: []},
								{key: '10:00', value: []},
								{key: '10:30', value: []},
								{key: '11:00', value: []},
								{key: '11:30', value: []},
								{key: '12:00', value: []},
								{key: '12:30', value: []},
								{key: '13:00', value: []},
								{key: '13:30', value: []},
								{key: '14:00', value: []},
								{key: '14:30', value: []},
								{key: '15:00', value: []},
								{key: '15:30', value: []},
								{key: '16:00', value: []},
								{key: '16:30', value: []},
								{key: '17:00', value: []},
								{key: '17:30', value: []},
							]
						}
						for(var j = 0; j < week.timeList.length; j++){
							//遍历返回结果，将预约信息添加进timeList
							for(var k = 0; k < weekbooks.length; k++){
								if(weekArray[i] == weekbooks[k].bookingDate && week.timeList[j].key == weekbooks[k].time){
									week.timeList[j].value.push(weekbooks[k]);
								}
							}
						}
						//日期若未过去，则不可修改，只可查看
						if((new Date(weekArray[i]).getTime() + 24*60*60*1000) < todayTime){
							week.use = false;
						}else{
							week.use = true;
						}
						weeklist.push(week);
					}
					this.weektitle = weektitle;
					this.weeklist = weeklist;
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.weekbooks.length > 0){
						for(var i = 0; i < results.weekbooks.length; i++){
							if((new Date(results.weekbooks[i].bookingDate).getTime() + 24*60*60*1000) < todayTime){
								results.weekbooks[i].use = false;
							}else{
								results.weekbooks[i].use = true;
							}
						}
					}
					this.bookinglist = results.weekbooks;
				}
				this.hasData = true;
			}
		})
	}

	//上一周
	prec() {
		this.weekNum--;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=' + this.weekNum;
		this.getList(urlOptions, 'week');
	}

	//本周
	now() {
		this.weekNum = 0;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=0';
		this.getList(urlOptions, 'week');
	}

	//下一周
	next() {
		this.weekNum++;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=' + this.weekNum;
		this.getList(urlOptions, 'week');
	}
	
	//查询
	search() {
		//日历
		var urlOptions = this.getUrlOptios();
		this.getList(urlOptions + '&weekindex=' + this.weekNum, 'week');
		//列表
		var urlOptionsList = this.getUrlOptios();
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
		this.getList(urlOptionsList, 'list');
	}

	//查询今天
	// today() {
	// 	var urlOptions = this.getUrlOptios();
	// 	urlOptions += '&today=1';
	// 	this.getList(urlOptions, 'list');
	// }

	//切换
	checkTab(value) {
		this.selectedTab = value;
	}

	//查看
	info(_id){//可编辑日期
		this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: _id}});
	}

	getUrlOptios() {
		var urlOptions = this.url;
		urlOptions += '&clinic_id=' + this.adminService.getUser().clinicId;
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

	create() {
		this.router.navigate(['./admin/booking']);
	}

	show(value, use) {
		if(value.length > 0){
			this.showBookinglist = value;
			this.use = use;
			this.modalTab = true;
		}
	}

	close() {
		this.modalTab = false;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	complete(booking) {
		this.modalTab = false;
		this.selectorBooking = booking;
		this.selectorBooking.text = '确定完成' +　this.selectorBooking.creatorName　+　'(' +　this.selectorBooking.childName　+　')的预约';
		this.modalConfirmTab = true;
	}

	confirm() {
		this.modalConfirmTab = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			status: '5',
		}
		this.adminService.updatebookstatus(this.selectorBooking.bookingId, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('操作成功', '');
				this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId + '&weekindex=' + this.weekNum, 'week');
			}
		})
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