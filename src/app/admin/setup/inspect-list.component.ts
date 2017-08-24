import { Component, OnInit }               from '@angular/core';
import { Router, ActivatedRoute }          from '@angular/router';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-setup-inspect-list',
	templateUrl: './inspect-list.component.html',
})
export class SetupInspectListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	projectlist: any[];

	constructor(
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '检查项目列表',
			back: true,
		}

		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		//获取检查项目列表
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.checkprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.projectlist = results.list;
			}
		});
	}

	add() {
		this.router.navigate(['./admin/setupInspect']);
	}

	update(project) {
		sessionStorage.setItem('inspect', JSON.stringify(project));
		this.router.navigate(['./admin/setupInspect'], {queryParams: {id: project.id}});
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