import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';
import { config } from '../../../config';

@Component({
    selector: 'app-medical-tcm-has-list',
    templateUrl: './tcm-has-list.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class TcmHasList{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority:  {
		see: boolean,
		seePut: boolean,
		seeHas: boolean,
        editHas: boolean
		seeLost: boolean,
		seeCheck: boolean,
	}
    selectedIndex: number;
    url: string;
    searchInfo: {
        name: string,
        name_code: string,
    }
    loadingShow: boolean;
    hasData: boolean;
    tcmPurchaseList: any[];

    constructor(
        private as: AdminService,
        private _message: NzMessageService,
        private router: Router,
    ) {}

	ngOnInit() {
		this.topBar = {
			title: '中药管理',
			back: true,
		}

		this.moduleAuthority = {
			see: false,
			seePut: false,
			seeHas: false,
            editHas: false,
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
        this.selectedIndex = 0;
        if(this.moduleAuthority.see){
            this.selectedIndex++;
        }
        if(this.moduleAuthority.seePut){
            this.selectedIndex++;
        }

		this.url = '?username=' + this.as.getUser().username
			+ '&token=' + this.as.getUser().token
			+ '&clinic_id=' + this.as.getUser().clinicId;
		this.loadingShow = false;
		this.hasData = false;
		this.tcmPurchaseList = [];

		if(JSON.parse(sessionStorage.getItem('search-tcmHasList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-tcmHasList'));
		}else{
    		this.searchInfo = {
                name: '',
                name_code: '',
            }
		}

		this.search();
	}

	getData(urlOptions) {
		this.as.searchtcm(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
                this._message.error(data.status);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.tcmPurchaseList = results.tcmlist;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-tcmHasList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		if(this.searchInfo.name_code != ''){
			urlOptions += '&name_code=' + this.searchInfo.name_code;
		}
		this.getData(urlOptions);
	}

	update(_id) {
		this.router.navigate(['./admin/medical/tcm'], {queryParams: {id: _id, from: 'hasList'}});
	}

    goUrl(_url) {
        sessionStorage.removeItem('search-tcmList')
        sessionStorage.removeItem('search-tcmPurchaseList')
        sessionStorage.removeItem('search-tcmLostList');
        sessionStorage.removeItem('search-tcmCheckList');
        this.router.navigate([_url]);
    }

    export() {
        var urlOptions = this.url;
        if(this.searchInfo.name != ''){
            urlOptions += '&name=' + this.searchInfo.name;
        }
        if(this.searchInfo.name_code != ''){
            urlOptions += '&name_code=' + this.searchInfo.name_code;
        }
        window.location.href = config.baseHTTP + '/mebcrm/tcmexport'+ urlOptions;
    }
}
