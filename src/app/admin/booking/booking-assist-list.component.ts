import { Component }                   from '@angular/core';

import { AdminService }                from '../admin.service';

import { ToastService }                from '../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }      from '../../common/nll-toast/toast-model';

@Component({
    selector: 'admin-booking-assist-list',
    templateUrl: './booking-assist-list.component.html',
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
    info: {
        assist_id: string,
        doctor_name: string,
        child_name: string,
        bdate_big: string,
        bdate_big_num: number,
        bdate_big_text: string,
        bdate_less: string,
        bdate_less_num: number,
        bdate_less_text: string,
    }
    url: string;

    constructor(
        private adminService: AdminService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '辅助治疗',
            back: false,
        }

        this.loadingShow = true;

        var todayDate = this.adminService.getDayByDate(new Date());
        this.info = {
            assist_id: '',
            doctor_name: '',
            child_name: '',
            bdate_big: todayDate,
            bdate_big_text: this.adminService.dateFormat(todayDate),
            bdate_big_num: new Date(todayDate).getTime(),
            bdate_less: todayDate,
            bdate_less_text: this.adminService.dateFormat(todayDate),
            bdate_less_num: new Date(todayDate).getTime(),
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
                this.loadingShow = false;
        		const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
        		this.toastService.toast(toastCfg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.assistList = results.list;
                this.loadingShow = false;
            }
        }).catch((data) => {
    		const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
    		this.toastService.toast(toastCfg);
        });
        this.search();
    }

    getData(urlOptions) {
        this.adminService.bookingassist(urlOptions).then((data) => {
            if(data.status == 'no'){
                const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
                this.toastService.toast(toastCfg);
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
            }
        });
    }

    // 选择日期
    changeDate(_value, key) {
        this.info[key] = JSON.parse(_value).value;
        this.info[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
    }

    search() {
        var urlOptions = this.url;
        if(this.info.assist_id != ''){
            urlOptions += '&assist_id=' + this.info.assist_id;
        }
        if(this.info.doctor_name != ''){
            urlOptions += '&doctor_name=' + this.info.doctor_name;
        }
        if(this.info.child_name != ''){
            urlOptions += '&child_name=' + this.info.child_name;
        }
        if(this.info.bdate_big != ''){
            urlOptions += '&bdate_big=' + this.info.bdate_big;
        }
        if(this.info.bdate_less != ''){
            urlOptions += '&bdate_less=' + this.info.bdate_less;
        }
        this.getData(urlOptions);
    }

    //宝宝详情
    childInfo(_id) {
        window.open('./admin/childInfo?id=' + _id);
    }
}
