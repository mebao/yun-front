import { Component }                    from '@angular/core';
import { ActivatedRoute, Router }        from '@angular/router';

import { AdminService }                 from '../admin.service';

@Component({
    selector: 'admin-authorize-givefee',
    templateUrl: 'authorize-givefee.component.html',
})

export class AuthorizeGivefeeComponent{
    toast: {
        show: number,
        text: string,
        type: string,
    };
    id: string;
    list: any[];
    modalConfirmTab: boolean;
    select: {
        text: string,
        results: string,
    }

    constructor(
        public adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.toast = {
    		show: 0,
    		text: '',
    		type: '',
    	};

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });
        this.modalConfirmTab = false;
        this.select = {
            text: '',
            results: '',
        }

        this.list = [];
        var url = this.id + '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token;
        this.adminService.searchwaiverauth(url).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.list = results;
            }
        });
    }

    authorize(_value) {
        this.modalConfirmTab = true;
        this.select = {
            text: (_value == '0' ? '不同意' : '同意') + '减免金额？',
            results: _value,
        }
    }

    closeConfirm() {
        this.modalConfirmTab = false;
    }

    confirm() {
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            wa_id: this.id,
            is_waiver: this.select.results,
        }

        this.modalConfirmTab = false;

        this.adminService.waiverauthnote(params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                this.toastTab('授权成功', '');
                setTimeout(() => {
                    this.router.navigate(['./admin/authorizeSuccess'], {queryParams: {layout: 'all'}});
                }, 2000);
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
