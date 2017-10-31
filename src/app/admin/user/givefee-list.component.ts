import { Component }                              from '@angular/core';

import { AdminService }                           from '../admin.service';

@Component({
    selector: 'admin-givefee-list',
    templateUrl: 'givefee-list.component.html'
})

export class GivefeeListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    givefeeList: any[];
    hasData: boolean;

    constructor(
        public adminService: AdminService,
    ) {}

	ngOnInit() {
		this.topBar = {
			title: '减免金额记录',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

        this.givefeeList = [];
        this.hasData = false;

        var url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;
        this.adminService.searchwaiverauthnotes(url).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.givefeeList = results.list;
                this.hasData = true;
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