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
	doctorBookingList: any[];
	weekBookingTitle: any[];
	modalTab: boolean;
	showBookinglist: any[];

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
		this.doctorBookingList = [];
		this.modalTab = false;
		this.showBookinglist = [];

		this.weekNumConfig = 0;
		this.weekNumBooking = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		var urlOptions = this.url + '&weekindex=' + this.weekNumConfig;
		this.getList(urlOptions);

		var bookingListUrl = this.url + '&weekindex=' + this.weekNumBooking;
		this.getBookingList(bookingListUrl);
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
								date: weekArray[j],
								title: this.adminService.getWeekTitle(j)
							}
							var scheduling = {
								dutyConfigList: [],
								dutyDay: weekArray[j],
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
				if(results.list.length > 0){
					var weekArray = this.adminService.getWeekByNumber(this.weekNumBooking);
					var weekBookingTitle = [];
					this.doctorBookingList = [];
					for(var i = 0; i < results.list.length; i++){
						var doctorBooking = {
							doctorId: results.list[i].doctorId,
							doctorName: results.list[i].doctorName,
							avatarUrl: results.list[i].avatarUrl,
							bookingWeekList: [],
						}
						for(var j = 0; j < weekArray.length; j++){
							var title = {
								date: weekArray[j],
								title: this.adminService.getWeekTitle(j)
							}
							var dayBooking = {
								date: weekArray[j],
								bookingList: [],
								num: '',
								string: '',
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
						this.doctorBookingList.push(doctorBooking);
					}
					this.weekBookingTitle = weekBookingTitle;
				}
			}
		})
	}

	prec() {
		this.weekNumConfig--;
		var urlOptions = this.url + '&weekindex=' + this.weekNumConfig;
		this.getList(urlOptions);
	}

	now() {
		this.weekNumConfig = 0;
		var urlOptions = this.url + '&weekindex=' + this.weekNumConfig;
		this.getList(urlOptions);
	}

	next() {
		this.weekNumConfig++;
		var urlOptions = this.url + '&weekindex=' + this.weekNumConfig;
		this.getList(urlOptions);
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

	showBooking(day) {
		this.showBookinglist = JSON.parse(day.string);
		this.modalTab = true;
	}

	info(_id) {
		this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: _id}});
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
