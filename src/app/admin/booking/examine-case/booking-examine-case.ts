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
    }
    caseList: any[];
    hasData: boolean;

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
        this.searchInfo = {
            child_name: '',
            doctor_name: '',
            check: '1',
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
        this.getData(urlOptions);
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
