import { Component }                          from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../../admin.service';

@Component({
    selector: 'admin-booking-history',
    templateUrl: 'booking-history.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class BookingHistoryComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
    url: string;
    bookingList: any[];
    hasData: boolean;
    childId: string;
    searchInfo: {
        doctor_id: string,
        service_id: string,
        bdate_big: Date,
        bdate_less: Date,
    }
    doctorList: any[];
    serviceList: any[];

    constructor(
        private _message: NzMessageService,
        public adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

	ngOnInit(): void {
		this.topBar = {
			title: '预约记录',
			back: true,
		}

        this.bookingList = [];
        this.hasData = false;
        this.route.queryParams.subscribe((params) => {
            this.childId = params.childId;
        });
        this.searchInfo = {
            doctor_id: '',
            service_id: '',
            bdate_big: new Date(),
            bdate_less: new Date(),
        }

		this.loadingShow = true;

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
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorList = results.adminlist;
				// this.doctorList.unshift({id: '', realName: '请选择医生'});
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });

        // 获取科室列表
        this.serviceList = [];
		this.adminService.servicelist(this.url + '&status=1').then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.serviceList = results.servicelist;
				// this.serviceList.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择科室'});
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
    }

    search() {
        var urlOptions = this.url;
        if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
            urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
        }
        if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
            urlOptions += '&service_id=' + this.searchInfo.service_id;
        }
        if(this.searchInfo.bdate_big){
            urlOptions += '&bdate_big=' + this.adminService.getDayByDate(new Date(this.searchInfo.bdate_big));
        }
        if(this.searchInfo.bdate_less){
            urlOptions += '&bdate_less=' + this.adminService.getDayByDate(new Date(this.searchInfo.bdate_less));
        }
        this.getData(urlOptions);
    }

    getData(urlOptions) {
        this.adminService.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.bookingList = results.weekbooks;
                this.hasData = true;
	            this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    _disabledStartDate = (startValue) => {
        if (!startValue || !this.searchInfo.bdate_less) {
            return false;
        }
        return startValue.getTime() > this.searchInfo.bdate_less.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this.searchInfo.bdate_big) {
            return false;
        }
        return endValue.getTime() < this.searchInfo.bdate_big.getTime();
    };

    // 就诊记录
    doctorBookingHistory(booking) {
		//重置详情选中模块
		sessionStorage.setItem('doctorBookingTab', '3');
        this.router.navigate(['./admin/docbooking'], {queryParams: {id: booking.bookingId, doctorId: booking.services[0].userDoctorId, pageType: 'history'}});
    }
}
