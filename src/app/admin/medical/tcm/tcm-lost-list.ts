import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

@Component({
    selector: 'app-medical-tcm-lost-list',
    templateUrl: './tcm-lost-list.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class TcmLostList{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority:  {
		see: boolean,
		seePut: boolean,
		seeHas: boolean,
		seeLost: boolean,
        editLost: boolean,
		seeCheck: boolean,
	}
    selectedIndex: number;
    url: string;
    _startDate = null;
    _endDate = null;
    loadingShow: boolean;
    hasData: boolean;
    tcmLostList: any[];

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
			seeLost: false,
            editLost: false,
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
        if(this.moduleAuthority.seeHas){
            this.selectedIndex++;
        }

		this.url = '?username=' + this.as.getUser().username
			+ '&token=' + this.as.getUser().token
			+ '&clinic_id=' + this.as.getUser().clinicId
            + '&type=5';
        this._startDate = new Date();
        this._endDate = new Date();
		this.loadingShow = false;
		this.hasData = false;
		this.tcmLostList = [];

        var sessionSearch = JSON.parse(sessionStorage.getItem('search-tcmLostList'));
		if(sessionSearch){
            this._startDate = sessionSearch._startDate ? new Date(sessionSearch._startDate) : null;
            this._endDate = sessionSearch._endDate ? new Date(sessionSearch._endDate) : null;
		}else{
            this._startDate = new Date();
            this._endDate = new Date();
		}

		this.search();
	}

	getData(urlOptions) {
		this.as.searchmslost(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
                this._message.error(data.status);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.tcmLostList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-tcmLostList', JSON.stringify({
            _startDate: this._startDate ? this.as.getDayByDate(new Date(this._startDate)) : null,
            _endDate: this._endDate ? this.as.getDayByDate(new Date(this._endDate)) : null,
        }));
		var urlOptions = this.url;
        if(this._startDate){
            urlOptions += '&b_date=' + this.as.getDayByDate(new Date(this._startDate));
        }
        if(this._endDate){
            urlOptions += '&l_date=' + this.as.getDayByDate(new Date(this._endDate));
        }
		this.getData(urlOptions);
	}

    _disabledStartDate = (startValue) => {
        if (!startValue || !this._endDate) {
            return false;
        }
        return startValue.getTime() > this._endDate.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this._startDate) {
            return false;
        }
        return endValue.getTime() < this._startDate.getTime();
    };

    addLost() {
        this.router.navigate(['./admin/medical/tcm/lost']);
    }

	update(_id) {
		this.router.navigate(['./admin/medical/tcm'], {queryParams: {id: _id, from: 'hasList'}});
	}

    goUrl(_url) {
        sessionStorage.removeItem('search-tcmList');
        sessionStorage.removeItem('search-tcmPurchaseList');
        sessionStorage.removeItem('search-tcmHasList');
        sessionStorage.removeItem('search-tcmCheckList');
        this.router.navigate([_url]);
    }
}
