import { Component }                  from '@angular/core';
import { Router, ActivatedRoute }     from '@angular/router';

import { AdminService }               from '../admin.service';

@Component({
    selector: 'admin-inspect-results-print',
    templateUrl: './inspect-results-print.html',
    styleUrls: ['./inspect-results-print.scss']
})

export class InspectResultsPrint{
    toast: {
        show: number,
        text: string,
        type:  string,
    };
    id: string;
    checkList: any[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public adminService: AdminService,
    ) {}

    ngOnInit() {
        this.toast = {
            show: 0,
            text: '',
            type:  '',
        };

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });

    	var urlOptions = '?username=' + this.adminService.getUser().username
    		 + '&token=' + this.adminService.getUser().token
    		 + '&clinic_id=' + this.adminService.getUser().clinicId
    		 + '&id=' + this.id
    		 + '&today=1';

        this.checkList = [];
    	this.adminService.usercheckprojects(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.checkList = results.list;
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
