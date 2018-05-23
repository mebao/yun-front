import { Component }                           from '@angular/core';
import { Location }                            from '@angular/common';
import { ActivatedRoute, Router }              from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

import { NzMessageService }                    from 'ng-zorro-antd';

import { AdminService }                        from '../admin.service';

@Component({
    selector: 'admin-mout',
    templateUrl: './mout.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})

export class Mout{
	topBar: {
		title: string,
		back: boolean,
	};
    validateForm: FormGroup;
	// 不可连续点击
	btnCanEdit: boolean;
    _isSpinning: boolean;
    url: string;
    medicalList: any[];
    selectedMList: any[];

    constructor(
		private location: Location,
        private fb: FormBuilder,
		private _message: NzMessageService,
        public adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.validateForm = this.fb.group({
            remark: [ '', [ Validators.required ]],
        });
    }

	ngOnInit() {
		this.topBar = {
			title: '手动出库',
			back: true,
		}

        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.selectedMList = [];
        this._isSpinning = true;

        // 获取物资、药品信息
        this.medicalList = [];
        this.adminService.searchsupplies(this.url).then((data) => {
            if(data.status == 'no'){
        		this._isSpinning = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.list.length > 0){
                    for(var i = 0; i < results.list.length; i++){
                        if(results.list[i].others.length > 0){
                            for(var j = 0; j < results.list[i].others.length; j++){
                                if(results.list[i].others[j].batch == null){
                                    results.list[i].others[j].batchText = results.list[i].name;
                                }else{
                                    results.list[i].others[j].batchText = results.list[i].others[j].batch;
                                }
                            }
                        }
                    }
                }
                this.medicalList = results.list;
        		this._isSpinning = false;
            }
        }).catch(() => {
			this._isSpinning = false;
            this._message.error('服务器错误');
        });

        this.btnCanEdit = false;
        this.addField(null);
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    addField(medical, e?: MouseEvent) {
        if (e) {
          e.preventDefault();
        }
        const id = (this.selectedMList.length > 0) ? this.selectedMList[this.selectedMList.length - 1].id + 1 : 0;
        var medical_info = {
            id: id,
            sinfo: `sinfo${id}`,
            batch: `batch${id}`,
            num: `num${id}`,
			unit: `unit${id}`,
			batchList: [],
            unitSelectList: [],
        }
        const index = this.selectedMList.push(medical_info);
        this.validateForm.addControl(this.selectedMList[index - 1].sinfo, new FormControl('', Validators.required));
        this.validateForm.addControl(this.selectedMList[index - 1].batch, new FormControl('', Validators.required));
        this.validateForm.addControl(this.selectedMList[index - 1].num, new FormControl('', Validators.required));
        this.validateForm.addControl(this.selectedMList[index - 1].unit, new FormControl('', Validators.required));
    }

    removeField(i) {
        if (this.selectedMList.length > 0) {
            const index = this.selectedMList.indexOf(i);
            this.selectedMList.splice(index, 1);
            this.validateForm.removeControl(i.sinfo);
            this.validateForm.removeControl(i.batch);
            this.validateForm.removeControl(i.num);
        }
    }

	changeM(i, $event) {
        if (!$event && this.selectedMList.length > 0) {
            const index = this.selectedMList.indexOf(i);
			this.selectedMList[index].batchList = this.validateForm.controls['sinfo' + index].value.others;
            this.selectedMList[index].unitSelectList = [{
                key: this.validateForm.controls['sinfo' + index].value.unit,
                value: this.validateForm.controls['sinfo' + index].value.unit,
            }];
            var batch = this.validateForm.controls['batch' + index].value;
            this.validateForm.controls['batch' + index].setValue(batch == null ? '' : null);
            this.validateForm.controls['unit' + index].setValue(this.validateForm.controls['sinfo' + index].value.unit);
            // 如果是物资，无批次，则默认选择第一个
            if(this.selectedMList[index].batchList.length > 0 && this.selectedMList[index].batchList[0].batch == null){
                this.validateForm.controls['batch' + index].setValue(this.selectedMList[index].batchList[0]);
            }
        }
	}

    create() {
        this.btnCanEdit = true;
        var supplie_info = [];
        if(this.selectedMList.length > 0){
            for(var i = 0; i < this.selectedMList.length; i++){
                var index = this.selectedMList[i].id;
                var batch = this.validateForm.controls['batch' + index].value;
                var num = this.validateForm.controls['num' + index].value;
                if(Number(num) > Number(batch.stock)){
                    this._message.error(this.validateForm.controls['sinfo' + index].value.name + '出库数量超过库存');
                    this.btnCanEdit = false;
                    return;
                }
                var supplie = {
                    sinfo_id: batch.id,
                    num: num,
                }
                supplie_info.push(supplie);
            }
        }

        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            remark: this.validateForm.controls.remark.value.trim(),
            outlist: JSON.stringify(supplie_info),
        }

        this.adminService.handoutstock(params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
                this.btnCanEdit = false;
            }else{
                this._message.success('手动出库成功');
                setTimeout(() => {
        			this.location.back();
                }, 2000);
            }
        }).catch(() => {
            this._message.error('服务器错误');
            this.btnCanEdit = false;
        });
    }
}
