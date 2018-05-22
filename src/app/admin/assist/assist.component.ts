import { Component }                           from '@angular/core';
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
    selector: 'admin-assist',
    templateUrl: './assist.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})

export class AssistComponent{
	topBar: {
		title: string,
		back: boolean,
	};
    unitList: any[];
    typeList: any[];
    id: string;
    editType: string;
    validateForm: FormGroup;
	// 不可连续点击
	btnCanEdit: boolean;
    _isSpinning: boolean;
    url: string;
    medicalList: any[];
    selectedMList: any[];

    constructor(
        private fb: FormBuilder,
		private _message: NzMessageService,
        public adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.validateForm = this.fb.group({
            name: [ '', [ Validators.required ]],
            type: [ '', [ Validators.required ]],
            price: [ '', [ Validators.required ]],
        });
    }

	ngOnInit() {
		this.topBar = {
			title: '辅助治疗',
			back: true,
		}

		//从缓存中获取clinicdata
		this.unitList = [];
		this.typeList = [];
		var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			this.setClinicData(JSON.parse(clinicdata));
		}else{
			this.adminService.clinicdata().then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.setClinicData(results);
				}
			}).catch(() => {
                this._message.error('服务器错误');
            })
		}

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });
        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.selectedMList = [];
        this._isSpinning = true;
        if(!this.adminService.isFalse(this.id)){
            this.editType = 'update';
            var urlOptions = this.url + '&id=' + this.id;

            this.adminService.searchassist(urlOptions).then((data) => {
                if(data.status == 'no'){
                    this._isSpinning = false;
                    this._message.error(data.errorMsg);
                }else{
                    var results = JSON.parse(JSON.stringify(data.results));
                    if(results.list.length > 0){
                        this.validateForm.controls.name.setValue(results.list[0].name);
                        this.validateForm.controls.type.setValue(results.list[0].type);
                        this.validateForm.controls.price.setValue(results.list[0].price);
                        if(results.list[0].supplie_info.length > 0){
                            for(var i = 0; i < results.list[0].supplie_info.length; i++){
                                this.addField(results.list[0].supplie_info[i]);
                            }
                        }
                    }
                    this._isSpinning = false;
                }
            }).catch(() => {
                this._isSpinning = false;
                this._message.error('服务器错误');
            });
        }else{
            this._isSpinning = false;
            this.editType = 'create';
        }

        // 获取物资、药品信息
        this.medicalList = [];
        this.adminService.searchsupplies(this.url).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.medicalList = results.list;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });

        this.btnCanEdit = false;
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
            medical: `medical${id}`,
            num: `num${id}`,
            unit: `unit${id}`,
            show_num: `show_num${id}`,
            show_unit: `show_unit${id}`,
        }
        const index = this.selectedMList.push(medical_info);
        this.validateForm.addControl(this.selectedMList[index - 1].medical, new FormControl(medical ? medical.name : '', Validators.required));
        this.validateForm.addControl(this.selectedMList[index - 1].num, new FormControl(medical ? medical.num : '', Validators.required));
        this.validateForm.addControl(this.selectedMList[index - 1].unit, new FormControl(medical ? medical.unit : '', Validators.required));
        this.validateForm.addControl(this.selectedMList[index - 1].show_num, new FormControl(medical ? medical.show_num : '', Validators.required));
        this.validateForm.addControl(this.selectedMList[index - 1].show_unit, new FormControl(medical ? medical.show_unit : '', Validators.required));
    }

    removeField(i) {
        if (this.selectedMList.length > 0) {
            const index = this.selectedMList.indexOf(i);
            this.selectedMList.splice(index, 1);
            this.validateForm.removeControl(i.medical);
            this.validateForm.removeControl(i.num);
            this.validateForm.removeControl(i.unit);
            this.validateForm.removeControl(i.show_num);
            this.validateForm.removeControl(i.show_unit);
        }
    }

    setClinicData(data) {
        for(var item in data.typeAssist){
            var type = {
                key: item,
                value: data.typeAssist[item]
            }
            this.typeList.push(type);
        }
        for(var item in data.OneUnits){
            var type = {
                key: item,
                value: data.OneUnits[item]
            }
            this.unitList.push(type);
        }
    }

    create() {
        this.btnCanEdit = true;
        var supplie_info = [];
        if(this.selectedMList.length > 0){
            for(var i = 0; i < this.selectedMList.length; i++){
                var index = this.selectedMList[i].id;
                var supplie = {
                    name: this.validateForm.controls['medical' + index].value,
                    num: this.validateForm.controls['num' + index].value,
                    unit: this.validateForm.controls['unit' + index].value,
                    show_num: this.validateForm.controls['show_num' + index].value,
                    show_unit: this.validateForm.controls['show_unit' + index].value,
                }
                supplie_info.push(supplie);
            }
        }

        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            name: this.validateForm.controls.name.value.trim(),
            type: this.validateForm.controls.type.value.trim(),
            price: this.validateForm.controls.price.value.toString(),
            assist_id: this.editType == 'update' ? this.id : null,
            supplie_info: JSON.stringify(supplie_info),
        }

        this.adminService.clinicassist(params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
                this.btnCanEdit = false;
            }else{
                this._message.success(this.editType == 'update' ? '辅助治疗修改成功' : '辅助治疗创建成功');
                setTimeout(() => {
                    this.router.navigate(['./admin/assist/list']);
                }, 2000);
            }
        }).catch(() => {
            this._message.error('服务器错误');
            this.btnCanEdit = false;
        });
    }
}
