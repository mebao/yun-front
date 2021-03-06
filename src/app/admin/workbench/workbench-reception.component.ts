import { Component, OnInit, HostBinding }             from '@angular/core';
import { Router, ActivatedRoute }                     from '@angular/router';

import { NzMessageService }                           from 'ng-zorro-antd';

// import { slideInDownAnimation }                       from '../../animations';
import { AdminService }                               from '../admin.service';
import { NewService }                                 from '../new.service';

import { ENgxPrintComponent }          				  from "e-ngx-print";

@Component({
	selector: 'app-scheduling',
	templateUrl: './workbench-reception.component.html',
	styleUrls: ['./workbench-reception.component.scss', '../../../assets/css/ant-common.scss'],
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
	// 权限
	moduleAuthority: {
		workerPanel: boolean,
        seePhone: boolean,
    }
	loadingShow: boolean;
	weektitle: any[];
	schedulinglist: any[];
	weekNumConfig: number;
	url: string;
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
		type: string,
		doctorService: any[],
	}
	modalConfirmTab: boolean;
	modalConfirm: {
		text: string,
	}
	hasDutyData: boolean;
	printStyle: string;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		public newService: NewService,
		private router: Router,
	) {
		this.printStyle =
	        `
			body{
				margin:0px;
				font-size:16px;
				font-family:"黑体";
				color:#333;
			}
	        .img{
	            height:20px;
				margin-top: 10px;
	        }
			#print_div_workbench{
				width:400px;
				line-height:2em;
			}
			.print-container{
				padding:13px 20px;
				page-break-before: always;
			}
			.flex{
				display:flex;
			}
			.flex-1{
				flex:1;
			}
			.font-bold{
				color:#000;
			}
	        `;
	}

	ngOnInit(): void{
		// this.newService.getData().subscribe((data: any) => {
		// 	console.log(data);
    	// });
		this.topBar = {
			title: '前台工作台',
			back: false,
        }
        
		// 权限
		this.moduleAuthority = {
            workerPanel: false,
            seePhone: false,
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
        
		this.loadingShow = false;
		this.schedulinglist = [];

		this.hasDoctorBookingData = false;
		this.doctorBookingList = [];
		this.modalTab = false;
		this.showBookinglist = [];
		this.searchInfo = {
			doctor: '',
			service: '',
		}

		this.weekNumConfig = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

	 	//获取医生列表
	 	this.doctorList = [];
	 	var adminlistUrl = this.url + '&role=2';
	 	this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorList = results.adminlist;
			}
		}).catch((err) => {
			this._message.error('服务器错误');
		});

		//获取科室列表
		this.serviceList = [];
		this.adminService.servicelist(this.url + '&status=1').then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.serviceList = results.servicelist;
			}
		}).catch((err) => {
			this._message.error('服务器错误');
		});

		this.doctorDutyList = [];
		this.selected = {
			doctor: '',
			type: '',
			doctorService: [],
		};
		this.modalConfirmTab = false;
		this.modalConfirm = {
			text: '',
		}

		this.search();
		this.hasDutyData = false;
	}

	search() {
		this.loadingShow = true;
		var dutyUrl = this.url + '&weekindex=' + this.weekNumConfig;
		var bookingUrl = this.url + '&weekindex=' + this.weekNumConfig;
		if(this.searchInfo.doctor && this.searchInfo.doctor != ''){
			dutyUrl += '&doctor_id=' + this.searchInfo.doctor['id'];
			bookingUrl += '&doctorId=' + this.searchInfo.doctor['id'];
		}
		if(this.searchInfo.service && this.searchInfo.service != ''){
			dutyUrl += '&service_id=' + this.searchInfo.service['serviceId'];
			bookingUrl += '&service_id=' + this.searchInfo.service['serviceId'];
		}
		this.getList(dutyUrl);
		this.getBookingList(bookingUrl);
	}

	getList(urlOptions) {
		this.adminService.adminduty(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
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
				this.loadingShow = false;
			}
		}).catch((err) => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	getBookingList(urlOptions) {
		this.adminService.doctorbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				var weekBookingTitle = [];
				var doctorBookingList = [];
				// 当天日期
				var todayTime = new Date().getTime();
				if(results.list.length > 0){
					var weekArray = this.adminService.getWeekByNumber(this.weekNumConfig);
					for(var i = 0; i < results.list.length; i++){
						var doctorBooking = {
							doctorId: results.list[i].doctorId,
							doctorName: results.list[i].doctorName,
							avatarUrl: results.list[i].avatarUrl,
							bookingWeekList: [],
							doctorService: results.list[i].doctorService,
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
		}).catch((err) => {
			this._message.error('服务器错误');
		});
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

	close() {
		this.modalTab = false;
	}

	showBooking(day, booking, type) {
		this.hasDutyData = false;
		this.doctorDutyList = [];
		this.selected = {
			doctor: booking.doctorName,
			type: type,
			doctorService: booking.doctorService,
		};
		this.showBookinglist = JSON.parse(day.string);
		for(var i=0;i<this.showBookinglist.length;i++){
			for(var j = 0; j < this.showBookinglist[i].actCards.length; j++){
				if(this.showBookinglist[i].actCards[j].activityName.indexOf('推拿') != '-1'){
					this.showBookinglist[i].tuina = this.showBookinglist[i].actCards[j].num;
				}
			}
		}
		this.modalTab = true;

		// 获取排班信息，如果日期为过期日期，查看排班则为当天排班，否则为未来排班
		var doctordutysUrl = '';
		if(day.use){
			doctordutysUrl = this.url + '&doctor_id=' + booking.doctorId;
			this.adminService.doctordutys(doctordutysUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.structureDuty(results);
				}
			}).catch((err) => {
				this._message.error('服务器错误');
			});
		}else{
			doctordutysUrl = this.url + '&doctor_id=' + booking.doctorId + '&duty_date=' + this.adminService.dateFormatHasWord(day.date);
			this.adminService.doctordaydutys(doctordutysUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.structureDuty(results);
				}
			}).catch((err) => {
				this._message.error('服务器错误');
			});
		}
	}

	printComplete(){

	}

	// 构造排班信息
	structureDuty(results) {
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
		this.hasDutyData = true;
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
				// 查找医生拥有的科室，并默认选择第一个
				var serviceId = '';
				if(this.doctorList.length > 0){
					for(var i = 0; i < this.doctorList.length; i++){
						if(booking.doctorId == this.doctorList[i].id){
							// 科室列表
							if(this.doctorList[i].serviceList.length > 0){
								serviceId = this.doctorList[i].serviceList[0].serviceId;
							}
						}
					}
				}
				if(serviceId == ''){
					this.modalConfirm = {
						text: booking.doctorName + '医生尚未分配科室，不可预约',
					}
					this.modalConfirmTab = true;
				}else{
					this.router.navigate(['./admin/booking'], {queryParams: {type: 'createScheduling', serviceId: serviceId, doctorId: booking.doctorId, date: this.adminService.dateFormatHasWord(day.date)}});
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
}
