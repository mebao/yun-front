import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../../admin.service';
import { DoctorService }                     from './../doctor.service';

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
			title: '病历模板',
			back: true,
		}
		this.loadingShow = true;

        this.hasData = false;
        this.casetempletKeys = [];
        this.ckList = [];
        this.name = '';
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.editType = params.type;
        });

        var url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token;

        // 修改
        if(this.editType == 'update'){
            var casetemplet = JSON.parse(sessionStorage.getItem('casetemplet'));
            this.name = casetemplet.name;
            this.doctorName = casetemplet.doctor_name;
            if(casetemplet.casekeys.length > 0){
                for(var i = 0; i < casetemplet.casekeys.length; i++){
                    this.ckList.push({
                        key: this.ckList.length + 1,
                        use: true,
                        value: JSON.stringify({
                            id: casetemplet.casekeys[i].keyId,
                            key: casetemplet.casekeys[i].key,
                            name: casetemplet.casekeys[i].keyName,
                        }),
                        selectedValue: casetemplet.casekeys[i].keyName,
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

        this.doctorService.searchcasekeys(url).then((data) => {
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
                this.casetempletKeys = results.list;
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
        if(this.casetempletKeys.length > 0){
            for(var i = 0; i < this.casetempletKeys.length; i++){
                this.ckList.push({
                    key: i + 1,
                    use: true,
                    value: this.casetempletKeys[i].key,
                    selectedValue: this.casetempletKeys[i].value,
                });
            }
        }
    }

    addCk() {
        this.ckList.push({
            key: this.ckList.length + 1,
            use: true,
            value: '',
            selectedValue: '',
        });
    }

    removeCk(_key) {
        for(var i = 0; i < this.ckList.length; i++){
            if(this.ckList[i].key == _key){
                this.ckList[i].use = false;
            }
        }
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
            this.toastTab('模板名不可为空', 'error');
            this.btnCanEdit = false;
            return;
        }
        var ck = [];
        var ckNum = 1;
        for(var i = 0; i < this.ckList.length; i++){
            if(this.ckList[i].use){
                if(this.ckList[i].value == ''){
                    this.toastTab('第' + ckNum + '条模板内容不可为空', 'error');
                    this.btnCanEdit = false;
                    return;
                }else{
                    // 判断是否重复
                    if(ck.indexOf(JSON.parse(this.ckList[i].value).id) != -1){
                        this.toastTab('模板内容--' + JSON.parse(this.ckList[i].value).name + '--重复', 'error');
                        this.btnCanEdit = false;
                        return;
                    }
                    ck.push(JSON.parse(this.ckList[i].value).id);
                    ckNum++;
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
                ck_id: ck.toString(),
            }

            this.doctorService.casetemplet(params).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.btnCanEdit = false;
                }else{
                    this.toastTab('模板创建成功', '');
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
            }

            this.doctorService.updatecasetemplet(JSON.parse(sessionStorage.getItem('casetemplet')).id, updateParams).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.btnCanEdit = false;
                }else{
                    this.toastTab('模板修改成功', '');
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
