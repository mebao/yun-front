import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute }        from '@angular/router';

import { AdminService }                  from '../admin.service';

@Component({
	selector: 'app-doctor-info',
	templateUrl: './doctor-info.component.html',
	styleUrls: ['./doctor-info.component.scss'],
})
export class DoctorInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	doctor_id: string;
	info: {
		doctorId: string;
        doctorName: string;
        clinicId: string;
        cTitle: string;
        aTitle: string;
        description: string;
        avatarUrl: string;
	};
	servicelist: any[];
	dutylist: any[];
	stopCondition: boolean;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;
	hasDoctor: boolean;
	selectedTab: string;
	url: string;
	bookingList: any[];

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '医生服务及排班信息',
			back: true,
		}

		this.loadingShow = true;

		this.stopCondition = false;
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasData = false;
		this.selectedTab = '1';
		this.bookingList = [];

		this.info = {
			doctorId: '',
	        doctorName: '',
	        clinicId: '',
	        cTitle: '',
	        aTitle: '',
	        description: '',
	        avatarUrl: '',
		};

		this.route.queryParams.subscribe((params) => {
			this.doctor_id = params['id'];
		});
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		var urlOptions = this.url + '&doctor_id=' + this.doctor_id;
		this.adminService.doctordutys(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.doctors.length > 0){
					this.hasDoctor = true;
					this.info = {
						doctorId: results.doctors[0].doctorId,
				        doctorName: results.doctors[0].doctorName,
				        clinicId: results.doctors[0].clinicId,
				        cTitle: results.doctors[0].cTitle,
				        aTitle: results.doctors[0].aTitle,
				        description: results.doctors[0].description,
				        avatarUrl: results.doctors[0].avatarUrl,
					};
					this.servicelist = results.doctors[0].doctorServices;
					if(results.doctors[0].doctorDutys.length > 0){
						for(var i = 0; i < results.doctors[0].doctorDutys.length; i++){
							var dutylist = [];
								if(results.doctors[0].doctorDutys[i].timeList.length> 0){
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
					this.dutylist = results.doctors[0].doctorDutys;
				}else{
					this.hasDoctor = false;
				}
				this.hasData = true;
				this.loadingShow = false;
			}
		});

		// 本周预约
		var bookingUrl = this.url + '&doctorId=' + this.doctor_id + '&weekindex=0';
		this.adminService.doctorbooking(bookingUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				var weekDayList = this.adminService.getWeekByNumber(0);
				if(results.list.length > 0){
					if(results.list[0].serviceList.length > 0){
						for(var i = 0; i < weekDayList.length; i++){
							var booking = {
								week: this.adminService.getWeekTitle(i),
								day: weekDayList[i],
								booking: [],
							}
							for(var j = 0; j < results.list[0].serviceList.length; j++){
								if(weekDayList[i] == results.list[0].serviceList[j].bookingDate){
									booking.booking.push(results.list[0].serviceList[j]);
								}
							}
							this.bookingList.push(booking);
						}
					}
				}
			}
		});
	}

	changeSelected(_tab) {
		this.selectedTab = _tab;
	}

	goInfo(_id) {
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
