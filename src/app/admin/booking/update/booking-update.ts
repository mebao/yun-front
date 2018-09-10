import { Component, OnInit }          from '@angular/core';
import { Router }                     from '@angular/router';

import { NzMessageService }           from 'ng-zorro-antd';

import { AdminService }               from '../../admin.service';

@Component({
    selector: 'admin-booking-update',
    templateUrl: './booking-update.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class BookingUpdate implements OnInit{
    topBar: {
        title: string,
        back: boolean,
    };
    url: string;
    loadingShow: boolean;
    bookingList: any[];
    searchInfo: {
        child: string,
        service: string,
        doctor: string,
        status: string,
        date_big: Date,
        date_less: Date,
    }
    childList: any[];
    doctorList: any[];
    serviceList: any[];
    statusList: any[];

    constructor(
        private _message: NzMessageService,
        private as: AdminService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '预约修改',
            back: false,
        }
        this.url = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;

        this.loadingShow = false;
        this.bookingList = [];
        this.searchInfo = {
            child: '',
            service: '',
            doctor: '',
            status: '',
            date_big: new Date(),
            date_less: new Date(),
        }
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-bookingUpdate'));
        if(sessionSearch){
			this.searchInfo = {
                child: sessionSearch.child,
                service: sessionSearch.service,
                doctor: sessionSearch.doctor,
                status: sessionSearch.status,
                date_big: sessionSearch.date_big ? new Date(sessionSearch.date_big) : null,
                date_less: sessionSearch.date_less ? new Date(sessionSearch.date_less) : null,
            }
		}

        this.childList = [];
        this.getChildList();
        this.doctorList = [];
        this.getDoctorList();
        this.serviceList = [];
        this.getServiceList();
        this.statusList = [
            {id: '1', text: '待支付预约金'},
            {id: '2', text: '已支付预约金'},
            {id: '3', text: '已登记'},
            {id: '4', text: '就诊中'},
            {id: '11', text: '就诊结束'},
            {id: '5', text: '已完成'},
        ]

        this.search();
    }

    search() {
        this.loadingShow = true;
        var urlOptions = this.url;
		sessionStorage.setItem('search-bookingUpdate', JSON.stringify(this.searchInfo));
        if(this.searchInfo.child && this.searchInfo.child != ''){
            urlOptions += '&child_id=' + this.searchInfo.child;
        }
        if(this.searchInfo.service && this.searchInfo.service != ''){
            urlOptions += '&service_id=' + this.searchInfo.service;
        }
        if(this.searchInfo.doctor && this.searchInfo.doctor != ''){
            urlOptions += '&doctor_id=' + this.searchInfo.doctor;
        }
        if(this.searchInfo.date_big){
            urlOptions += '&bdate_big=' + this.as.getDayByDate(new Date(this.searchInfo.date_big));
        }
        if(this.searchInfo.date_less){
            urlOptions += '&bdate_less=' + this.as.getDayByDate(new Date(this.searchInfo.date_less));
        }
        if(this.searchInfo.status && this.searchInfo.status != ''){
            urlOptions += '&status=' + this.searchInfo.status;
        }
        this.getData(urlOptions);
    }

    _disabledStartDate = (startValue) => {
        if (!startValue || !this.searchInfo.date_less) {
            return false;
        }
        return startValue.getTime() > this.searchInfo.date_less.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this.searchInfo.date_big) {
            return false;
        }
        return endValue.getTime() < this.searchInfo.date_big.getTime();
    };

    getData(urlOptions) {
        this.as.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                this.loadingShow = false;
                var results = JSON.parse(JSON.stringify(data.results));
                this.bookingList = results.weekbooks;
            }
        }).catch((data) => {
            this.loadingShow = false;
            this._message.error(`服务器错误`);
        });
    }

    getChildList() {
        this.as.searchchild(this.url).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.childList = results.child;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    getDoctorList() {
        var urlOptions = this.url + '&role=2';
        this.as.adminlist(urlOptions).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.doctorList = results.adminlist;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    getServiceList() {
        this.as.servicelist(this.url + '&status=1').then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.serviceList = results.servicelist;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    info(booking) {
        this.router.navigate(['./admin/bookingUpdateInfo'], {queryParams: {id: booking.bookingId}});
    }
}
