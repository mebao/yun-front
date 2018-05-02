import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../../admin.service';
import { DoctorService }                     from './../doctor.service';

import { NzMessageService }                  from 'ng-zorro-antd';

@Component({
    selector: 'doctor-record-templet',
    templateUrl: './doctor-record-templet.component.html',
})

export class DoctorRecordTempletComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type: string,
	};
	loadingShow: boolean;
    hasData: boolean;
    recordtempletKeys: any[];
    rkList: any[];
    name: string;
    id: string;
    doctorName: string;
    editType: string;
	// 不可连续点击
	btnCanEdit: boolean;
    hasRemove: boolean;

    constructor(
        public adminService: AdminService,
        public doctorService: DoctorService,
        private router: Router,
        private route: ActivatedRoute,
        private _message: NzMessageService,
    ) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.topBar = {
			title: '儿保记录模板',
			back: true,
		}
		this.loadingShow = true;

        this.hasData = false;
        this.recordtempletKeys = [];
        this.hasRemove = false;
        this.rkList = [];
        this.name = '';
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.editType = params.type;
        });

        var url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token;

        if(this.editType == 'create'){
            this.doctorName = '';
            // 查询医生姓名
            var adminlistUrl = url + '&clinic_id=' + this.adminService.getUser().clinicId
                 + '&id=' + this.id;
            this.adminService.adminlist(adminlistUrl).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                }else{
                    var results = JSON.parse(JSON.stringify(data.results));
                    if(results.adminlist.length > 0){
                        this.doctorName = results.adminlist[0].realName;
                    }
                }
            }).catch(() => {
                this._message.error('服务器错误');
            });
        }

        this.doctorService.searchrecordkeys(url).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.list.length > 0){
                    for(var i = 0; i < results.list.length; i++){
                        results.list[i].key = JSON.stringify(results.list[i]);
                        results.list[i].value = results.list[i].name;
                    }
                }
                this.recordtempletKeys = results.list;
                // 新增
                // if(this.editType == 'create'){
                    this.showAll();
                // }
                this.hasData = true;
		        this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });

        this.btnCanEdit = false;
    }

    // 新增首次，展示所有模板内容
    showAll() {
        if(this.editType == 'create'){
            if(this.recordtempletKeys.length > 0){
                for(var i = 0; i < this.recordtempletKeys.length; i++){
                    this.rkList.push({
                        key: this.recordtempletKeys[i].id,
                        use: true,
                        value: this.recordtempletKeys[i].key,
                        selectedValue: this.recordtempletKeys[i].value,
                        rkValue:'',
                        rkValueDisabled:false
                    });
                }
            }
        }else{
            if(this.recordtempletKeys.length > 0){
                for(var i = 0; i < this.recordtempletKeys.length; i++){
                    this.rkList.push({
                        key: this.recordtempletKeys[i].id,
                        use: false,
                        value: this.recordtempletKeys[i].key,
                        selectedValue: this.recordtempletKeys[i].value,
                        rkValue:'',
                        rkValueDisabled:false
                    });
                }
            }
            var recordtemplet = JSON.parse(sessionStorage.getItem('recordtemplet'));
            this.name = recordtemplet.name;
            this.doctorName = recordtemplet.doctor_name;
            for(var i = 0; i < this.rkList.length; i++){
                if(recordtemplet.recordkeys.length > 0){
                    for(var j = 0; j < recordtemplet.recordkeys.length; j++){
                        if(recordtemplet.recordkeys[j].keyId == this.rkList[i].key){
                            this.rkList[i].use = true;
                            this.rkList[i].value = JSON.stringify({
                                id: recordtemplet.recordkeys[j].keyId,
                                key: recordtemplet.recordkeys[j].key,
                                name: recordtemplet.recordkeys[j].keyName,
                            });
                            this.rkList[i].selectedValue = recordtemplet.recordkeys[j].value;
                            this.rkList[i].rkValue = recordtemplet.recordkeys[j].value;
                        }

                    }
                }
            }

        }
        for(var i = 0; i < this.rkList.length; i++){
            var key = JSON.parse(this.rkList[i].value).key;
            if(key=='height' || key=='medium_height' || key=='weight' || key=='medium_weight' ||key=='head_circum' ||key=='breast_circum' ||key=='breathe' ||key=='blood_pressure' ||key=='body_temperature' || key == 'pulse' || key == 'blood_routine_examination' || key == 'stool_routine_examination' || key == 'trace_element' || key == 'heavy_metal' || key == 'teeth_num'){
                this.rkList[i].rkValueDisabled = true;
            }
            if(this.rkList[i].use == false){
                this.hasRemove = true;
            }
        }
    }

    // addRk() {
    //     this.rkList.push({
    //         key: this.rkList.length + 1,
    //         use: true,
    //         value: '',
    //         selectedValue: '',
    //         rkValue:'',
    //     });
    // }

    addRk(key) {
        this.hasRemove = false;
        for(var i = 0; i < this.rkList.length; i++){
            if(this.rkList[i].key == key){
                this.rkList[i].use = true;
            }
            if(this.rkList[i].use == false){
                this.hasRemove = true;
            }
        }
    }

    removeRk(_key) {
        for(var i = 0; i < this.rkList.length; i++){
            if(this.rkList[i].key == _key){
                this.rkList[i].use = false;
            }
        }
        this.hasRemove = true;
    }

    selectedRk(_value, _key) {
        for(var i = 0; i < this.rkList.length; i++){
            if(this.rkList[i].key == _key){
                this.rkList[i].value = _value;
            }
        }
    }

    add() {
        this.btnCanEdit = true;
        this.name = this.adminService.trim(this.name);
        if(this.name == ''){
            this._message.error('模板名不可为空');
            this.btnCanEdit = false;
            return;
        }
        var rk = [];
        var rkNum = 1;
        var rkList = [];
        for(var i = 0; i < this.rkList.length; i++){
            if(this.rkList[i].use){
                if(this.rkList[i].value == ''){
                    this._message.error('第' + rkNum + '条模板内容不可为空');
                    this.btnCanEdit = false;
                    return;
                }else{
                    // 判断是否重复
                    if(rk.indexOf(JSON.parse(this.rkList[i].value).id) != -1){
                        this._message.error('模板内容--' + JSON.parse(this.rkList[i].value).name + '--重复');
                        this.btnCanEdit = false;
                        return;
                    }
                    rk.push(JSON.parse(this.rkList[i].value).id);
                    rkList.push({
                        rk_id:JSON.parse(this.rkList[i].value).id,
                        value:this.rkList[i].rkValue
                    });
                    rkNum++;
                }
            }
        }
        if(rkList.length == 0){
            this._message.error('模板内容不可为空');
            this.btnCanEdit = false;
            return;
        }
        if(this.editType == 'create'){
            var params = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                clinic_id: this.adminService.getUser().clinicId,
                doctor_id: this.id,
                doctor_name: this.doctorName,
                name: this.name,
                rk_id: rk.toString(),
                rkList: JSON.stringify(rkList),
            }

            this.doctorService.recordtemplet(params).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                    this.btnCanEdit = false;
                }else{
                    this._message.success('模板创建成功');
                    setTimeout(() => {
                        this.router.navigate(['./admin/doctor/recordTemplet/list'], {queryParams: {id: this.id}});
                    }, 2000);
                }
            }).catch(() => {
                this._message.error('服务器错误');
                this.btnCanEdit = false;
            });
        }else{
            var updateParams = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                rk_id: rk.toString(),
                rkList: JSON.stringify(rkList),
            }

            this.doctorService.updaterecordtemplet(JSON.parse(sessionStorage.getItem('recordtemplet')).id, updateParams).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.btnCanEdit = false;
                }else{
                    this._message.success('模板修改成功');
                    setTimeout(() => {
                        this.router.navigate(['./admin/doctor/recordTemplet/list'], {queryParams: {id: this.id}});
                    }, 2000);
                }
            }).catch(() => {
                this.toastTab('服务器错误', 'error');
                this.btnCanEdit = false;
            });
        }
    }

	toastTab(text, type) {
		this.toast = {
			show: 1,
			text: text,
			type: type,
		}
		setTimeout(() => {
	    	this.toast = {
				show: 0,
				text: '',
				type: '',
			}
	    }, 2000);
	}
}
