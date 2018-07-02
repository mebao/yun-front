import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../admin.service';
import { config } from '../../../config';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-medical-has-list',
    templateUrl: './medical-has-list.component.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})
export class MedicalHasListComponent {
    topBar: {
        title: string,
        back: boolean,
    };

    // 权限
    moduleAuthority: {
        see: boolean,
        seePut: boolean,
        seeHas: boolean,
        editHas: boolean,
        seeLost: boolean,
        seeCheck: boolean,
    }
    selectedIndex: number;
    loadingShow: boolean;
    hasData: boolean;
    list: any[];
    url: string;
    searchInfo: {
        name: string,
        type: string,
        l_stock: string,
        b_stock: string,
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
            editHas: false,
            seeLost: false,
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

        this.loadingShow = false;
        this.hasData = false;
        this.list = [];

        if (JSON.parse(sessionStorage.getItem('search-medicalHasList'))) {
            this.searchInfo = JSON.parse(sessionStorage.getItem('search-medicalHasList'));
        } else {
            this.searchInfo = {
                name: '',
                type: '1,2',
                l_stock: '',
                b_stock: '',
            }
        }

        this.url = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.search();
    }

    getData(urlOptions) {
        this.adminService.searchsupplies(urlOptions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this.message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                if (results.list.length > 0) {
                    for (var i = 0; i < results.list.length; i++) {
                        if (results.list[i].others.length) {
                            for (var j = 0; j < results.list[i].others.length; j++) {
                                results.list[i].others[j].expiringDate = results.list[i].others[j].expiringDate ? this.adminService.dateFormat(results.list[i].others[j].expiringDate) : '';
                            }
                        }
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
        sessionStorage.setItem('search-medicalHasList', JSON.stringify(this.searchInfo));
        var urlOptions = this.url;
        if (this.searchInfo.name != '') {
            urlOptions += '&name=' + this.searchInfo.name;
        }
        if (this.searchInfo.type != '') {
            urlOptions += '&type=' + this.searchInfo.type;
        }
        if (this.searchInfo.l_stock && this.searchInfo.l_stock != '') {
            urlOptions += '&l_stock=' + this.searchInfo.l_stock;
        }
        if (this.searchInfo.b_stock && this.searchInfo.b_stock != '') {
            urlOptions += '&b_stock=' + this.searchInfo.b_stock;
        }
        this.getData(urlOptions);
    }

    export() {
        var urlOptions = this.url;
        urlOptions += '&stockType=1';
        if (this.searchInfo.name != '') {
            urlOptions += '&name=' + this.searchInfo.name;
        }
        if (this.searchInfo.type != '') {
            urlOptions += '&type=' + this.searchInfo.type;
        }
        if (this.searchInfo.l_stock && this.searchInfo.l_stock != '') {
            urlOptions += '&l_stock=' + this.searchInfo.l_stock;
        }
        if (this.searchInfo.b_stock && this.searchInfo.b_stock != '') {
            urlOptions += '&b_stock=' + this.searchInfo.b_stock;
        }
        window.location.href = config.baseHTTP + '/mebcrm/stockexport' + urlOptions;
    }

    goUrl(_url) {
        this.loadingShow = true;
        sessionStorage.removeItem('search-medicalList');
        sessionStorage.removeItem('search-medicalPurchaseList');
        sessionStorage.removeItem('search-medicalLostList');
        sessionStorage.removeItem('search-medicalCheckList');
        this.router.navigate([_url]);
    }

    update(_id) {
        this.router.navigate(['./admin/medical/has'], { queryParams: { id: _id } });
    }

}
