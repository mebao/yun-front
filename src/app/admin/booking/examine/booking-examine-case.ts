import { Component }                   from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';

import { NzMessageService }            from 'ng-zorro-antd';

import { AdminService }                from '../../admin.service';

@Component({
    selector: 'admin-booking-examine-case',
    templateUrl: './booking-examine-case.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class BookingExamineCase{
    topBar: {
        title: string,
        back: boolean,
    };
    loadingShow: boolean;
    searchInfo: {
        child_name: string,
        doctor_name: string,
        check: string,
        service_name:string,
        date: [Date, Date]
    }
    caseList: any[];
    hasData: boolean;
	moduleAuthority:  {
		editCaseAgain: boolean,
	}

    constructor(
        private _message: NzMessageService,
        private adminService: AdminService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.topBar = {
    		title: '病例审核',
    		back: false,
    	};
        var todayDate = this.adminService.getDayByDate(new Date());

		this.moduleAuthority = {
    		editCaseAgain: false,
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

        this.searchInfo = {
            child_name: '',
            doctor_name: '',
            check: '1',
            service_name:'',
            date: [new Date(), new Date()]
        }
        this.caseList = [];
        this.hasData = false;
        this.search();
    }

    search() {
        var urlOptions = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&clinic_id=' + this.adminService.getUser().clinicId;
        if(this.searchInfo.child_name && this.searchInfo.child_name != ''){
            urlOptions += '&child_name=' + this.searchInfo.child_name;
        }
        if(this.searchInfo.doctor_name && this.searchInfo.doctor_name != ''){
            urlOptions += '&booking_doctor_name=' + this.searchInfo.doctor_name;
        }
        if(this.searchInfo.check && this.searchInfo.check != ''){
            urlOptions += '&unchecked=' + this.searchInfo.check;
        }
        if(this.searchInfo.date[0]){
			urlOptions += '&b_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date[0]));
		}
		if(this.searchInfo.date[1]){
			urlOptions += '&l_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date[1]));
		}
        if(this.searchInfo.service_name != ''){
			urlOptions += '&service_name=' + this.searchInfo.service_name;
		}
        this.getData(urlOptions);
    }

    getData(urlOptions) {
        this.loadingShow = true;
        this.adminService.searchcasehistory(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.list.length > 0){
                    for(var i = 0; i < results.list.length; i++){
                        results.list[i].time = this.adminService.isFalse(results.list[i].time) ? '' : this.adminService.dateFormat(results.list[i].time);
                    }
                }
                this.caseList = results.list;
                this.hasData = true;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    examine(value) {
        this.router.navigate(['./admin/docbooking/casehistory'], {queryParams: {id: value.bookingId, doctorId: value.bookingDoctorId, pageType: 'examine'}});
    }
}
