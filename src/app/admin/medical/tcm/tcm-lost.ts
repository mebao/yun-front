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
    selector: 'app-medical-tcm-lost',
    templateUrl: './tcm-lost.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class TcmLost{
	topBar: {
		title: string,
		back: boolean,
	};
    url: string;
    id: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    validateForm: FormGroup;
    tcmLostList: any[];
    tcmList: any[];

    constructor(
        private fb: FormBuilder,
        private as: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private _message: NzMessageService,
    ) {
        this.validateForm = this.fb.group({
            remark: [ '', [ Validators.required ]],
        });
    }

    ngOnInit() {
        this.topBar = {
            title: '新增报损',
            back: true,
        }
        this.url = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        this.isLoadingSave = false;
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });
        this.loadingShow = false;
        this.tcmLostList = [];
        this.tcmList = [];
        this.getTcmList();

        this.addField(null);
    }

    getTcmList() {
        this.as.searchtcm(this.url).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.tcmList = results.tcmlist;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    addField(tcm, e?: MouseEvent) {
        if (e) {
          e.preventDefault();
        }
        const id = (this.tcmLostList.length > 0) ? this.tcmLostList[this.tcmLostList.length - 1].id + 1 : 0;

        const tcm_info = {
            id: id,
            tcm: `tcm${id}`,
            num: `num${id}`,
            unit: `unit${id}`,
            selectedUnit: tcm == null ? '' : tcm.selectedUnit,
        };
        const index = this.tcmLostList.push(tcm_info);
        this.validateForm.addControl(this.tcmLostList[index - 1].tcm, new FormControl(tcm == null ? '' : tcm.tcm, Validators.required));
        this.validateForm.addControl(this.tcmLostList[index - 1].num, new FormControl(tcm == null ? '' : tcm.num, Validators.required));
        this.validateForm.addControl(this.tcmLostList[index - 1].unit, new FormControl(tcm == null ? null : tcm.unit, Validators.required));
    }

    removeField(i, e: MouseEvent) {
        e.preventDefault();
        if (this.tcmLostList.length > 0) {
            const index = this.tcmLostList.indexOf(i);
            this.tcmLostList.splice(index, 1);
            this.validateForm.removeControl(i.tcm);
            this.validateForm.removeControl(i.num);
            this.validateForm.removeControl(i.unit);
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    changeTcm(_index) {
        var selectedUnit = this.validateForm.controls['tcm' + _index].value.unit ? this.validateForm.controls['tcm' + _index].value.unit : '';
        this.tcmLostList[_index].selectedUnit = selectedUnit;
        this.validateForm.controls['unit' + _index].setValue(selectedUnit);
    }

    save() {
        var tcmList = [];
		var feeAll = 0;
		if(this.tcmLostList.length > 0){
            for(var index in this.tcmLostList){
				var lost = {
					project_id: this.validateForm.controls['tcm' + index].value.id,
                    project_type: 'tcm',
					num: this.validateForm.controls['num' + index].value,
				};
				if(Number(lost.num) > Number(this.validateForm.controls['tcm' + index].value.stock)){
					this._message.error(this.validateForm.controls['tcm' + index].value.name + '（库存：'
						 + this.validateForm.controls['tcm' + index].value.stock
						 + this.validateForm.controls['tcm' + index].value.unit + '），报损数量超过库存现有量');
					return;
				}
				tcmList.push(lost);
				feeAll += Number(JSON.parse(this.validateForm.controls['tcm' + index].value.bid) * Number(lost.num));
            }
		}
        this.isLoadingSave = true;
		var params = {
			username: this.as.getUser().username,
			token: this.as.getUser().token,
			clinic_id: this.as.getUser().clinicId,
			remark: this.validateForm.controls.remark.value,
			mslosts: tcmList,
			fee: feeAll,
		}
        this.as.medicalsupplieslost(params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('报损成功');
                setTimeout(() => {
                    this.router.navigate(['./admin/medical/tcm/lostList']);
                }, 2000);
            }
        }).catch(() => {
            this.isLoadingSave = false;
            this._message.error('服务器错误');
        });
    }
}
