import { Component, OnInit }                          from '@angular/core';
import { Router, ActivatedRoute }                     from '@angular/router';

import { AdminService }                               from '../admin.service';

@Component({
	selector: 'app-medical-has',
	templateUrl: './medical-has.component.html',
})
export class MedicalHasComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	info: {
		id: string,
		name: string,
		type: string,
		typeText: string,
		usage: string,
		stock: string,
		bid: string,
		price: string,
		canDiscount: string,
		unit: string,
	}

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '诊所医疗用品信息',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.info = {
			id: '',
			name: '',
			type: '',
			typeText: '',
			usage: '',
			stock: '',
			bid: '',
			price: '',
			canDiscount: '',
			unit: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.info.id = params.id;
		})

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
						if(results.list[i].id == this.info.id){
							this.info = results.list[i];
						}
					}
				}
			}
		})
	}

	update(f) {
		if(f.value.unit == ''){
			this.toastTab('单位不可为空', 'error');
			return;
		}
		if(f.value.type == ''){
			this.toastTab('类型不可为空', 'error');
			return;
		}
		if(f.value.usage == ''){
			this.toastTab('一般用法不可为空', 'error');
			return;
		}
		if(f.value.price == ''){
			this.toastTab('售价不可为空', 'error');
			return;
		}
		if(f.value.canDiscount == ''){
			this.toastTab('是否优惠不可为空', 'error');
			return;
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			id: this.info.id,
			unit: f.value.unit,
			type: f.value.type,
			usage: f.value.usage,
			price: f.value.price,
			can_discount: f.value.canDiscount,
		}

		this.adminService.updatesupplies(this.info.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('诊所医疗用品信息修改成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/medicalHasList']);
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