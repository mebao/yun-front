import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../admin.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'admin-medical-check-list',
    templateUrl: './medical-check-list.component.html',
    styleUrls: ['../../../../assets/css/ant-common.scss'],
})
export class MedicalCheckListComponent {
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
        seeCheck: boolean,
        addCheck: boolean,
    }
    loadingShow: boolean;
    selectedIndex: number;
    url: string;
    stockList: any[];
    hasData: boolean;
    searchInfo: {
        name: string,
        type: string,
        date: [Date, Date]
    }

    constructor(
        private message: NzMessageService,
        public adminService: AdminService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.topBar = {
            title: '药房管理',
            back: true,
        }

        this.moduleAuthority = {
            see: false,
            seePut: false,
            seeHas: false,
            seeLost: false,
            seeCheck: false,
            addCheck: false,
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
        if (this.moduleAuthority.seeLost) {
            this.selectedIndex++;
        }

        this.loadingShow = false;

        this.url = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.searchInfo = {
            name: '',
            type: '1,2',
            date: [null, null]
        }
        const sessionSearch = JSON.parse(sessionStorage.getItem('search-medicalCheckList'));
        if (sessionSearch) {
            this.searchInfo = {
                name: sessionSearch.name,
                type: sessionSearch.type,
                date: [sessionSearch.date[0] ? new Date(sessionSearch.date[0]) : null, sessionSearch.date[1] ? new Date(sessionSearch.date[1]) : null],
            }
        }

        this.stockList = [];
        this.hasData = false;
        this.search();
    }

    goUrl(_url) {
        this.loadingShow = true;
        sessionStorage.removeItem('search-medicalList');
        sessionStorage.removeItem('search-medicalPurchaseList');
        sessionStorage.removeItem('search-medicalHasList');
        sessionStorage.removeItem('search-medicalLostList');
        this.router.navigate([_url]);
    }

    add() {
        this.router.navigate(['./admin/medical/check']);
    }

    search() {
        this.loadingShow = true;
        sessionStorage.setItem('search-medicalCheckList', JSON.stringify(this.searchInfo));
        var urlOptions = this.url;
        if (this.searchInfo.name != '') {
            urlOptions += '&name=' + this.searchInfo.name;
        }
        if (this.searchInfo.type != '') {
            urlOptions += '&type=' + this.searchInfo.type;
        }
        if (this.searchInfo.date[0]) {
            urlOptions += '&b_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date[0]));
        }
        if (this.searchInfo.date[1]) {
            urlOptions += '&l_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date[1]));
        }

        this.getData(urlOptions);
    }

    getData(urlOptions) {
        this.adminService.searchstock(urlOptions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this.message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                if (results.list.length > 0) {
                    for (var i = 0; i < results.list.length; i++) {
                        results.list[i].deviation = Number(results.list[i].realityStock) - Number(results.list[i].stock);
                    }
                }
                this.stockList = results.list;
                this.hasData = true;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this.message.error('服务器错误');
        });
    }

    update(medical) {
        sessionStorage.setItem('medicalCheck', JSON.stringify(medical));
        this.router.navigate(['./admin/medical/check'], { queryParams: { id: medical.id } });
    }
}
