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

import { AdminService } from '../../admin.service';

@Component({
    selector: 'app-doctor-tcm',
    templateUrl: './doctor-tcm.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class DoctorTcm{
	topBar: {
		title: string,
		back: boolean,
	};
    doctorId: string;
    id: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    validateForm: FormGroup;
    docTcmList: any[];
    tcmList: any[];

    constructor(
        private fb: FormBuilder,
        private as: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private _message: NzMessageService,
		private location: Location,
    ) {
        this.validateForm = this.fb.group({
            name: [ '', [ Validators.required ]],
            total_num: [ '', [ Validators.required ]],
            usage: [ '温水冲服', [ Validators.required ]],
            frequency: [ '', [ Validators.required ]],
            days: [ '', [ Validators.required ]],
            remark: [ ''],
        });
    }

    ngOnInit() {
        this.topBar = {
            title: '中药处方',
            back: true,
        }
        this.isLoadingSave = false;
        this.doctorId = '';
        this.id = '';
        this.route.queryParams.subscribe((params) => {
            this.doctorId = params.id;
            this.id = params.docTcmId;
        });
        this.loadingShow = false;

        this.docTcmList = [];
        this.addField(null);
        this.tcmList = [];
        this.getTcmList();
    }

    addField(tcm, e?: MouseEvent) {
        if (e) {
          e.preventDefault();
        }
        const id = (this.docTcmList.length > 0) ? this.docTcmList[this.docTcmList.length - 1].id + 1 : 0;

        const tcm_info = {
            id: id,
            tcm: `tcm${id}`,
            num: `num${id}`,
            unit: `unit${id}`,
            selectedUnit: tcm == null ? '' : tcm.selectedUnit,
        };
        const index = this.docTcmList.push(tcm_info);
        this.validateForm.addControl(this.docTcmList[index - 1].tcm, new FormControl(tcm == null ? '' : tcm.tcm, Validators.required));
        this.validateForm.addControl(this.docTcmList[index - 1].num, new FormControl(tcm == null ? '' : tcm.num, Validators.required));
        this.validateForm.addControl(this.docTcmList[index - 1].unit, new FormControl(tcm == null ? null : tcm.unit, Validators.required));
    }

    removeField(i, e: MouseEvent) {
        e.preventDefault();
        if (this.docTcmList.length > 0) {
            const index = this.docTcmList.indexOf(i);
            this.docTcmList.splice(index, 1);
            this.validateForm.removeControl(i.tcm);
            this.validateForm.removeControl(i.num);
            this.validateForm.removeControl(i.unit);
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    getTcmList() {
        this.loadingShow = true;
        var urlOptions = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        this.as.searchtcm(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.tcmList = results.tcmlist;
                // 获取处方信息
                if(this.id) {
                    this.docTcmList = [];
                    var urlOptions = '?username=' + this.as.getUser().username
                        + '&token=' + this.as.getUser().token
                        + '&clinic_id=' + this.as.getUser().clinicId
                        + '&id=' + this.id;
                    this.as.searchpotcm(urlOptions).then((data) => {
                        if(data.status == 'no'){
                            this.loadingShow = false;
                            this._message.error(data.errorMsg);
                        }else{
                            var results = JSON.parse(JSON.stringify(data.results));
                            if(results.list.length > 0){
                                this.validateForm = this.fb.group({
                                    name: [ results.list[0].name, [ Validators.required ]],
                                    total_num: [ results.list[0].total_num, [ Validators.required ]],
                                    usage: [ results.list[0].usage, [ Validators.required ]],
                                    frequency: [ results.list[0].frequency, [ Validators.required ]],
                                    days: [ results.list[0].days, [ Validators.required ]],
                                    remark: [ results.list[0].remark],
                                });
                                if(results.list[0].infos.length > 0){
                                    for(var i = 0; i < results.list[0].infos.length; i++){
                                        var docTcm = {
                                            tcm: {},
                                            num: results.list[0].infos[i].num,
                                            unit: results.list[0].infos[i].unit,
                                            selectedUnit: results.list[0].infos[i].unit,
                                        }
                                        if(this.tcmList.length > 0){
                                            for(var j = 0; j < this.tcmList.length; j++){
                                                if(results.list[0].infos[i].tcmId == this.tcmList[j].id){
                                                    docTcm.tcm = this.tcmList[j];
                                                }
                                            }
                                        }
                                        this.addField(docTcm);
                                    }
                                }
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

    changeTcm(_index) {
        var selectedUnit = this.validateForm.controls['tcm' + _index].value.unit ? this.validateForm.controls['tcm' + _index].value.unit : '';
        this.docTcmList[_index].selectedUnit = selectedUnit;
        this.validateForm.controls['unit' + _index].setValue(selectedUnit);
    }

    save() {
        this.isLoadingSave = true;
        var tcmp_info = [];
        for(var index in this.docTcmList){
            var tcmp = {
                tcm_id: this.validateForm.controls['tcm' + index].value.id,
                tcm_name: this.validateForm.controls['tcm' + index].value.name,
                num: this.validateForm.controls['num' + index].value,
                unit: this.validateForm.controls['unit' + index].value,
            }
            tcmp_info.push(tcmp);
        }
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            doctor_id: this.doctorId,
            name: this.validateForm.controls.name.value,
            total_num: this.validateForm.controls.total_num.value,
            usage: this.validateForm.controls.usage.value,
            frequency: this.validateForm.controls.frequency.value,
            days: this.validateForm.controls.days.value,
            remark: this.validateForm.controls.remark.value,
            tcmp_info: tcmp_info,
            id: this.id ? this.id : null,
        }
        this.as.clinicpotcm(params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('药材处方保存成功');
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
