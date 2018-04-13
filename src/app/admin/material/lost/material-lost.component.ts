import { Component, OnInit }                       from '@angular/core';
import { Router }                                  from '@angular/router';

import { AdminService }                            from '../../admin.service';

@Component({
	selector: 'app-material-lost',
	templateUrl: './material-lost.component.html',
	styleUrls: ['./material-lost.component.scss'],
})
export class MaterialLostComponent{
	topBar: {
		title: string,
		back: boolean,
	};
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
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '物资报损',
			back: true,
		}
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
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&type=3,4';
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
		});

		this.btnCanEdit = false;
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
		this.btnCanEdit = true;
		var mslosts = [];
		var num = 0;
		var feeAll = 0;
		if(this.lostlist.length > 0){
			for(var i = 0; i < this.lostlist.length; i++){
				//判断可用
				if(this.lostlist[i].use){
					num++;
					var lost = {
						project_id: '',
						project_type: 'supplies',
						num: '',
					};
					if(f.value['ms_' + this.lostlist[i].key] == ''){
						this.toastTab('第' + num + '条药单不可为空', 'error');
						this.btnCanEdit = false;
						return;
					}
					lost.project_id = JSON.parse(f.value['ms_' + this.lostlist[i].key]).others[0].id;
					if(this.adminService.isFalse(f.value['num_' + this.lostlist[i].key])){
						this.toastTab('第' + num + '条药单数量不可为空', 'error');
						this.btnCanEdit = false;
						return;
					}
					if(Number(f.value['num_' + this.lostlist[i].key]) <= 0 || Number(f.value['num_' + this.lostlist[i].key]) % 1 != 0){
						this.toastTab('第' + num + '条药单数量应为大于0的整数', 'error');
						this.btnCanEdit = false;
						return;
					}
					lost.num = f.value['num_' + this.lostlist[i].key];
					if(lost.num > JSON.parse(f.value['ms_' + this.lostlist[i].key]).stock){
						this.toastTab(JSON.parse(f.value['ms_' + this.lostlist[i].key]).name + '库存' + JSON.parse(f.value['ms_' + this.lostlist[i].key]).stock + JSON.parse(f.value['ms_' + this.lostlist[i].key]).unit + '，所选物资数量超过库存现有量', 'error');
						this.btnCanEdit = false;
						return;
					}
					mslosts.push(lost);
					feeAll += Number(JSON.parse(f.value['ms_' + this.lostlist[i].key]).others[0].bid) * Number(lost.num);
				}
			}
		}
		f.value.remark = this.adminService.trim(f.value.remark);
		if(f.value.remark == ''){
			this.toastTab('报损原因不可为空', 'error');
			this.btnCanEdit = false;
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
				this.btnCanEdit = false;
			}else{
				this.toastTab('报损成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/material/lost/list'])
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
