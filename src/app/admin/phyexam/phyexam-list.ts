import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../admin.service';

@Component({
    selector: 'app-phyexam-list',
    templateUrl: './phyexam-list.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})

export class PhyexamList {
    topBar: {
        title: string,
        back: boolean,
    };
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
	}
    loadingShow: boolean;
    hasData: boolean;
    phyexamList: any[];
    searchInfo: {
        name: string,
    }

    constructor(
        private router: Router,
        private _message: NzMessageService,
        private as: AdminService,
    ) { }

    ngOnInit() {
        this.topBar = {
            title: '体检套餐管理',
            back: false,
        }

		//权限
		this.moduleAuthority = {
			see: false,
			edit: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if (this.as.getUser().role == '0' || this.as.getUser().role == '9') {
			for (var key in this.moduleAuthority) {
				this.moduleAuthority[key] = true;
			}
		} else {
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for (var i = 0; i < authority.infos.length; i++) {
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

        this.loadingShow = false;
        this.hasData = false;
        this.phyexamList = [];
        this.searchInfo = {
            name: '',
        }

        this.search();
    }
    
    add() {
        this.router.navigate(['./admin/phyexam']);
    }
    
    search() {
        this.loadingShow = true;
        var urlOptions = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        if(this.searchInfo.name != ''){
            urlOptions += '&name=' + this.searchInfo.name;
        }
        this.getPhyexamList(urlOptions);
    }

    getPhyexamList(urlOptions) {
        this.as.searchphypage(urlOptions).then((data) => {
            this.loadingShow = false;
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.hasData = true;
                this.phyexamList = results.list;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }
}
