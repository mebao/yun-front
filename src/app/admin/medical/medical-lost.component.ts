import { Component, OnInit }                       from '@angular/core';
import { Router }                                  from '@angular/router';

import { AdminService }                            from '../admin.service';

@Component({
	selector: 'app-medical-lost',
	templateUrl: './medical-lost.component.html',
	styleUrls: ['./medical-lost.component.scss'],
})
export class MedicalLostComponent{
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	lostlist: any[];
	list: any[];
	lostInfo: {
		remark: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.lostlist = [];
		this.lostlist.push({key: 1, show: true, use: true});
		this.list = [];
		this.lostInfo = {
			remark: '',
		}

		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.searchsupplies(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.list = results.list;
			}
		})
	}

	showMs(_key) {
		if(this.lostlist.length > 0){
			for(var i = 0; i < this.lostlist.length; i++){
				if(this.lostlist[i].key == _key){
					this.lostlist[i].show = !this.lostlist[i].show;
				}
			}
		}
	}

	addMs() {
		this.lostlist.push({key: this.lostlist.length + 1, show: true, use: true});
	}

	deleteMs(_key) {
		if(this.lostlist.length > 0){
			for(var i = 0; i < this.lostlist.length; i++){
				if(this.lostlist[i].key == _key){
					this.lostlist[i].use = false;
				}
			}
		}
	}
	
	create(f) {
		var mslosts = [];
		var num = 0;
		var feeAll = 0;
		if(this.lostlist.length > 0){
			for(var i = 0; i < this.lostlist.length; i++){
				//判断可用
				if(this.lostlist[i].use){
					num++;
					var lost = {
						sinfo_id: '',
						num: '',
					};
					if(f.value['ms_' + this.lostlist[i].key] == ''){
						this.toastTab('第' + num + '条药单不可为空', 'error');
						return;
					}
					lost.sinfo_id = JSON.parse(f.value['ms_' + this.lostlist[i].key]).id;
					if(f.value['num_' + this.lostlist[i].key] == ''){
						this.toastTab('第' + num + '条药单数量不可为空', 'error');
						return;
					}
					lost.num = f.value['num_' + this.lostlist[i].key];
					mslosts.push(lost);
					feeAll += Number(JSON.parse(f.value['ms_' + this.lostlist[i].key]).bid) * Number(lost.num); 
				}
			}
		}
		if(f.value.remark == ''){
			this.toastTab('报损原因不可为空', '');
			return;
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			remark: f.value.remark,
			mslosts: mslosts,
			fee: feeAll,
		}

		this.adminService.medicalsupplieslost(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('报损成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/medicalLostList'])
				}, 2000);
			}
		})
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