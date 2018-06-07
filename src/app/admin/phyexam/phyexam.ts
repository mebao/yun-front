import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../admin.service';

@Component({
    selector: 'app-phyexam',
    templateUrl: './phyexam.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})

export class Phyexam {
    topBar: {
        title: string,
        back: boolean,
    };
    url: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    hasProjectList: any[];
    notProjectList: any[];
    info: {
        service: string,
        name: string,
        first_price: string,
        price: string,
        month_min: string,
        month_max: string,
        remark: string,
    }
    serviceList: any[];

    constructor(
        private router: Router,
        private location: Location,
        private _message: NzMessageService,
        private as: AdminService,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '体检套餐管理',
            back: true,
        }

        this.url = '?username' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        this.loadingShow = true;
        this.isLoadingSave = false;
        this.hasProjectList = [];
        this.notProjectList = [];
        this.info = {
            service: '',
            name: '',
            first_price: '',
            price: '',
            month_min: '',
            month_max: '',
            remark: '',
        }
        this.serviceList = [];

        this.getProjectList();
        this.getServiceList();
    }

    getProjectList() {
        this.as.allphyexam(this.url).then((data) => {
            this.loadingShow = false;
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.hasProjectList = results.list;
                this.notProjectList = [];
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.success('服务器错误');
        });
    }

    getServiceList() {
        this.as.servicelist(this.url).then((data) => {
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

    removeP(index) {
        var project = this.hasProjectList[index];
        this.hasProjectList.splice(index, 1);
        this.notProjectList.push(project);
        this.hasProjectList.sort(function(a, b){return Number(a.id) - Number(b.id)});
        this.notProjectList.sort(function(a, b){return Number(a.id) - Number(b.id)});
    }

    addP(index) {
        var project = this.notProjectList[index];
        this.notProjectList.splice(index, 1);
        this.hasProjectList.push(project);
        this.notProjectList.sort(function(a, b){return Number(a.id) - Number(b.id)});
        this.hasProjectList.sort(function(a, b){return Number(a.id) - Number(b.id)});
    }

    save() {
        if(this.info.service == ''){
            this._message.error('科室不可为空');
            return;
        }
        if(this.info.name == ''){
            this._message.error('套餐名不可为空');
            return;
        }
        if(this.info.month_min == ''){
            this._message.error('合适最小月龄不可为空');
            return;
        }
        if(this.info.month_max == ''){
            this._message.error('合适最大月龄不可为空');
            return;
        }
        if(this.info.price == ''){
            this._message.error('价格不可为空');
            return;
        }
        if(this.hasProjectList.length == 0){
            this._message.error('项目不可为空');
            return;
        }

        this.isLoadingSave = true;
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            service_id: this.info.service,
            name: this.info.name,
            month_min: this.info.month_min.toString(),
            month_max: this.info.month_max.toString(),
            price: this.info.price.toString(),
            first_price: this.info.first_price == '' ? null : this.info.first_price.toString(),
            remark: this.info.remark,
            examlist: JSON.stringify(this.hasProjectList),
        }

        this.as.physicalpackage(params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('体检套餐创建成功');
                setTimeout(() => {
                    this.location.back();
                }, 2000);
            }
        }).catch(() => {
            this.isLoadingSave = false;
            this._message.error('服务器错误');
        });
    }
}
