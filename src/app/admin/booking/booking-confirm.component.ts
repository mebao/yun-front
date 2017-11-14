import { Component, OnInit }                from '@angular/core';
import { Router }                           from '@angular/router';

import { AdminService }                     from '../admin.service';

@Component({
	selector: 'app-booking-confirm',
	templateUrl: './booking-confirm.component.html'
})
export class BookingConfirmComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	url: string;
	weekNum: number;
	weektitle: any[];
	weeklist: any[];
	timelist: any[];
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
		refNo: string,
		serviceId: string,
		serviceName: string,
		status: string,
		statusText: string,
		time: string,
		type: string,
		userDoctorId: string,
		userDoctorName: string,
		editType: string,
		text: string,
	}
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	searchInfo: {
		doctor_id: string,
		service_id: string,
		mobile: string,
		creator_name: string,
	}
	doctorlist: any[];
	servicelist: any[];

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '预约金支付',
			back: false,
		}
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&status=1';
		this.weekNum = 0;

		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			mobile: '',
			creator_name: '',
		}

		this.modalConfirmTab = false;

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

		this.loadingShow = true;

		this.getDoctorList();
		this.getServiceList();
		this.getBooking();
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

	getBooking() {
		var urlOptions = this.getUrlOptios() + '&weekindex=' + this.weekNum;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var todayTime = new Date().getTime();
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
						//遍历返回结果，将预约信息添加进timeList
						for(var k = 0; k < weekbooks.length; k++){
							if(this.adminService.dateFormat(weekArray[i]) == weekbooks[k].bookingDate && week.timeList[j].key == weekbooks[k].time){
								weekbooks[k].servicesLength = weekbooks[k].services.length;
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
				this.loadingShow = false;
			}
		})
	}

	//查询
	search() {
		this.getBooking();
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

	//上一周
	prec() {
		this.weekNum--;
		this.getBooking();
	}

	//本周
	now() {
		this.weekNum = 0;
		this.getBooking();
	}

	//下一周
	next() {
		this.weekNum++;
		this.getBooking();
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

	selectorBookingCli(booking, type) {
		if(type == 'confirm'){
			this.router.navigate(['./admin/paymentBookingFee'], {queryParams: {id: booking.bookingId, type: 'bookingConfirm'}});
		}else{
			this.modalTab = false;
			this.selectorBooking = booking;
			this.selectorBooking.editType = type;
			this.selectorBooking.text = (type == 'confirm' ? '确认' : '删除') + this.selectorBooking.creatorName + '(' + this.selectorBooking.childName + ')的预约';
			this.modalConfirmTab = true;
		}
	}

	confirm() {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			status: '0',
		}
		this.adminService.updatebookstatus(this.selectorBooking.bookingId, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.modalConfirmTab = false;
				this.toastTab('删除成功', '');
				this.getBooking();
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
