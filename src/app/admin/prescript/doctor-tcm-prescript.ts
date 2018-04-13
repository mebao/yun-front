import { Component } from '@angular/core';
import { Location } from '@angular/common';
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
    selector: 'app-doctor-tcm-prescript',
    templateUrl: './doctor-tcm-prescript.html',
    styleUrls: ['../../../assets/css/ant-common.scss']
})

export class DoctorTcmPrescript{
	topBar: {
		title: string,
		back: boolean,
	};
    url: string;
    doctorId: string;
    bookingId: string;
    creatorId: string;
    childId: string;
    tcmPrescriptId: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    validateForm: FormGroup;
    docPreTcmList: any[];
    tcmList: any[];
    docTcmList: any[];
    docPreTcmTab: boolean;

    constructor(
        private fb: FormBuilder,
        private as: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private _message: NzMessageService,
		private location: Location,
    ) {
        this.validateForm = this.fb.group({
            num: [ '', [ Validators.required ]],
            usage: [ '温水冲服', [ Validators.required ]],
            frequency: [ '', [ Validators.required ]],
            remark: [ ''],
        });
    }

    ngOnInit() {
        this.topBar = {
            title: '中药处方',
            back: true,
        }
        this.url = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        this.isLoadingSave = false;
        this.doctorId = '';
        this.bookingId = '';
        this.creatorId = '';
        this.childId = '';
        this.tcmPrescriptId = '';
        this.route.queryParams.subscribe((params) => {
            this.doctorId = params.doctorId;
            this.bookingId = params.id;
            this.creatorId = params.creatorId;
            this.childId = params.childId;
            this.tcmPrescriptId = params.tcmPreId;
        });
        this.loadingShow = false;

        this.docPreTcmList = [];
        this.addField(null);
        this.tcmList = [];
        this.getTcmList();
        this.docTcmList = [];
        this.docPreTcmTab = false;
        this.getDocTcmList();
    }

    addField(tcm, e?: MouseEvent) {
        if (e) {
          e.preventDefault();
        }
        const id = (this.docPreTcmList.length > 0) ? this.docPreTcmList[this.docPreTcmList.length - 1].id + 1 : 0;

        const tcm_info = {
            id: id,
            tcm: `tcm${id}`,
            num: `num${id}`,
            unit: `unit${id}`,
            selectedUnit: tcm == null ? '' : tcm.selectedUnit,
        };
        const index = this.docPreTcmList.push(tcm_info);
        this.validateForm.addControl(this.docPreTcmList[index - 1].tcm, new FormControl(tcm == null ? '' : tcm.tcm, Validators.required));
        this.validateForm.addControl(this.docPreTcmList[index - 1].num, new FormControl(tcm == null ? '' : tcm.num, Validators.required));
        this.validateForm.addControl(this.docPreTcmList[index - 1].unit, new FormControl(tcm == null ? null : tcm.unit, Validators.required));
    }

    removeField(i, e: MouseEvent) {
        e.preventDefault();
        if (this.docPreTcmList.length > 0) {
            const index = this.docPreTcmList.indexOf(i);
            this.docPreTcmList.splice(index, 1);
            this.validateForm.removeControl(i.tcm);
            this.validateForm.removeControl(i.num);
            this.validateForm.removeControl(i.unit);
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    getDocTcmList() {
        var urlOptions = this.url + '&doctor_id=' + this.doctorId;
        this.as.searchpotcm(urlOptions).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.docTcmList = results.list;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    selectDocTcm() {
        this.docPreTcmTab = true;
    }

    cancelDocTcmTab(event) {
        this.docPreTcmTab = false;
    }

    selectedDocTcm(docTcm) {
        this.structureTcm(docTcm, 'template');
        this.docPreTcmTab = false;
    }

    getTcmList() {
        this.loadingShow = true;
        this.as.searchtcm(this.url).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var resultsTcm = JSON.parse(JSON.stringify(data.results));
                this.tcmList = resultsTcm.tcmlist;
                // 获取处方信息
                if(this.tcmPrescriptId) {
                    var urlOptions = '?username=' + this.as.getUser().username
                        + '&token=' + this.as.getUser().token
                        + '&clinic_id=' + this.as.getUser().clinicId
                        + '&id=' + this.tcmPrescriptId + '&isout=1';
                    this.as.searchtcmprescript(urlOptions).then((data) => {
                        if(data.status == 'no'){
                            this.loadingShow = false;
                            this._message.error(data.errorMsg);
                        }else{
                            var results = JSON.parse(JSON.stringify(data.results));
                            if(results.list.length > 0){
                                // 构造处方数据
                                this.structureTcm(results.list[0], 'list');
                                this.loadingShow = false;
                            }else{
                                this.loadingShow = false;
                                this._message.error('数据错误');
                            }
                        }
                    }).catch(() => {
                        this.loadingShow = false;
                        this._message.error('服务器错误3');
                    })
                }else{
                    this.loadingShow = false;
                }
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    structureTcm(docTcmData, type) {
        this.docPreTcmList = [];
        this.validateForm = this.fb.group({
            num: [ type == 'list' ? docTcmData.num : docTcmData.total_num, [ Validators.required ]],
            usage: [ docTcmData.usage, [ Validators.required ]],
            frequency: [ docTcmData.frequency, [ Validators.required ]],
            remark: [ docTcmData.remark],
        });
        if(docTcmData.infos.length > 0){
            for(var i = 0; i < docTcmData.infos.length; i++){
                var docTcm = {
                    tcm: {},
                    num: docTcmData.infos[i].num,
                    unit: docTcmData.infos[i].unit,
                    selectedUnit: docTcmData.infos[i].unit,
                }
                if(this.tcmList.length > 0){
                    for(var j = 0; j < this.tcmList.length; j++){
                        if(docTcmData.infos[i].tcmId == this.tcmList[j].id){
                            docTcm.tcm = this.tcmList[j];
                        }
                    }
                }
                this.addField(docTcm);
            }
        }
    }

    changeTcm(_index) {
        var selectedUnit = this.validateForm.controls['tcm' + _index].value.unit ? this.validateForm.controls['tcm' + _index].value.unit : '';
        this.docPreTcmList[_index].selectedUnit = selectedUnit;
        this.validateForm.controls['unit' + _index].setValue(selectedUnit);
    }

    save() {
        var tcmp_info = [];
        for(var index in this.docPreTcmList){
            var tcmp = {
                tcm_id: this.validateForm.controls['tcm' + index].value.id,
                tcm_name: this.validateForm.controls['tcm' + index].value.name,
                num: this.validateForm.controls['num' + index].value,
                unit: this.validateForm.controls['unit' + index].value,
                price: this.validateForm.controls['tcm' + index].value.price,
            }
            if((Number(tcmp.num) * this.validateForm.controls.num.value) > Number(this.validateForm.controls['tcm' + index].value.stock)){
                this._message.error(this.validateForm.controls['tcm' + index].value.name + '（库存：'
                     + this.validateForm.controls['tcm' + index].value.stock
                     + this.validateForm.controls['tcm' + index].value.unit + '），报损数量超过库存现有量');
                return;
            }
            tcmp_info.push(tcmp);
        }
        this.isLoadingSave = true;
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            booking_id: this.bookingId,
            doctor_id: this.doctorId,
            doctor_name: sessionStorage.getItem('docBookingDocName'),
            user_id: this.creatorId,
            child_id: this.childId,
            num: this.validateForm.controls.num.value,
            usage: this.validateForm.controls.usage.value,
            frequency: this.validateForm.controls.frequency.value,
            remark: this.validateForm.controls.remark.value,
            plist: tcmp_info,
            id: this.tcmPrescriptId ? this.tcmPrescriptId : null,
        }
        this.as.tcmprescript(params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('中药处方保存成功');
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
