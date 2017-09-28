import { Component, OnInit, HostBinding }             from '@angular/core';
import { Router, ActivatedRoute }                     from '@angular/router';

// import { slideInDownAnimation }                       from '../../animations';
import { AdminService }                               from '../admin.service';

@Component({
	selector: 'app-scheduling',
	templateUrl: './workbench-reception.component.html',
	styleUrls: ['./workbench-reception.component.scss'],
	// animations: [slideInDownAnimation],
})
export class WorkbenchReceptionComponent{
	// @HostBinding('@routeAnimation') routeAnimation = true;
	// @HostBinding('style.display')   display = 'block';
	// @HostBinding('style.position')  position = 'absolute';
	// @HostBinding('style.width')     width = '100%';
	topBar: {
		title: string,
		back: boolean,
	};
	weektitle: any[];
	schedulinglist: any[];
	weekNumConfig: number;
	weekNumBooking: number;
	url: string;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasDoctorBookingData: boolean;
	doctorBookingList: any[];
	weekBookingTitle: any[];
	modalTab: boolean;
	showBookinglist: any[];
	searchInfo: {
		doctor: string,
		service: string,
	}
	doctorList: any[];
	serviceList: any[];
	doctorDutyList: any[];
	selected: {
		doctor: string,
		tab: string,
		type: string,
	}
	modalConfirmTab: boolean;
	modalConfirm: {
		text: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '前台工作台',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasDoctorBookingData = false;
		this.doctorBookingList = [];
		this.modalTab = false;
		this.showBookinglist = [];
		this.searchInfo = {
			doctor: '',
			service: '',
		}

		this.weekNumConfig = 0;
		this.weekNumBooking = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

	 	//获取医生列表
	 	this.doctorList = [];
	 	var adminlistUrl = this.url + '&role=2';
	 	this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					for(var i = 0; i < results.adminlist.length; i++){
						results.adminlist[i].string = JSON.stringify(results.adminlist[i]);
					}
				}
				this.doctorList = results.adminlist;
			}
		});

		//获取科室列表
		this.serviceList = [];
		this.adminService.clinicservices(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].string = JSON.stringify(results.servicelist[i]);
					}
				}
				this.serviceList = results.servicelist;
			}
		});

		this.doctorDutyList = [];
		this.selected = {
			doctor: '',
			tab: '1',
			type: '',
		};
		this.modalConfirmTab = false;
		this.modalConfirm = {
			text: '',
		}

		this.search();
	}

	search() {
		var dutyUrl = this.url + '&weekindex=' + this.weekNumConfig;
		var bookingUrl = this.url + '&weekindex=' + this.weekNumConfig;
		if(this.searchInfo.doctor != ''){
			dutyUrl += '&doctor_id=' + JSON.parse(this.searchInfo.doctor).id;
			bookingUrl += '&doctorId=' + JSON.parse(this.searchInfo.doctor).id;
		}
		if(this.searchInfo.service != ''){
			bookingUrl += '&service_id=' + JSON.parse(this.searchInfo.service).serviceId;
		}
		this.getList(dutyUrl);
		this.getBookingList(bookingUrl);
	}

	getList(urlOptions) {
		this.adminService.adminduty(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var adminduty = JSON.parse(JSON.stringify(data.results)).adminduty;
				if(adminduty.length > 0){
					var weekArray = this.adminService.getWeekByNumber(this.weekNumConfig);
					var weektitle = [];
					//先遍历医生
					for(var i = 0; i < adminduty.length; i++){
						adminduty[i].weekScheduling = [];
						for(var j = 0; j < weekArray.length; j++){
							var title = {
								date: this.adminService.dateFormat(weekArray[j]),
								title: this.adminService.getWeekTitle(j)
							}
							var scheduling = {
								dutyConfigList: [],
								dutyDay: this.adminService.dateFormat(weekArray[j]),
								dutyId: '',
								dutyName: ''
							}
							if(adminduty[i].DutyList.length > 0){
								for(var k = 0; k < adminduty[i].DutyList.length; k++){
									if(weekArray[j] == adminduty[i].DutyList[k].dutyDay){
										scheduling = adminduty[i].DutyList[k];
										scheduling.dutyConfigList = adminduty[i].DutyList[k].dutyConfig.split(' / ');
									}
								}
							}
							if(i == 0){
								weektitle.push(title);
							}
							adminduty[i].weekScheduling.push(scheduling);
						}
					}
				}
				this.weektitle = weektitle;
				this.schedulinglist = adminduty;
			}
		})
	}

	getBookingList(urlOptions) {
		this.adminService.doctorbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				var weekBookingTitle = [];
				var doctorBookingList = [];
				// 当天日期
				var todayTime = new Date().getTime();
				if(results.list.length > 0){
					var weekArray = this.adminService.getWeekByNumber(this.weekNumBooking);
					for(var i = 0; i < results.list.length; i++){
						var doctorBooking = {
							doctorId: results.list[i].doctorId,
							doctorName: results.list[i].doctorName,
							avatarUrl: results.list[i].avatarUrl,
							bookingWeekList: [],
						}
						for(var j = 0; j < weekArray.length; j++){
							var title = {
								date: this.adminService.dateFormat(weekArray[j]),
								title: this.adminService.getWeekTitle(j)
							}
							var dayBooking = {
								date: this.adminService.dateFormat(weekArray[j]),
								bookingList: [],
								num: '',
								string: '',
								use: false,
							}
							// 日期是否过期
							if(todayTime - (24 * 60 * 60 * 1000) < (new Date(this.adminService.dateFormatHasWord(dayBooking.date)).getTime())){
								dayBooking.use = true;
							}
							if(results.list[i].serviceList.length > 0){
								for(var k = 0; k < results.list[i].serviceList.length; k++){
									//判断今天是否有预约
									if(weekArray[j] == results.list[i].serviceList[k].bookingDate){
										dayBooking.bookingList.push(results.list[i].serviceList[k]);
									}
								}
							}
							dayBooking.num = dayBooking.bookingList.length.toString();
							dayBooking.string = JSON.stringify(dayBooking.bookingList);
							doctorBooking.bookingWeekList.push(dayBooking);
							if(i == 0){
								weekBookingTitle.push(title);
							}
						}
						doctorBookingList.push(doctorBooking);
					}
				}
				this.hasDoctorBookingData = true;
				this.weekBookingTitle = weekBookingTitle;
				this.doctorBookingList = doctorBookingList;
			}
		})
	}

	prec() {
		this.weekNumConfig--;
		this.search();
	}

	now() {
		this.weekNumConfig = 0;
		this.search();
	}

	next() {
		this.weekNumConfig++;
		this.search();
	}

	precBooking() {
		this.weekNumBooking--;
		var urlOptions = this.url + '&weekindex=' + this.weekNumBooking;
		this.getBookingList(urlOptions);
	}

	nowBooking() {
		this.weekNumBooking = 0;
		var urlOptions = this.url + '&weekindex=' + this.weekNumBooking;
		this.getBookingList(urlOptions);
	}

	nextBooking() {
		this.weekNumBooking++;
		var urlOptions = this.url + '&weekindex=' + this.weekNumBooking;
		this.getBookingList(urlOptions);
	}

	close() {
		this.modalTab = false;
	}

	showBooking(day, booking, type) {
		this.doctorDutyList = [];
		this.selected = {
			doctor: booking.doctorName,
			tab: type == 'all' ? '1' : '2',
			type: type,
		};
		this.showBookinglist = JSON.parse(day.string);
		this.modalTab = true;

		// 获取排班信息
		var doctordutysUrl = this.url + '&doctor_id=' + booking.doctorId;
		this.adminService.doctordutys(doctordutysUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.doctors.length > 0){
					if(results.doctors[0].doctorDutys.length > 0){
						for(var i = 0; i < results.doctors[0].doctorDutys.length; i++){
							var dutylist = [];
							if(results.doctors[0].doctorDutys[i].timeList.length> 0){
								//给时间排序
								results.doctors[0].doctorDutys[i].timeList.sort(function(a,b){return Number(a.replace(':', '')) - Number(b.replace(':', ''))});
								for(var j = 0; j < results.doctors[0].doctorDutys[i].timeList.length; j++){
									var duty = {
										date: results.doctors[0].doctorDutys[i].timeList[j],
										use: '',
									}
									if(results.doctors[0].doctorDutys[i].selectedList.length){
										for(var k = 0; k < results.doctors[0].doctorDutys[i].selectedList.length; k++){
											if(results.doctors[0].doctorDutys[i].timeList[j] == results.doctors[0].doctorDutys[i].selectedList[k]){
												duty.use = '已预约';
											}
										}
									}
									dutylist.push(duty);
								}
							}
							results.doctors[0].doctorDutys[i].list = dutylist;
						}
					}
					this.doctorDutyList = results.doctors[0].doctorDutys;
				}
			}
		});
	}

	changeSelected(value) {
		this.selected.tab = value;
	}

	info(_id) {
		this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: _id}});
	}

	goBooking(booking, day) {
		// 判断日期是否过期
		if(day.use){
			// 判断该医生，当天是否排班，若无排班，则不可跳转
			var hasDuty = false;
			if(this.schedulinglist.length > 0){
				for(var i = 0; i < this.schedulinglist.length; i++){
					// 该医生
					if(this.schedulinglist[i].adminId == booking.doctorId){
						for(var j = 0; j < this.schedulinglist[i].weekScheduling.length; j++){
							// 该天
							if(this.schedulinglist[i].weekScheduling[j].dutyDay == this.adminService.dateFormatHasWord(day.date)){
								// 是否有排班
								if(this.schedulinglist[i].weekScheduling[j].dutyConfigList.length > 0){
									hasDuty = true;
								}
							}
						}
					}
				}
			}
			if(hasDuty){
				// 查找医生拥有的服务，并默认选择第一个
				var serviceId = '';
				if(this.doctorList.length > 0){
					for(var i = 0; i < this.doctorList.length; i++){
						if(booking.doctorId == this.doctorList[i].id){
							// 服务列表
							if(this.doctorList[i].serviceList.length > 0){
								serviceId = this.doctorList[i].serviceList[0].serviceId;
							}
						}
					}
				}
				if(serviceId == ''){
					this.modalConfirm = {
						text: booking.doctorName + '医生尚未分配服务，不可预约',
					}
					this.modalConfirmTab = true;
				}else{
					this.router.navigate(['./admin/booking'], {queryParams: {type: 'create', serviceId: serviceId, doctorId: booking.doctorId, date: day.date}});
				}
			}else{
				this.modalConfirm = {
					text: booking.doctorName + '医生' + day.date + '尚未排班，不可预约',
				}
				this.modalConfirmTab = true;
			}
		}
	}

	closeConfirm() {
		this.modalConfirmTab = false;
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
