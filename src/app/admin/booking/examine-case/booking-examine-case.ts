import { Component }                   from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';

import { AdminService }                from '../../admin.service';

import { ToastService }                from '../../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }      from '../../../common/nll-toast/toast-model';

@Component({
    selector: 'admin-booking-examine-case',
    templateUrl: './booking-examine-case.html',
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
        b_time: string,
		b_time_text: string,
		b_time_num: number,
		l_time: string,
		l_time_text: string,
		l_time_num: number,
    }
    caseList: any[];
    hasData: boolean;
	moduleAuthority:  {
		editCaseAgain: boolean,
	}

    constructor(
        private adminService: AdminService,
        private toastService: ToastService,
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
            b_time: todayDate,
			b_time_text: this.adminService.dateFormat(todayDate),
			b_time_num: new Date(todayDate).getTime(),
			l_time: todayDate,
			l_time_text: this.adminService.dateFormat(todayDate),
			l_time_num: new Date(todayDate).getTime(),
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
        if(this.searchInfo.b_time != ''){
			urlOptions += '&b_time=' + this.searchInfo.b_time;
		}
		if(this.searchInfo.l_time != ''){
			urlOptions += '&l_time=' + this.searchInfo.l_time;
		}
        if(this.searchInfo.service_name != ''){
			urlOptions += '&service_name=' + this.searchInfo.service_name;
		}
        this.getData(urlOptions);
    }

    // 选择时间
	changeDate(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
	}

    getData(urlOptions) {
        this.loadingShow = true;
        this.adminService.searchcasehistory(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
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
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
            this.toastService.toast(toastCfg);
        });
    }

    examine(value) {
        this.router.navigate(['./admin/docbooking/casehistory'], {queryParams: {id: value.bookingId, doctorId: value.bookingDoctorId, pageType: 'examine'}});
    }
}
