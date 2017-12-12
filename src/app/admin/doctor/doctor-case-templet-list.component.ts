import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';
import { DoctorService }                     from './doctor.service';

@Component({
    selector: 'doctor-case-templet-list',
    templateUrl: './doctor-case-templet-list.component.html',
})

export class DoctorCaseTempletListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type: string,
	};
	loadingShow: boolean;
    id: string;
    hasData: boolean;
    casetempletList: any[];

    constructor(
        public adminService: AdminService,
        public doctorService: DoctorService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.topBar = {
			title: '病历模板列表',
			back: true,
		}
		this.loadingShow = true;

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });

        this.hasData = false;
        this.casetempletList = [];

        this.getData();
    }

    getData() {
        var url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&doctor_id=' + this.id;
        this.doctorService.searchcasetemplet(url).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.casetempletList = results.list;
                this.hasData = true;
		        this.loadingShow = false;
            }
        });
    }

    add() {
        this.router.navigate(['./admin/doctorCaseTemplet'], {queryParams: {id: this.id, type: 'create'}});
    }

    update(casetemplet) {
        sessionStorage.setItem('casetemplet', JSON.stringify(casetemplet));
        this.router.navigate(['./admin/doctorCaseTemplet'], {queryParams: {id: this.id, type: 'update'}});
    }

    updateStatus(id, status) {
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            status: status == '1' ? '0' : '1',
        }

        this.doctorService.casetempletstatus(id, params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                this.toastTab('状态修改成功', '');
                this.getData();
            }
        });
    }

	toastTab(text, type) {
		this.toast = {
			show: 1,
			text: text,
			type: type,
		}
		setTimeout(() => {
	    	this.toast = {
				show: 0,
				text: '',
				type: '',
			}
	    }, 2000);
	}
}
