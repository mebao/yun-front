import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

@Component({
    selector: 'app-medical-tcm-list',
    templateUrl: './tcm-list.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class TcmList{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
		seePut: boolean,
		seeHas: boolean,
		seeLost: boolean,
		seeCheck: boolean,
	}
    url: string;
    searchInfo: {
        name: string,
        name_code: string,
    }
    loadingShow: boolean;
    hasData: boolean;
    tcmList: any[];

    constructor(
        private as: AdminService,
        private _message: NzMessageService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '中药管理',
            back: false,
        }

		this.moduleAuthority = {
			see: false,
			edit: false,
			seePut: false,
			seeHas: false,
			seeLost: false,
			seeCheck: false,
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

		if(JSON.parse(sessionStorage.getItem('search-tcmList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-tcmList'));
		}else{
            this.searchInfo = {
                name: '',
                name_code: '',
            }
		}
        this.loadingShow = false;
        this.hasData = false;

        this.search();
    }

    search() {
        this.loadingShow = true;
		sessionStorage.setItem('search-tcmList', JSON.stringify(this.searchInfo));
        var urlOptions = this.url;
        if(this.searchInfo.name != '') {
            urlOptions += '&name=' + this.searchInfo.name;
        }
        if(this.searchInfo.name_code != '') {
            urlOptions += '&name_code=' + this.searchInfo.name_code;
        }
        this.getData(urlOptions);
    }

    getData(urlOptions) {
        this.as.searchtcm(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.tcmList = results.tcmlist;
                this.loadingShow = false;
                this.hasData = true;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    add() {
        this.router.navigate(['./admin/medical/tcm'], {queryParams: {from: 'list'}});
    }

    update(tcm) {
        this.router.navigate(['./admin/medical/tcm'], {queryParams: {id: tcm.id, from: 'list'}});
    }

    goUrl(_url) {
        sessionStorage.removeItem('search-tcmPurchaseList')
        sessionStorage.removeItem('search-tcmHasList');
        sessionStorage.removeItem('search-tcmLostList');
        sessionStorage.removeItem('search-tcmCheckList')
        this.router.navigate([_url]);
    }
}
