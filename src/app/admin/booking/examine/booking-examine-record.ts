import { Component }                   from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';

import { NzMessageService }            from 'ng-zorro-antd';

import { AdminService }                from '../../admin.service';

@Component({
    selector: 'admin-booking-examine-record',
    templateUrl: './booking-examine-record.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class BookingExamineRecord{
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
        date_big: Date,
        date_less: Date,
    }
    recordList: any[];
    hasData: boolean;
	moduleAuthority:  {
		editHealthAgain: boolean,
	}

    constructor(
        private _message: NzMessageService,
        private adminService: AdminService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.topBar = {
    		title: '儿保记录审核',
    		back: false,
    	};
        var todayDate = this.adminService.getDayByDate(new Date());

		this.moduleAuthority = {
    		editHealthAgain: false,
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
            date_big: new Date(),
            date_less: new Date(),
        }
        this.recordList = [];
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
        if(this.searchInfo.date_big){
			urlOptions += '&b_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_big));
		}
		if(this.searchInfo.date_less){
			urlOptions += '&l_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_less));
		}
        if(this.searchInfo.service_name != ''){
			urlOptions += '&service_name=' + this.searchInfo.service_name;
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

    getData(urlOptions) {
        this.loadingShow = true;
        this.adminService.searchhealthrecord(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.list.length > 0){
                    for(var i = 0; i < results.list.length; i++){
                        results.list[i].checkDate = this.adminService.isFalse(results.list[i].checkDate) ? '' : this.adminService.dateFormat(results.list[i].checkDate);
                    }
                }
                this.recordList = results.list;
                this.hasData = true;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    examine(value) {
        this.router.navigate(['./admin/docbooking/healthrecord'], {queryParams: {id: value.bookingId, doctorId: value.bookingDoctorId, pageType: 'examine'}});
    }
}
