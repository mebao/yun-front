import { Component }                          from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
    selector: 'admin-booking-history',
    templateUrl: 'booking-history.component.html',
})

export class BookingHistoryComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    url: string;
    bookingList: any[];
    hasData: boolean;
    childId: string;
    searchInfo: {
        doctor_id: string,
        service_id: string,
        bdate_big: string,
        bdate_less: string,
    }
    doctorList: any[];
    serviceList: any[];

    constructor(
        public adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

	ngOnInit(): void {
		this.topBar = {
			title: '预约记录',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

        this.bookingList = [];
        this.hasData = false;
        this.route.queryParams.subscribe((params) => {
            this.childId = params.childId;
        });
        this.searchInfo = {
            doctor_id: '',
            service_id: '',
            bdate_big: '',
            bdate_less: '',
        }

        // 根据childId获取booking列表
        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&child_id=' + this.childId;

        this.search();

        // 获取医生列表
        this.doctorList = [];
		var adminlistUrl = this.url + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorList = results.adminlist;
				this.doctorList.unshift({id: '', realName: '请选择医生'});
			}
		})

        // 获取科室列表
        this.serviceList = [];
		this.adminService.clinicservices(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.serviceList = results.servicelist;
				this.serviceList.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择服务'});
			}
		})
    }

    search() {
        var urlOptions = this.url;
        if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
            urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
        }
        if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
            urlOptions += '&service_id=' + this.searchInfo.service_id;
        }
        if(this.searchInfo.bdate_big && this.searchInfo.bdate_big != ''){
            urlOptions += '&bdate_big=' + this.searchInfo.bdate_big;
        }
        if(this.searchInfo.bdate_less && this.searchInfo.bdate_less != ''){
            urlOptions += '&bdate_less=' + this.searchInfo.bdate_less;
        }
        this.getData(urlOptions);
    }

    getData(urlOptions) {
        this.adminService.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.bookingList = results.weekbooks;
                this.hasData = true;
            }
        });
    }

    // 就诊记录
    doctorBookingHistory(booking) {
		//重置详情选中模块
		sessionStorage.setItem('doctorBookingTab', '3');
        this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: booking.bookingId, doctorId: booking.services[0].userDoctorId, pageType: 'history'}});
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