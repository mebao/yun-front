import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../../admin.service';
import { DoctorService }                     from './../doctor.service';

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

    constructor(
        public adminService: AdminService,
        public doctorService: DoctorService,
        private router: Router,
        private route: ActivatedRoute,
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
        this.rkList = [];
        this.name = '';
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.editType = params.type;
        });

        var url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token;

        // 修改
        if(this.editType == 'update'){
            var recordtemplet = JSON.parse(sessionStorage.getItem('recordtemplet'));
            this.name = recordtemplet.name;
            this.doctorName = recordtemplet.doctor_name;
            if(recordtemplet.recordkeys.length > 0){
                for(var i = 0; i < recordtemplet.recordkeys.length; i++){
                    this.rkList.push({
                        key: this.rkList.length + 1,
                        use: true,
                        value: JSON.stringify({
                            id: recordtemplet.recordkeys[i].keyId,
                            key: recordtemplet.recordkeys[i].key,
                            name: recordtemplet.recordkeys[i].keyName,
                        }),
                        selectedValue: recordtemplet.recordkeys[i].keyName,
                    });
                }
            }
        }else{
            this.doctorName = '';
            // 查询医生姓名
            var adminlistUrl = url + '&clinic_id=' + this.adminService.getUser().clinicId
                 + '&id=' + this.id;
            this.adminService.adminlist(adminlistUrl).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                }else{
                    var results = JSON.parse(JSON.stringify(data.results));
                    if(results.adminlist.length > 0){
                        this.doctorName = results.adminlist[0].realName;
                    }
                }
            });
        }

        this.doctorService.searchrecordkeys(url).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this.toastTab(data.errorMsg, 'error');
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
                if(this.editType == 'create'){
                    this.showAll();
                }
                this.hasData = true;
		        this.loadingShow = false;
            }
        });

        this.btnCanEdit = false;
    }

    // 新增首次，展示所有模板内容
    showAll() {
        if(this.recordtempletKeys.length > 0){
            for(var i = 0; i < this.recordtempletKeys.length; i++){
                this.rkList.push({
                    key: i + 1,
                    use: true,
                    value: this.recordtempletKeys[i].key,
                    selectedValue: this.recordtempletKeys[i].value,
                });
            }
        }
    }

    addRk() {
        this.rkList.push({
            key: this.rkList.length + 1,
            use: true,
            value: '',
            selectedValue: '',
        });
    }

    removeRk(_key) {
        for(var i = 0; i < this.rkList.length; i++){
            if(this.rkList[i].key == _key){
                this.rkList[i].use = false;
            }
        }
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
            this.toastTab('模板名不可为空', 'error');
            this.btnCanEdit = false;
            return;
        }
        var rk = [];
        var rkNum = 1;
        for(var i = 0; i < this.rkList.length; i++){
            if(this.rkList[i].use){
                if(this.rkList[i].value == ''){
                    this.toastTab('第' + rkNum + '条模板内容不可为空', 'error');
                    this.btnCanEdit = false;
                    return;
                }else{
                    // 判断是否重复
                    if(rk.indexOf(JSON.parse(this.rkList[i].value).id) != -1){
                        this.toastTab('模板内容--' + JSON.parse(this.rkList[i].value).name + '--重复', 'error');
                        this.btnCanEdit = false;
                        return;
                    }
                    rk.push(JSON.parse(this.rkList[i].value).id);
                    rkNum++;
                }
            }
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
            }

            this.doctorService.recordtemplet(params).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.btnCanEdit = false;
                }else{
                    this.toastTab('模板创建成功', '');
                    setTimeout(() => {
                        this.router.navigate(['./admin/doctor/recordTempletList'], {queryParams: {id: this.id}});
                    }, 2000);
                }
            });
        }else{
            var updateParams = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                rk_id: rk.toString(),
            }

            this.doctorService.updaterecordtemplet(JSON.parse(sessionStorage.getItem('recordtemplet')).id, updateParams).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.btnCanEdit = false;
                }else{
                    this.toastTab('模板修改成功', '');
                    setTimeout(() => {
                        this.router.navigate(['./admin/doctor/recordTempletList'], {queryParams: {id: this.id}});
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
