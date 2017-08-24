import { Component }                          from '@angular/core';
import { Router }                             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-booking-charge',
	templateUrl: './booking-charge.component.html',
	styleUrls: ['./booking-charge.component.scss'],
})
export class BookingChargeComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	url: string;
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
			title: '收费列表',
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

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		this.getList(this.url + '&clinic_id=' + this.adminService.getUser().clinicId);
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
	getList(urlOptions) {
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
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
						results.weekbooks[i].allFee = allFee;
					}
				}
				this.bookinglist = results.weekbooks;
				this.hasData = true;
			}
		})
	}
	
	//查询
	search() {
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
		this.getList(urlOptionsList);
	}

	//查看
	info(booking){//可编辑日期
		this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: booking.bookingId, doctorId: booking.services.length > 0 ? booking.services[0].userDoctorId : ''}});
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