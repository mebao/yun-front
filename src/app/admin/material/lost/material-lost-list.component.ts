import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../admin.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-material-lost-list',
    templateUrl: './material-lost-list.component.html',
    styleUrls: ['../../../../assets/css/ant-common.scss'],
})
export class MaterialLostListComponent {
    topBar: {
        title: string,
        back: boolean,
    };
    // 权限
    moduleAuthority: {
        see: boolean,
        seePut: boolean,
        seeHas: boolean,
        seeLost: boolean,
        editLost: boolean,
        seeCheck: boolean,
    }
    selectedIndex: number;
    searchInfo: {
        date_big: Date,
        date_less: Date,
        type: string;
    }
    loadingShow: boolean;
    hasData: boolean;
    list: any[];
    url: string;


    constructor(
        private message: NzMessageService,
        public adminService: AdminService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.topBar = {
            title: '物资管理',
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
        if (this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9') {
            for (var key in this.moduleAuthority) {
                this.moduleAuthority[key] = true;
            }
        } else {
            var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
            for (var i = 0; i < authority.infos.length; i++) {
                this.moduleAuthority[authority.infos[i].keyName] = true;
            }
        }

        this.selectedIndex = 0;
        if (this.moduleAuthority.see) {
            this.selectedIndex++;
        }
        if (this.moduleAuthority.seePut) {
            this.selectedIndex++;
        }
        if (this.moduleAuthority.seeHas) {
            this.selectedIndex++;
        }

        this.loadingShow = false;
        this.hasData = false;
        this.list = [];

        this.searchInfo = {
            date_big: null,
            date_less: null,
            type: '3,4',
        }
        const sessionSearch = JSON.parse(sessionStorage.getItem('search-materialLostList'));
        if (sessionSearch) {
            this.searchInfo = {
                date_big: sessionSearch.date_big ? new Date(sessionSearch.date_big) : null,
                date_less: sessionSearch.date_less ? new Date(sessionSearch.date_less) : null,
                type: sessionSearch.type
            }
        }

        this.url = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.search();
    }

    getData(urlOptions) {
        this.adminService.searchmslost(urlOptions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this.message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                if (results.list.length > 0) {
                    for (var i = 0; i < results.list.length; i++) {
                        results.list[i].infoLength = results.list[i].info.length;
                    }
                }
                this.list = results.list;
                this.hasData = true;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this.message.error('服务器错误');
        });
    }

    search() {
        this.loadingShow = true;
        sessionStorage.setItem('search-materialLostList', JSON.stringify(this.searchInfo));
        var urlOptions = this.url;
        if (this.searchInfo.date_big) {
            urlOptions += '&b_date=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_big));
        }
        if (this.searchInfo.date_less) {
            urlOptions += '&l_date=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_less));
        }
        if (this.searchInfo.type != '') {
            urlOptions += '&type=' + this.searchInfo.type;
        }
        this.getData(urlOptions);
    }

    _disabledStartDate = (startValue) => {
        if (!startValue || !this.searchInfo.date_less) {
            return false;
        }
        return startValue.getTime() > this.searchInfo.date_less.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this.searchInfo.date_big) {
            return false;
        }
        return endValue.getTime() < this.searchInfo.date_big.getTime();
    };

    goUrl(_url) {
        this.loadingShow = true;
        sessionStorage.removeItem('search-materialList');
        sessionStorage.removeItem('search-materialPurchaseList');
        sessionStorage.removeItem('search-materialHasList');
        sessionStorage.removeItem('search-materialCheckList');
        this.router.navigate([_url]);
    }
}
