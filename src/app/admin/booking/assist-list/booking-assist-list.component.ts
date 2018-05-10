import { Component }                   from '@angular/core';

import { NzMessageService }            from 'ng-zorro-antd';

import { AdminService }                from '../../admin.service';

@Component({
    selector: 'admin-booking-assist-list',
    templateUrl: './booking-assist-list.component.html',
	styles: [ `
		.ant-form-item-label label:after{
		    display: none;
		}
		.ant-form-item{
			margin-bottom: 0;
		}
	`
  	]
})

export class BookingAssistList{
    topBar: {
        title: string,
        back: boolean,
    };
    loadingShow: boolean;
    hasData: boolean;
    assistList: any[];
    bookingAssistList: any[];
    searchInfo: {
        assist_id: string,
        doctor_name: string,
        child_name: string,
    }
    _startDate = null;
    _endDate = null;
    url: string;

    constructor(
        private _message: NzMessageService,
        private adminService: AdminService,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '辅助治疗',
            back: false,
        }

        this.loadingShow = false;

        var todayDate = this.adminService.getDayByDate(new Date());
        this.searchInfo = {
            assist_id: '',
            doctor_name: '',
            child_name: '',
        }
        this._startDate = new Date();
        this._endDate = new Date();
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-bookingAssistList'));
        if(sessionSearch){
			this.searchInfo = {
                assist_id: sessionSearch.assist_id,
                doctor_name: sessionSearch.doctor_name,
                child_name: sessionSearch.child_name,
            }
            this._startDate = sessionSearch._startDate ? new Date(sessionSearch._startDate) : null;
            this._endDate = sessionSearch._endDate ? new Date(sessionSearch._endDate) : null;
		}

        this.hasData = false;
        this.assistList = [];
        this.bookingAssistList = [];

        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;

        var searchassistUrl = this.url + '&status=1'
        this.adminService.searchassist(searchassistUrl).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.assistList = results.list;
            }
        }).catch((data) => {
            this._message.error('服务器错误');
        });
        this.search();
    }

    getData(urlOptions) {
        this.adminService.bookingassist(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                var newList = [];
                if(results.list.length > 0){
                    for(var i = 0; i < results.list.length; i++){
                        results.list[i].bookingDate = this.adminService.dateFormat(results.list[i].bookingDate);
                        // 判断该bookingId是否已经存在
                        if(newList.length > 0){
                            var hasBoolean = false;
                            for(var j = 0; j < newList.length; j++){
                                if(results.list[i].bookingId == newList[j].bookingId){
                                    hasBoolean = true;
                                    newList[j].infoList.push(results.list[i]);
                                }
                            }
                            if(!hasBoolean){
                                newList.push({
                                    bookingId: results.list[i].bookingId,
                                    infoList: [results.list[i]],
                                });
                            }
                        }else{
                            newList.push({
                                bookingId: results.list[i].bookingId,
                                infoList: [results.list[i]],
                            });
                        }
                    }
                }
                this.bookingAssistList = newList;
                this.hasData = true;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    search() {
        this.loadingShow = true;
		sessionStorage.setItem('search-bookingAssistList', JSON.stringify({
            assist_id: this.searchInfo.assist_id,
            doctor_name: this.searchInfo.doctor_name,
            child_name: this.searchInfo.child_name,
            _startDate: this._startDate,
            _endDate: this._endDate,
        }));
        var urlOptions = this.url;
        if(this.searchInfo.assist_id && this.searchInfo.assist_id != ''){
            urlOptions += '&assist_id=' + this.searchInfo.assist_id;
        }
        if(this.searchInfo.doctor_name && this.searchInfo.doctor_name != ''){
            urlOptions += '&doctor_name=' + this.searchInfo.doctor_name;
        }
        if(this.searchInfo.child_name && this.searchInfo.child_name != ''){
            urlOptions += '&child_name=' + this.searchInfo.child_name;
        }
        if(this._startDate){
            urlOptions += '&bdate_big=' + this.adminService.getDayByDate(new Date(this._startDate));
        }
        if(this._endDate){
            urlOptions += '&bdate_less=' + this.adminService.getDayByDate(new Date(this._endDate));
        }
        this.getData(urlOptions);
    }

    _disabledStartDate = (startValue) => {
        if (!startValue || !this._endDate) {
            return false;
        }
        return startValue.getTime() > this._endDate.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this._startDate) {
            return false;
        }
        return endValue.getTime() < this._startDate.getTime();
    };

    //宝宝详情
    childInfo(_id) {
        window.open('./admin/child/info?id=' + _id);
    }
}
