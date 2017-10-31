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
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	//权限
	moduleAuthority: {
		see: boolean,
		info: boolean,
		add: boolean,
		update: boolean,
	}
	selectedTab: number;
	url: string;
	doctorlist: any[];
	servicelist: any[];
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
	hasData: boolean;
	// 家长
	userList: any[];

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

		//权限
		this.moduleAuthority = {
			see: false,
			info: false,
			add: false,
			update: false,
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
		this.bookinglist = [];
		this.showBookinglist = [];
		this.weeklist = [];

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
			{key: '18:00'},
			{key: '18:30'},
			{key: '19:00'},
			{key: '19:30'},
			{key: '20:00'},
			{key: '20:30'},
			{key: '21:00'},
			{key: '21:30'},
			{key: '22:00'},
			{key: '22:30'},
			{key: '23:00'},
			{key: '23:30'},
		];
		this.selectedTab = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		this.getDoctorList();
		this.servicelist = [];
		this.getServiceList();

		// 获取家长信息
		this.userList = [];
		this.adminService.searchuser(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					for(var i = 0; i < results.users.length; i++){
						results.users[i].string = JSON.stringify(results.users[i]);
						results.users[i].key = JSON.stringify(results.users[i]);
						results.users[i].value = results.users[i].name + '(' + results.users[i].mobile + ')';
					}
				}
				this.userList = results.users;
			}
		});
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
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].color = this.adminService.colorList()[i % 10];
						results.servicelist[i].infoList = [];
					}
				}
				this.servicelist = results.servicelist;

				// 根据服务获取服务颜色
				//week列表
				this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId + '&weekindex=0', 'week');
				//booking列表
				this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId, 'list');
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
							date: this.adminService.dateFormat(weekArray[i]),
							title: this.adminService.getWeekTitle(i)
						}
						weektitle.push(title);
						var week = {
							date: this.adminService.dateFormat(weekArray[i]),
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
								{key: '18:00', value: []},
								{key: '18:30', value: []},
								{key: '19:00', value: []},
								{key: '19:30', value: []},
								{key: '20:00', value: []},
								{key: '20:30', value: []},
								{key: '21:00', value: []},
								{key: '21:30', value: []},
								{key: '22:00', value: []},
								{key: '22:30', value: []},
								{key: '23:00', value: []},
								{key: '23:30', value: []},
							]
						}
						for(var j = 0; j < week.timeList.length; j++){
							// 服务列表
							var serviceListData = JSON.parse(JSON.stringify(this.servicelist));

							//遍历返回结果，将预约信息添加进timeList
							for(var k = 0; k < weekbooks.length; k++){
								if(this.adminService.dateFormat(weekArray[i]) == weekbooks[k].bookingDate && week.timeList[j].key == weekbooks[k].time){
									// weekbooks[k].servicesLength = weekbooks[k].services.length;
									// week.timeList[j].value.push(weekbooks[k]);
									// 添加服务列表
									if(serviceListData.length > 0){
										for(var m = 0; m < serviceListData.length; m++){
											if(serviceListData[m].serviceId == weekbooks[k].services[0].serviceId){
												serviceListData[m].infoList.push(weekbooks[k]);
											}
										}
									}
								}
							}

							week.timeList[j].value = serviceListData;
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

	selectUser(_value) {
		this.searchInfo.mobile = JSON.parse(_value).mobile;
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
		//判断查看权限
		if(this.moduleAuthority.info){
			this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: _id}});
		}
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
		this.router.navigate(['./admin/booking'], {queryParams: {type: 'create'}});
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
