import { Component, OnInit }                 from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-inspect-resutls',
	templateUrl: './inspect-results.component.html',
})
export class InspectResultsComponent{
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
	checkProjectList: any[];
	selectTab: string;
	bookingInfo: {
		imageUrl: string,
		childName: string,
	};
	buttonType: string;

	constructor(
		private adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '检查',
			back: true,
		};
		this.toast = {
			show: 0,
			text: '',
			type:  '',
		};
		this.checkProjectList = [];
		this.selectTab = '';
		this.bookingInfo = {
			imageUrl: '',
			childName: '',
		}
		this.buttonType = 'update';

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.getData('');
	}

	getData(_selectTab) {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&booking_id=' + this.id
			 + '&ischeck=1'
			 + '&today=1';

		this.adminService.usercheckprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					this.selectTab = _selectTab != '' ? _selectTab : results.list[0].id;
					this.bookingInfo = {
						imageUrl: results.list[0].imageUrl,
						childName: results.list[0].childName,
					}
					for(var i = 0; i < results.list.length; i++){
						results.list[i].resultListNum = results.list[i].resultList.length;
						if(results.list[i].resultList.length > 0){
							if(results.list[i].resultList[0].values && results.list[i].resultList[0].values != ''){
								results.list[i].editType = 'update';
							}else{
								results.list[i].editType = 'create';
							}
						}
					}
				}
				this.checkProjectList = results.list;
			}
		});
	}

	changeTab(_value) {
		this.selectTab = _value;
		if(this.buttonType == 'save'){
			this.getData(_value);
			this.buttonType = 'update';
		}
	}

	changeButton() {
		this.buttonType = 'save';
	}

	save(f) {
		if(f.value.num > 0){
			var resultList = [];
			for(var i = 0; i < f.value.num; i++){
				var result = {
					user_cid: f.value.user_cid,
					check_info_id: '',
					values: '',
					remark: '',
				}
				if(!f.value['values_' + i] || f.value['values_' + i] == ''){
					this.toastTab(i + 1 + '项检查结果不可为空 ', 'error');
					return;
				}
				result.check_info_id = f.value['check_info_id_' + i];
				result.values = f.value['values_' + i];
				result.remark = f.value['remark_' + i];
				resultList.push(result);
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				values: resultList,
			}
			if(f.value.editType == 'create'){
				this.adminService.usercheckresult(f.value.user_cid, params).then((data) => {
					if(data.status == 'no'){
						this.toastTab(data.errorMsg, 'error');
					}else{
						this.getData('');
						this.toastTab('检查结果添加成功', '');
						this.buttonType = 'update';
					}
				});
			}else{
				this.adminService.updatecheckresult(f.value.user_cid, params).then((data) => {
					if(data.status == 'no'){
						this.toastTab(data.errorMsg, 'error');
					}else{
						this.getData('');
						this.toastTab('检查结果修改成功', '');
						this.buttonType = 'update';
					}
				});
			}
		}
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