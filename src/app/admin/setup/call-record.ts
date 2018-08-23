import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../admin.service';

@Component({
    selector: 'admin-call-record',
    templateUrl: 'call-record.html',
    styleUrls: ['../../../assets/css/ant-common.scss']
})

export class CallRecord {
    topBar: {
        title: string,
        back: boolean,
    };
    // 权限
    moduleAuthority: {
        see: boolean,
    }
    loadingShow: boolean;
    callRecordList: any[];
    hasData: boolean;
    url: string;
    searchInfo: {
        name: string,
        date_big: Date,
        date_less: Date,
    }
    modalTab: boolean;
    fileUrl: string;
    @ViewChild('fileDom') fileEle: ElementRef;

    constructor(
        private _message: NzMessageService,
        public adminService: AdminService,
        private router: Router,
        private elementRef: ElementRef,
    ) { }

    ngOnInit() {
        this.topBar = {
            title: '通话记录',
            back: false,
        }

        this.moduleAuthority = {
            see: false,
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

        this.callRecordList = [];
        this.hasData = false;

        if (JSON.parse(sessionStorage.getItem('search-callRecordList'))) {
            this.searchInfo = JSON.parse(sessionStorage.getItem('search-callRecordList'));
        } else {
            this.searchInfo = {
                name: '',
                date_big: new Date(),
                date_less: new Date(),
            }
        }

        this.url = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&clinic_id=' + this.adminService.getUser().clinicId;
        this.modalTab = false;
        this.fileUrl = '';

        this.search();
    }

    search() {
        this.loadingShow = true;
        sessionStorage.setItem('search-callRecordList', JSON.stringify(this.searchInfo));
        var urlOptions = this.url;
        if (this.searchInfo.name != '') {
            urlOptions += '&name=' + this.searchInfo.name;
        }
        if (this.searchInfo.date_big) {
            urlOptions += '&date_big=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_big));
        }
        if (this.searchInfo.date_less) {
            urlOptions += '&date_less=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_less));
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

    getData(urlOpltions) {
        this.adminService.searchcall(urlOpltions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                this.callRecordList = results.list;
                this.hasData = true;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    callfile(callRecord) {
        this.loadingShow = true;
        var urlOptions = this.url + '&mobile=' + callRecord.mobile
            + '&callSid=' + callRecord.callSid;

        this.adminService.callfile(urlOptions).then((data) => {
            this.loadingShow = false;
            if (data.status == 'no') {
                this._message.error(data.errorMsg);
            } else {
                this.fileUrl = JSON.parse(JSON.stringify(data.results)).fileUrl;
                if (this.fileUrl == '') {
                    this._message.error('暂无电话录音');
                } else {
                    this.modalTab = true;
                    this.fileUrl = JSON.parse(JSON.stringify(data.results)).fileUrl;
                    this.fileEle.nativeElement.load();
                }
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    close() {
        this.modalTab = false;
    }
}
