import { Component } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

@Component({
    selector: 'admin-booking-assist-list',
    templateUrl: './booking-assist-list.component.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class BookingAssistList {
    topBar: {
        title: string,
        back: boolean,
        alert: {
            type: string,
            text: string,
        }
    };
    // 权限
    moduleAuthority: {
        see: boolean,
        confirm: boolean,
        confirmOut: boolean,
        back: boolean,
    }
    loadingShow: boolean;
    hasData: boolean;
    assistList: any[];
    bookingAssistList: any[];
    searchInfo: {
        assist_id: string,
        doctor_name: string,
        child_name: string,
        is_finish: string,
    }
    _startDate = null;
    _endDate = null;
    url: string;
    // 完成次数
    modalFinishTab: boolean;
    selectedInfo: {
        assist: any,
        finishNum: string,
    }
    // 确认出库
    modalConfirmTab: boolean;
    confirmInfo: {
        text: string,
        medical: any,
    }
    asssitMList: any[];
    searchInfoM: {
        startDate: Date,
        endDate: Date,
    }
    // 退返
    backInfo: {
        showTab: boolean,
        assist: any,
        back_num: string,
        pay_way: string,
        back_amount: string,
        remark: string,
    }
    paywayList: any[];
    // 详情
    modalInfoTab: boolean;

    constructor(
        private _message: NzMessageService,
        private adminService: AdminService,
    ) { }

    ngOnInit() {
        this.topBar = {
            title: '辅助治疗',
            back: false,
            alert: {
                type: 'warning',
                text: '辅助治疗药品需前往手动出库管理中出库',
            }
        }

        //权限
        this.moduleAuthority = {
            see: false,
            confirm: false,
            confirmOut: false,
            back: false,
        }
        // 那段角色，是超级管理员0还是普通角色
        // 如果是超级管理员，获取所有权限
        if (this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9') {
            for (var key in this.moduleAuthority) {
                this.moduleAuthority[key] = true;
            }
        } else {
            var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
            for (var i = 0; i < authority.infos.length; i++) {
                this.moduleAuthority[authority.infos[i].keyName] = true;
            }
        }

        this.loadingShow = false;

        var todayDate = this.adminService.getDayByDate(new Date());
        this.searchInfo = {
            assist_id: '',
            doctor_name: '',
            child_name: '',
            is_finish: '0',
        }
        this._startDate = new Date();
        this._endDate = new Date();
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-bookingAssistList'));
        if (sessionSearch) {
            this.searchInfo = {
                assist_id: sessionSearch.assist_id,
                doctor_name: sessionSearch.doctor_name,
                child_name: sessionSearch.child_name,
                is_finish: sessionSearch.is_finish,
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
        this.modalFinishTab = false;
        this.selectedInfo = {
            assist: {},
            finishNum: '',
        }
        this.modalConfirmTab = false;
        this.confirmInfo = {
            text: '',
            medical: {},
        }

        var searchassistUrl = this.url + '&status=1'
        this.adminService.searchassist(searchassistUrl).then((data) => {
            if (data.status == 'no') {
                this._message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                this.assistList = results.list;
            }
        }).catch((data) => {
            this._message.error('服务器错误');
        });
        this.search();
        this.asssitMList = [];
        this.searchInfoM = {
            startDate: null,
            endDate: null,
        }

        this.backInfo = {
            showTab: false,
            assist: {},
            back_num: '',
            pay_way: '',
            back_amount: '',
            remark: '',
        }

        // 获取支付方式
        this.paywayList = [];
        var clinicdata = sessionStorage.getItem('clinicdata');
        if (clinicdata && clinicdata != '') {
            this.getPaywayList(JSON.parse(clinicdata));
        } else {
            this.adminService.clinicdata().then((data) => {
                if (data.status == 'no') {
                    this._message.error(data.errorMsg);
                } else {
                    var results = JSON.parse(JSON.stringify(data.results));
                    this.getPaywayList(results);
                }
            }).catch(() => {
                this._message.error('服务器错误');
            });
        }

        this.modalInfoTab = false;
    }

    getData(urlOptions) {
        this.adminService.bookingassist(urlOptions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                this.bookingAssistList = results.list;
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
        if (this.searchInfo.assist_id && this.searchInfo.assist_id != '') {
            urlOptions += '&assist_id=' + this.searchInfo.assist_id;
        }
        if (this.searchInfo.doctor_name && this.searchInfo.doctor_name != '') {
            urlOptions += '&doctor_name=' + this.searchInfo.doctor_name;
        }
        if (this.searchInfo.child_name && this.searchInfo.child_name != '') {
            urlOptions += '&child_name=' + this.searchInfo.child_name;
        }
        if (this.searchInfo.is_finish && this.searchInfo.is_finish != '') {
            urlOptions += '&is_finish=' + this.searchInfo.is_finish;
        }
        if (this._startDate) {
            urlOptions += '&bdate_big=' + this.adminService.getDayByDate(new Date(this._startDate));
        }
        if (this._endDate) {
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

    getPaywayList(clinicdata) {
        if (clinicdata == 'error') {
            this._message.error('服务器错误');
        } else {
            var list = [];
            for (var payway in clinicdata.payWays) {
                if (payway != 'guazhang') {
                    var item = {
                        key: payway,
                        value: clinicdata.payWays[payway],
                    }
                    list.push(item);
                }
            }
            this.paywayList = list;
        }
    }

    //宝宝详情
    childInfo(_id) {
        window.open('./admin/child/info?id=' + _id);
    }

    finish(info) {
        this.selectedInfo = {
            assist: info,
            finishNum: '',
        }
        this.modalFinishTab = true;
    }

    closeFinish() {
        this.modalFinishTab = false;
    }

    finishAssist() {
        // 完成辅助治疗
        if(this.selectedInfo.finishNum == ''){
            this._message.error('完成次数不可为空');
            return;
        }
        if(Number(this.selectedInfo.finishNum) < 0){
            this._message.error('完成次数不可为0');
            return;
        }
        if(Number(this.selectedInfo.finishNum) > this.selectedInfo.assist.unFinishNum){
            this._message.error('完成次数不可超过未完成次数');
            return;
        }
        this.modalFinishTab = false;
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            id: this.selectedInfo.assist.id,
            finish_num: this.selectedInfo.finishNum.toString(),
        }
        this.adminService.finishassist(this.selectedInfo.assist.id, params).then((data) => {
            if (data.status == 'no') {
                this._message.error(data.errorMsg);
            } else {
                this.search();
                this._message.success('完成成功');
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    searchMList() {
        var urlOptions = this.url;
        this.getDataMedical(urlOptions);
    }

    getDataMedical(urlOptions) {
        this.loadingShow = true;
        this.adminService.countassist(urlOptions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                this.asssitMList = results.list;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    _disabledStartDateM = (startValue) => {
        if (!startValue || !this.searchInfoM.endDate) {
            return false;
        }
        return startValue.getTime() > this.searchInfoM.endDate.getTime();
    };

    _disabledEndDateM = (endValue) => {
        if (!endValue || !this.searchInfoM.startDate) {
            return false;
        }
        return endValue.getTime() < this.searchInfoM.startDate.getTime();
    };

    confirmOut(info) {
        this.confirmInfo = {
            text: `确认-${info.name}-（${info.num}${info.unit}）完成出库`,
            medical: info,
        }
        this.modalConfirmTab = true;
    }
    
    closeConfirm() {
        this.modalConfirmTab = false;
        this.confirmInfo = {
            text: '',
            medical: {},
        }
    }

    confirm() {
        this.modalFinishTab = false;
        // 药品完成出库操作
        var outParams = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            bdate_big: this.searchInfoM.startDate ? this.adminService.getDayByDate(new Date(this.searchInfoM.startDate)) : null,
            bdate_less: this.searchInfoM.endDate ? this.adminService.getDayByDate(new Date(this.searchInfoM.endDate)) : null
        }
        this.adminService.outassistdrug(this.confirmInfo.medical.durgId, outParams).then((data) => {
            if (data.status == 'no') {
                this._message.error(data.errorMsg);
            } else {
                this._message.success('完成成功');
                this.searchMList();
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    back(assist) {
        this.backInfo = {
            showTab: true,
            assist: assist,
            back_num: '',
            pay_way: '',
            back_amount: '',
            remark: '',
        }
    }

    closeBack() {
        this.backInfo = {
            showTab: false,
            assist: {},
            back_num: '',
            pay_way: null,
            back_amount: '',
            remark: '',
        }
    }

    changeBackNum() {
        this.backInfo.back_amount = ((Number(this.backInfo.back_num) * this.adminService.stopl(this.backInfo.assist.price, 2)) / 100).toString();
    }

    confirmBack() {
        if (this.backInfo.back_num == '') {
            this._message.error('退还次数不可为空');
            return;
        }
        if(Number(this.backInfo.back_num) > Number(this.backInfo.assist.number)){
            this._message.error('退还次数不可大于原有次数');
            return;
        }
        if (this.backInfo.pay_way == '') {
            this._message.error('退款方式不可为空');
            return;
        }
        if (this.backInfo.back_amount == '') {
            this._message.error('退款金额不可为空');
            return;
        }
        if (this.backInfo.remark.trim() == '') {
            this._message.error('退还原因不可为空');
            return;
        }

        this.loadingShow = true;
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            id: this.backInfo.assist.id,
            back_num: this.backInfo.back_num.toString(),
            pay_way: this.backInfo.pay_way,
            back_amount: this.backInfo.back_amount,
            remark: this.backInfo.remark.trim(),
        }

        this.adminService.backassist(this.backInfo.assist.id, params).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            } else {
                this.loadingShow = false;
                this._message.success('退返成功');
                this.closeBack();
                this.search();
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    showInfo(assist) {
        this.selectedInfo = {
            assist: assist,
            finishNum: '',
        }
        this.modalInfoTab = true;
    }

    closeInfo() {
        this.selectedInfo = {
            assist: {},
            finishNum: '',
        }
        this.modalInfoTab = false;
    }
}
