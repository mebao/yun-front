import { Component, OnInit }                          from '@angular/core';
import { Router, ActivatedRoute }                     from '@angular/router';

import { AdminService }                               from '../../admin.service';

@Component({
	selector: 'app-material-has',
	templateUrl: './material-has.component.html',
})
export class MaterialHasComponent{
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
		expiring_date: string,
		unit: string,
		one_unit: string,
	}
	drugUnits: any[];
	OneUnits: any[];
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '物资库存',
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
			expiring_date: '',
			unit: '',
			one_unit: '',
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
						if(results.list[i].others[0].id == this.info.id){
							this.info = {
								id: results.list[i].others[0].id,
								name: results.list[i].name,
								type: results.list[i].type,
								typeText: results.list[i].typeText,
								usage: results.list[i].usage,
								stock: results.list[i].others[0].stock,
								bid: results.list[i].others[0].bid,
								price: results.list[i].others[0].price,
								canDiscount: results.list[i].others[0].canDiscount,
								expiring_date: results.list[i].others[0].expiringDate,
								unit: results.list[i].unit,
								one_unit: results.list[i].oneUnit,
							};
						}
					}
				}
			}
		});
		this.drugUnits = [];
		this.OneUnits = [];
		//计量单位
		//从缓存中获取clinicdata
		var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			this.setClinicData(JSON.parse(clinicdata));
		}else{
			this.adminService.clinicdata().then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.setClinicData(results);
				}
			});
		}

		this.btnCanEdit = false;
	}

	setClinicData(results) {
		this.drugUnits = results.drugUnits;
		this.OneUnits = results.OneUnits;
	}

	update(f) {
		this.btnCanEdit = true;
		f.value.usage = this.adminService.trim(f.value.usage);
		if(f.value.unit == ''){
			this.toastTab('单位不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.one_unit == ''){
			this.toastTab('计量单位不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.type == ''){
			this.toastTab('类型不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.usage == ''){
			this.toastTab('一般用法不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.price)){
			this.toastTab('售价不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(Number(f.value.price) <= 0){
			this.toastTab('售价应大于0', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.canDiscount == ''){
			this.toastTab('是否优惠不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			id: this.info.id,
			unit: f.value.unit,
			one_unit: f.value.one_unit,
			type: f.value.type,
			usage: f.value.usage,
			price: f.value.price,
			can_discount: f.value.canDiscount,
			expiring_date: this.info.expiring_date,
		}

		this.adminService.updatesupplies(this.info.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				this.toastTab('物资信息修改成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/material/hasList']);
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
