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
    selector: 'app-medical-tcm-purchase',
    templateUrl: './tcm-purchase.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class TcmPurchase{
	topBar: {
		title: string,
		back: boolean,
	};
    url: string;
    id: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    validateForm: FormGroup;
    tcmPurchaseList: any[];
    tcmList: any[];
    supplierList: any[];

    constructor(
        private fb: FormBuilder,
        private as: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private _message: NzMessageService,
    ) {
        this.validateForm = this.fb.group({
            supplier: [ '', [ Validators.required ]],
            about_time: [ '', [ Validators.required ]],
            fee: [ '', [ Validators.required ]],
        });
    }

    ngOnInit() {
        this.topBar = {
            title: '新增入库',
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
        this.tcmPurchaseList = [];
        this.tcmList = [];
        this.getTcmList();
        this.supplierList = [];
        this.getSupplierList();

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

    getSupplierList() {
        this.as.supplierlist(this.url).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.supplierList = results.list;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    addField(tcm, e?: MouseEvent) {
        if (e) {
          e.preventDefault();
        }
        const id = (this.tcmPurchaseList.length > 0) ? this.tcmPurchaseList[this.tcmPurchaseList.length - 1].id + 1 : 0;

        const tcm_info = {
            id: id,
            tcm: `tcm${id}`,
            num: `num${id}`,
            unit: `unit${id}`,
            selectedUnit: tcm == null ? '' : tcm.selectedUnit,
            bid: `bid${id}`,
        };
        const index = this.tcmPurchaseList.push(tcm_info);
        this.validateForm.addControl(this.tcmPurchaseList[index - 1].tcm, new FormControl(tcm == null ? '' : tcm.tcm, Validators.required));
        this.validateForm.addControl(this.tcmPurchaseList[index - 1].num, new FormControl(tcm == null ? '' : tcm.num, Validators.required));
        this.validateForm.addControl(this.tcmPurchaseList[index - 1].unit, new FormControl(tcm == null ? null : tcm.unit, Validators.required));
        this.validateForm.addControl(this.tcmPurchaseList[index - 1].bid, new FormControl(tcm == null ? null : tcm.bid, Validators.required));
    }

    removeField(i, e: MouseEvent) {
        e.preventDefault();
        if (this.tcmPurchaseList.length > 0) {
            const index = this.tcmPurchaseList.indexOf(i);
            this.tcmPurchaseList.splice(index, 1);
            this.validateForm.removeControl(i.tcm);
            this.validateForm.removeControl(i.num);
            this.validateForm.removeControl(i.unit);
            this.validateForm.removeControl(i.bid);
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    changeTcm(_index) {
        var selectedBid = this.validateForm.controls['tcm' + _index].value.unit ? this.validateForm.controls['tcm' + _index].value.bid : '';
        var selectedUnit = this.validateForm.controls['tcm' + _index].value.unit ? this.validateForm.controls['tcm' + _index].value.unit : '';
        this.tcmPurchaseList[_index].selectedUnit = selectedUnit;
        this.validateForm.controls['unit' + _index].setValue(selectedUnit);
        this.validateForm.controls['bid' + _index].setValue(selectedBid);
        this.changeFee();
    }

    changeFee() {
        var fee = 0;
        if(this.tcmPurchaseList.length > 0){
            for(var index in this.tcmPurchaseList){
                var tcm = {
                    id: this.validateForm.controls['tcm' + index].value.id,
                    num: this.validateForm.controls['num' + index].value,
                    unit: this.validateForm.controls['unit' + index].value,
                    bid: this.validateForm.controls['bid' + index].value,
                }
                if(tcm.id && tcm.num && tcm.bid){
                    fee += tcm.num * (tcm.bid * 10000);
                }
            }
        }
        this.validateForm.controls['fee'].setValue(fee / 10000);
    }

    save() {
        this.isLoadingSave = true;
        var tcmList = [];
        if(this.tcmPurchaseList.length > 0){
            for(var index in this.tcmPurchaseList){
                var tcm = {
                    id: this.validateForm.controls['tcm' + index].value.id,
                    num: this.validateForm.controls['num' + index].value,
                    unit: this.validateForm.controls['unit' + index].value,
                    bid: this.validateForm.controls['bid' + index].value,
                }
                tcmList.push(tcm);
            }
        }
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            supplier_id: this.validateForm.controls.supplier.value.id,
            supplier_name: this.validateForm.controls.supplier.value.name,
            about_time: this.as.getDayByDate(new Date(this.validateForm.controls.about_time.value)),
            tcmlist: tcmList,
            fee: this.validateForm.controls.fee.value,
        }
        this.as.tcmpurchase(params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('入库成功');
                setTimeout(() => {
                    this.router.navigate(['./admin/medical/tcm/purchaseList']);
                }, 2000);
            }
        }).catch(() => {
            this.isLoadingSave = false;
            this._message.error('服务器错误');
        });
    }
}
