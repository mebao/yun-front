import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../../admin.service';
import { DoctorService }                     from './../doctor.service';

import { NzMessageService }                  from 'ng-zorro-antd';

@Component({
    selector: 'doctor-case-templet',
    templateUrl: './doctor-case-templet.component.html',
})

export class DoctorCaseTempletComponent{
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
    casetempletKeys: any[];
    ckList: any[];
    name: string;
    id: string;
    doctorName: string;
    editType: string;
	// 不可连续点击
	btnCanEdit: boolean;
    hasRemove:boolean;

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
			title: '病历模板',
			back: true,
		}
		this.loadingShow = true;

        this.hasData = false;
        this.casetempletKeys = [];
        this.hasRemove = false;
        this.ckList = [];
        this.name = '';
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.editType = params.type;
        });

        var url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token;

        // 修改
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
            });
        }

        this.doctorService.searchcasekeys(url).then((data) => {
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
                this.casetempletKeys = results.list;
                // 新增
                //if(this.editType == 'create'){
                    this.showAll();
                //}
                this.hasData = true;
		        this.loadingShow = false;
            }
        });

        this.btnCanEdit = false;
    }

    // 新增首次，展示所有模板内容
    showAll() {
        if(this.editType == 'create'){
            if(this.casetempletKeys.length > 0){
                for(var i = 0; i < this.casetempletKeys.length; i++){
                    this.ckList.push({
                        key: this.casetempletKeys[i].id,
                        use: true,
                        value: this.casetempletKeys[i].key,
                        selectedValue: this.casetempletKeys[i].value,
                        ckValue:'',
                        ckValueDisabled:false,
                    });
                }
            }
        }else{
            if(this.casetempletKeys.length > 0){
                for(var i = 0; i < this.casetempletKeys.length; i++){
                    this.ckList.push({
                        key: this.casetempletKeys[i].id,
                        use: false,
                        value: this.casetempletKeys[i].key,
                        selectedValue: this.casetempletKeys[i].value,
                        ckValue:'',
                        ckValueDisabled:false,
                    });
                }
            }
            var casetemplet = JSON.parse(sessionStorage.getItem('casetemplet'));
            this.name = casetemplet.name;
            this.doctorName = casetemplet.doctor_name;
            for(var i = 0; i < this.ckList.length; i++){
                if(casetemplet.casekeys.length > 0){
                    for(var j = 0; j < casetemplet.casekeys.length; j++){
                        if(casetemplet.casekeys[j].keyId == this.ckList[i].key){
                            this.ckList[i].use = true;
                            this.ckList[i].value = JSON.stringify({
                                id: casetemplet.casekeys[j].keyId,
                                key: casetemplet.casekeys[j].key,
                                name: casetemplet.casekeys[j].keyName,
                            });
                            this.ckList[i].selectedValue = casetemplet.casekeys[j].value;
                            this.ckList[i].ckValue = casetemplet.casekeys[j].value;
                        }
                    }
                }
            }
        }
        for(var i = 0; i < this.ckList.length; i++){
            var key = JSON.parse(this.ckList[i].value).key;
            if(key=='height' || key=='mid_height' || key=='weight' || key=='mid_weight' ||key=='head_circum' ||key=='breast_circum' ||key=='breathe' ||key=='blood_pressure' ||key=='body_temperature' || key == 'teeth'){
                this.ckList[i].ckValueDisabled = true;
            }
            if(this.ckList[i].use == false){
                this.hasRemove = true;
            }
        }
    }

    // addCk() {
    //     this.ckList.push({
    //         key: this.ckList.length + 1,
    //         use: true,
    //         value: '',
    //         selectedValue: '',
    //         ckValue:'',
    //     });
    // }

    addCk(key){
        this.hasRemove = false;
        for(var i = 0; i < this.ckList.length; i++){
            if(this.ckList[i].key == key){
                this.ckList[i].use = true;
            }
            if(this.ckList[i].use == false){
                this.hasRemove = true;
            }
        }
    }

    removeCk(_key) {
        for(var i = 0; i < this.ckList.length; i++){
            if(this.ckList[i].key == _key){
                this.ckList[i].use = false;
            }
        }
        this.hasRemove = true;
    }

    selectedck(_value, _key) {
        for(var i = 0; i < this.ckList.length; i++){
            if(this.ckList[i].key == _key){
                this.ckList[i].value = _value;
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
        var ck = [];
        var ckNum = 1;
        var ckList = [];
        for(var i = 0; i < this.ckList.length; i++){
            if(this.ckList[i].use){
                if(this.ckList[i].value == ''){
                    this._message.error('第' + ckNum + '条模板内容不可为空');
                    this.btnCanEdit = false;
                    return;
                }else{
                    // 判断是否重复
                    if(ck.indexOf(JSON.parse(this.ckList[i].value).id) != -1){
                        this._message.error('模板内容--' + JSON.parse(this.ckList[i].value).name + '--重复');
                        this.btnCanEdit = false;
                        return;
                    }
                    ck.push(JSON.parse(this.ckList[i].value).id);
                    ckList.push({
                        ck_id:JSON.parse(this.ckList[i].value).id,
                        value:this.ckList[i].ckValue
                    });
                    ckNum++;
                }
            }
        }
        if(ckList.length == 0){
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
                ck_id: ck.toString(),
                ckList: JSON.stringify(ckList),
            }

            this.doctorService.casetemplet(params).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                    this.btnCanEdit = false;
                }else{
                    this._message.success('模板创建成功');
                    setTimeout(() => {
                        this.router.navigate(['./admin/doctor/caseTemplet/list'], {queryParams: {id: this.id}});
                    }, 2000);
                }
            });
        }else{
            var updateParams = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                ck_id: ck.toString(),
                ckList: JSON.stringify(ckList),
            }

            this.doctorService.updatecasetemplet(JSON.parse(sessionStorage.getItem('casetemplet')).id, updateParams).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                    this.btnCanEdit = false;
                }else{
                    this._message.success('模板修改成功');
                    setTimeout(() => {
                        this.router.navigate(['./admin/doctor/caseTemplet/list'], {queryParams: {id: this.id}});
                    }, 2000);
                }
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
