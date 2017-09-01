import { Component }                       from '@angular/core';
import { Router, ActivatedRoute }          from '@angular/router';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-child-info',
	templateUrl: './child-info.component.html',
	styleUrls: ['./child-info.component.scss'],
})
export class ChildInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	userInfo: {
		id: string,
		name: string,
		mobile: string,
		gender: string,
	}
	childInfo: {
		age: string,
		birthday: string,
		bloodType: string,
		bloodTypeText: string,
		childId: string,
		childName: string,
		gender: string,
		headCircum: string,
		height: string,
		horoscope: string,
		horoscopeText: string,
		imageUrl: string,
		isDefault: string,
		legLength: string,
		nickName: string,
		shengxiao: string,
		shengxiaoText: string,
		weight: string,
	}
	otherChildList: any[];
	url: string;
	selectTab: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '病人库',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.userInfo = {
			id: '',
			name: '',
			mobile: '',
			gender: '',
		}
		this.childInfo = {
			age: '',
			birthday: '',
			bloodType: '',
			bloodTypeText: '',
			childId: '',
			childName: '',
			gender: '',
			headCircum: '',
			height: '',
			horoscope: '',
			horoscopeText: '',
			imageUrl: '',
			isDefault: '',
			legLength: '',
			nickName: '',
			shengxiao: '',
			shengxiaoText: '',
			weight: '',
		};
		this.otherChildList = [];

		this.selectTab = '1';

		this.route.queryParams.subscribe((params) => {
			this.childInfo.childId = params.id;
		});

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		var urlOptions = this.url + '&childs=1&child_id=' + this.childInfo.childId;
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					this.userInfo = {
						id: results.users[0].id,
						name: results.users[0].name,
						mobile: results.users[0].mobile,
						gender: results.users[0].gender,
					}
					if(results.users[0].childs.length > 0){
						for(var i = 0; i < results.users[0].childs.length; i++){
							if(this.childInfo.childId == results.users[0].childs[i].childId){
								this.childInfo = results.users[0].childs[i];
							}else{
								this.otherChildList.push(results.users[0].childs[i]);
							}
						}
					}
				}
				console.log(this.userInfo);
				console.log(this.childInfo);
				console.log(this.otherChildList);
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