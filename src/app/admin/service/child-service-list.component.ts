import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-child-service-list',
	templateUrl: './child-service-list.component.html'
})
export class ChildServiceListComponent implements OnInit{
	childServiceList: any[];
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	hasData: boolean;

	constructor(public adminService: AdminService, public router: Router) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};
		this.hasData = false;
		
		this.childServiceList = [];

		this.adminService.servicelist().then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.childServiceList = results.servicelist;
				this.hasData = true;
			}
		})
	}

	update(_id){
		this.router.navigate(['./admin/childService'], {queryParams: {id: _id}});
	}

	goCreate() {
		this.router.navigate(['./admin/childService']);
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