import { Component } from '@angular/core';
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
    selector: 'app-medical-tcm',
    templateUrl: './tcm.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class Tcm{
	topBar: {
		title: string,
		back: boolean,
	};
    id: string;
    from: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    validateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private as: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private _message: NzMessageService,
    ) {
        this.validateForm = this.fb.group({
            name: [ '', [ Validators.required ]],
            name_code: [ '', [ Validators.required ]],
            price: [ '', [ Validators.required ]],
            unit: [ 'g', [ Validators.required ]],
            bid: [ '',],
        });
    }

    ngOnInit() {
        this.topBar = {
            title: '药材',
            back: true,
        }
        this.isLoadingSave = false;
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.from = params.from;
        });
        this.loadingShow = false;

        if(this.id) {
            this.loadingShow = true;
            var urlOptions = '?username=' + this.as.getUser().username
                + '&token=' + this.as.getUser().token
                + '&clinic_id=' + this.as.getUser().clinicId
                + '&id=' + this.id;
            this.as.searchtcm(urlOptions).then((data) => {
                if(data.status == 'no'){
                    this.loadingShow = false;
                    this._message.error(data.errorMsg);
                }else{
                    this.loadingShow = false;
                    var results = JSON.parse(JSON.stringify(data.results));
                    if(results.tcmlist.length > 0){
                        this.validateForm = this.fb.group({
                            name: [ results.tcmlist[0].name, [ Validators.required ]],
                            name_code: [ results.tcmlist[0].nameCode, [ Validators.required ]],
                            price: [ results.tcmlist[0].price, [ Validators.required ]],
                            unit: [ results.tcmlist[0].unit, [ Validators.required ]],
                            bid: [ results.tcmlist[0].bid],
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
            name_code: this.validateForm.controls.name_code.value,
            price: this.validateForm.controls.price.value,
            unit: this.validateForm.controls.unit.value,
            bid: this.validateForm.controls.bid.value,
            id: this.id ? this.id : null,
        }
        this.as.clinictcm(params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('药材保存成功');
                setTimeout(() => {
                    this.router.navigate(['./admin/medical/tcm/' + this.from]);
                }, 2000);
            }
        }).catch(() => {
            this.isLoadingSave = false;
            this._message.error('服务器错误');
        });
    }
}
