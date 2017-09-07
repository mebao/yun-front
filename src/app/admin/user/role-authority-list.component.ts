import { Component }                           from '@angular/core';
import { Router, ActivatedRoute }              from '@angular/router';

import { AdminService }                        from '../admin.service';

@Component({
    selector: 'admin-role-authority-list',
    templateUrl: './role-authority-list.component.html',
})
export class RoleAuthorityListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    id: string;

    constructor(
        public adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

	ngOnInit(): void {
		this.topBar = {
			title: '角色权限',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });

        var urlOptions = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&role_id=' + this.id;
        this.adminService.authoritylist(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
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
