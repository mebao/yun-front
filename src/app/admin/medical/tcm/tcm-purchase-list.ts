import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

@Component({
    selector: 'app-medical-tcm-purchase-list',
    templateUrl: './tcm-purchase-list.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class TcmPurchaseList{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority:  {
		see: boolean,
		seePut: boolean,
		editPut: boolean,
		infoPut: boolean,
		seeHas: boolean,
		seeLost: boolean,
		seeCheck: boolean,
	}
    selectedIndex: number;
    url: string;
    _startDate = null;
    _endDate = null;
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
			editPut: false,
			infoPut: false,
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
        if(this.moduleAuthority.see) {
            this.selectedIndex = 1;
        }else{
            this.selectedIndex = 0;
        }

		this.url = '?username=' + this.as.getUser().username
			+ '&token=' + this.as.getUser().token
			+ '&clinic_id=' + this.as.getUser().clinicId
            + '&type=5';
		this.loadingShow = false;
		this.hasData = false;
		this.tcmPurchaseList = [];

        var sessionSearch = JSON.parse(sessionStorage.getItem('search-tcmPurchaseList'));
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
		this.as.purchaserecords(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
                this._message.error(data.status);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].aboutTime = !this.as.isFalse(results.list[i].aboutTime) ? this.as.dateFormat(results.list[i].aboutTime) : '';
						results.list[i].infoLength = results.list[i].info.length;
					}
				}
				this.tcmPurchaseList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-tcmPurchaseList', JSON.stringify({
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

    addPurchase() {
        this.router.navigate(['./admin/medical/tcm/purchase']);
    }

	update(_id) {
		this.router.navigate(['./admin/medical/tcm/purchase'], {queryParams: {id: _id}});
	}

    goUrl(_url) {
        sessionStorage.removeItem('search-tcmList');
        sessionStorage.removeItem('search-tcmHasList');
        sessionStorage.removeItem('search-tcmLostList')
        sessionStorage.removeItem('search-tcmCheckList')
        this.router.navigate([_url]);
    }
}
