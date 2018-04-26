import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../admin.service';

@Component({
    selector: 'app-actcard',
    templateUrl: './actcard.html',
    styleUrls: ['../../../assets/css/ant-common.scss']
})

export class Actcard{
    topBar: {
        title: string,
        back: boolean,
    }
    id: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    validateForm: FormGroup;
    serviceList: any[];

    constructor(
        private fb: FormBuilder,
        private as: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private _message: NzMessageService,
    ) {
        this.validateForm = this.fb.group({
            name: [ '', [ Validators.required ]],
            service: [ '', [ Validators.required ]],
            price: [ '', [ Validators.required ]],
            num: [ '', [ Validators.required ]],
        });
    }

    ngOnInit() {
        this.topBar = {
            title: '活动卡',
            back: true,
        }
        this.isLoadingSave = false;
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });
        this.loadingShow = false;
        this.serviceList = [];
        this.getServiceList();
    }

    getServiceList() {
        var urlOptions = '?username' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        this.as.servicelist(urlOptions).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.serviceList = results.servicelist;
                this.getFormData();
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    getFormData() {
        if(this.id) {
            this.loadingShow = true;
            var urlOptions = '?username=' + this.as.getUser().username
                + '&token=' + this.as.getUser().token
                + '&clinic_id=' + this.as.getUser().clinicId
                + '&id=' + this.id;
            this.as.searchactcard(urlOptions).then((data) => {
                if(data.status == 'no'){
                    this.loadingShow = false;
                    this._message.error(data.errorMsg);
                }else{
                    this.loadingShow = false;
                    var results = JSON.parse(JSON.stringify(data.results));
                    if(results.list.length > 0){
                        this.validateForm = this.fb.group({
                            name: [ results.list[0].name, [ Validators.required ]],
                            service: [ results.list[0].projectId, [ Validators.required ]],
                            price: [ results.list[0].price, [ Validators.required ]],
                            num: [ results.list[0].num, [ Validators.required ]],
                        });
                    }else{
                        this._message.error('数据错误');
                    }
                }
            }).catch(() => {
                this.loadingShow = false;
                this._message.error('服务器错误');
            })
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    save() {
        this.isLoadingSave = true;
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            name: this.validateForm.controls.name.value,
            price: this.validateForm.controls.price.value,
            num: this.validateForm.controls.num.value,
            project_id: this.validateForm.controls.service.value,
            id: this.id ? this.id : null,
        }
        this.as.actcard(params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('活动卡保存成功');
                setTimeout(() => {
                    this.router.navigate(['./admin/actcard/list']);
                }, 2000);
            }
        }).catch(() => {
            this.isLoadingSave = false;
            this._message.error('服务器错误');
        });
    }
}
