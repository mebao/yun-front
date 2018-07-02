import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../admin.service';

@Component({
    selector: 'app-prescript-tcm-list',
    templateUrl: './prescript-tcm-list.html',
    styleUrls: ['../../../assets/css/ant-common.scss']
})

export class PrescriptTcmList{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
		seeBack: boolean,
		seeSale: boolean,
        editTcm: boolean,
	}
    url: string;
	searchInfo: {
		isout: string,
		today: string,
		doctor_name: string,
		user_name: string,
        child_name: string,
        date: [Date, Date],
	};
    loadingShow: boolean;
    hasData: boolean;
    prescriptTcmList: any[];
    outTcm: {
        tab: boolean,
        prescript: any,
    }
    validateForm: FormGroup;
    isLoadingSave: boolean;

    constructor(
        private as: AdminService,
        private _message: NzMessageService,
        private router: Router,
        private fb: FormBuilder,
    ) {
        this.validateForm = this.fb.group({
            one_num: [ '', [ Validators.required ]],
            one_unit: [ '', [ Validators.required ]],
            usage: [ '温水冲服' ],
        });
    }

    ngOnInit() {
        this.topBar = {
            title: '中药处方列表',
            back: true,
        }

		this.moduleAuthority = {
			see: false,
			edit: false,
			seeBack: false,
			seeSale: false,
            editTcm: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.as.getUser().role == '0' || this.as.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

        this.url = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;

 		this.searchInfo = {
 			isout: '1',
 			today: '',
 			doctor_name: '',
 			user_name: '',
            child_name: '',
            date: [new Date(), new Date()]
 		}
        this.loadingShow = false;
        this.hasData = false;
        this.prescriptTcmList = [];
        this.search();
        this.outTcm = {
            tab: false,
            prescript: {},
        }
        this.isLoadingSave = false;
    }

    goUrl(_url) {
        this.router.navigate([_url]);
    }

    search() {
        this.loadingShow = true;
        var urlOptions = this.url;
        if(this.searchInfo.isout != ''){
            urlOptions += ('&isout=' + this.searchInfo.isout);
        }
        if(this.searchInfo.today != ''){
            urlOptions += ('&today=' + this.searchInfo.today);
        }
        if(this.searchInfo.date[0]){
            urlOptions += '&b_time=' + this.as.getDayByDate(new Date(this.searchInfo.date[0]));
        }
        if(this.searchInfo.date[1]){
            urlOptions += '&l_time=' + this.as.getDayByDate(new Date(this.searchInfo.date[1]));
        }
        if(this.searchInfo.doctor_name != ''){
            urlOptions += ('&doctor_name=' + this.searchInfo.doctor_name);
        }
        if(this.searchInfo.user_name != ''){
            urlOptions += ('&user_name=' + this.searchInfo.user_name);
        }
        if(this.searchInfo.child_name != ''){
            urlOptions += ('&child_name=' + this.searchInfo.child_name);
        }
        this.getData(urlOptions);
    }

    getData(urlOptions) {
        this.as.searchtcmprescript(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.prescriptTcmList = results.list;
                this.loadingShow = false;
                this.hasData = true;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    selectPrescript(prescript) {
        this.outTcm = {
            tab: true,
            prescript: prescript,
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    okOutTcm = (e) => {
        this.isLoadingSave = true;
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            one_num: this.validateForm.controls.one_num.value,
            one_unit: this.validateForm.controls.one_unit.value,
            usage: this.validateForm.controls.usage.value,
        }
        this.as.outtcmp(this.outTcm.prescript.id, params).then((data) => {
            if(data.status == 'no'){
                this.isLoadingSave = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('出药成功');
                this.outTcm.tab = false;
                this.search();
            }
        }).catch(() => {
            this.isLoadingSave = false;
            this._message.error('服务器错误');
        });
    }

    cancelOutTcm = (e) => {
        this.outTcm.tab = false;
    }

    // update(docTcm) {
    //     this.router.navigate(['./admin/doctor/tcm'], {queryParams: {id: this.doctorId, docTcmId: docTcm.id}});
    // }
}
