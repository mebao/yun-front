import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

@Component({
    selector: 'app-doctor-tcm-list',
    templateUrl: './doctor-tcm-list.html',
    styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class DoctorTcmList{
	topBar: {
		title: string,
		back: boolean,
	};
    doctorId: string;
    url: string;
    searchInfo: {
        name: string,
    }
    loadingShow: boolean;
    hasData: boolean;
    docTcmList: any[];

    constructor(
        private as: AdminService,
        private _message: NzMessageService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '中药处方列表',
            back: true,
        }
        this.doctorId = '';
        this.route.queryParams.subscribe((params) => {
            this.doctorId = params.id;
        });
        this.url = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId
            + '&doctor_id=' + this.doctorId;
        this.searchInfo = {
            name: '',
        }
        this.loadingShow = false;
        this.hasData = false;

        this.search();
    }

    search() {
        this.loadingShow = true;
        var urlOptions = this.url;
        if(this.searchInfo.name != '') {
            urlOptions += '&name=' + this.searchInfo.name;
        }
        this.getData(urlOptions);
    }

    getData(urlOptions) {
        this.as.searchpotcm(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.docTcmList = results.list;
                this.loadingShow = false;
                this.hasData = true;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    add() {
        this.router.navigate(['./admin/doctor/tcm'], {queryParams: {id: this.doctorId}});
    }

    update(docTcm) {
        this.router.navigate(['./admin/doctor/tcm'], {queryParams: {id: this.doctorId, docTcmId: docTcm.id}});
    }
}
