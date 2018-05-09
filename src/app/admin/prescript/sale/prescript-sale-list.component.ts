import { Component, OnInit }                         from '@angular/core';
import { Router }                                    from '@angular/router';

import { NzMessageService }                          from 'ng-zorro-antd';

import { AdminService }                              from '../../admin.service';

@Component({
	selector: 'app-prescript-sale-list',
	templateUrl: './prescript-sale-list.component.html',
	styles: [ `
		.ant-form-item-label label:after{
		    display: none;
		}
	`
  	]
})
export class PrescriptSaleListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		seeBack: boolean,
		seeSale: boolean,
		editSale: boolean,
		seeTcm: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	saleList: any[];
	url: string;
    searchInfo: {
        mobile: string,
        admin_name: string,
    }
	_date = null;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '药方列表',
			back: false,
		}

		this.moduleAuthority = {
			see: false,
			seeBack: false,
			seeSale: false,
			editSale: false,
			seeTcm: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.loadingShow = false;

        this.hasData = false;
        this.saleList = [];
        this.searchInfo = {
            mobile: '',
            admin_name: '',
        }
		this._date = new Date();

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search();
	}

	search() {
		this.loadingShow = true;
		var urlOptions = this.url + '&typelist=1,2';
		if(this.searchInfo.mobile != ''){
			urlOptions += ('&mobile=' + this.searchInfo.mobile);
		}
        if(this._date){
            urlOptions += '&day=' + this.adminService.getDayByDate(new Date(this._date));
        }
		if(this.searchInfo.admin_name != ''){
			urlOptions += ('&admin_name=' + this.searchInfo.admin_name);
		}
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchdrugretail(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].date = results.list[i].date.replace('-', '年');
						results.list[i].date = results.list[i].date.replace('-', '月');
						results.list[i].date = results.list[i].date.replace(' ', '日 ');
						results.list[i].infoLength = results.list[i].info.length;
					}
				}
				this.saleList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}
}
