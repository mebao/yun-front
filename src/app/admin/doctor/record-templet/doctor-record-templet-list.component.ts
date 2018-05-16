import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { NzMessageService }                  from 'ng-zorro-antd';

import { AdminService }                      from '../../admin.service';
import { DoctorService }                     from './../doctor.service';

@Component({
    selector: 'doctor-record-templet-list',
    templateUrl: './doctor-record-templet-list.component.html',
})

export class DoctorRecordTempletListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
    id: string;
    hasData: boolean;
    recordtempletList: any[];

    constructor(
        private _message: NzMessageService,
        public adminService: AdminService,
        public doctorService: DoctorService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

	ngOnInit() {
		this.topBar = {
			title: '儿保记录模板列表',
			back: true,
		}
		this.loadingShow = true;

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });

        this.hasData = false;
        this.recordtempletList = [];

        this.getData();
    }

    getData() {
        var url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&doctor_id=' + this.id;
        this.doctorService.searchrecordtemplet(url).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.recordtempletList = results.list;
                this.hasData = true;
		        this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    add() {
        this.router.navigate(['./admin/doctor/recordTemplet'], {queryParams: {id: this.id, type: 'create'}});
    }

    update(recordtemplet) {
        sessionStorage.setItem('recordtemplet', JSON.stringify(recordtemplet));
        this.router.navigate(['./admin/doctor/recordTemplet'], {queryParams: {id: this.id, type: 'update'}});
    }

    updateStatus(id, status) {
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            status: status == '1' ? '0' : '1',
        }

        this.doctorService.recordtempletstatus(id, params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                this._message.success('状态修改成功');
                this.getData();
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }
}
