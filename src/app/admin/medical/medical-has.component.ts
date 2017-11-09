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
		trade_name: string,
		format: string,
		type: string,
		typeText: string,
		usage: string,
		stock: string,
		bid: string,
		isPrescribed: string,
		price: string,
		canDiscount: string,
		unit: string,
		one_unit: string,
		otc: string,
		code: string,
		batch: string,
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
			title: '药品库存',
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
			trade_name: '',
			format: '',
			type: '',
			typeText: '',
			usage: '',
			stock: '',
			bid: '',
			isPrescribed: '',
			price: '',
			canDiscount: '',
			unit: '',
			one_unit: '',
			otc: '',
			code: '',
			batch: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.info.id = params.id;
		})

		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&id=' + this.info.id;
		this.adminService.searchsupplies(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					if(results.list[0].others.length > 0){
						this.info = {
							id: results.list[0].others[0].id,
							name: results.list[0].name,
							trade_name: results.list[0].others[0].tradeName,
							format: results.list[0].others[0].format,
							type: results.list[0].type,
							typeText: results.list[0].typeText,
							usage: results.list[0].usage,
							stock: results.list[0].others[0].stock,
							bid: results.list[0].others[0].bid,
							isPrescribed: results.list[0].others[0].isPrescribed,
							price: results.list[0].others[0].price,
							canDiscount: results.list[0].others[0].canDiscount,
							unit: results.list[0].unit,
							one_unit: results.list[0].oneUnit,
							otc: results.list[0].others[0].otc,
							code: results.list[0].others[0].code,
							batch: results.list[0].others[0].batch,
						};
					}
				}

				console.log(this.info);
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
		if(f.value.trade_name == ''){
			this.toastTab('商品名不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.format == ''){
			this.toastTab('规格不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.unit == ''){
			this.toastTab('单位不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.one_unit)){
			this.toastTab('计量单位不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.type == ''){
			this.toastTab('类型不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.otc)){
			this.toastTab('国药准字不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.code)){
			this.toastTab('条形码不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.usage == ''){
			this.toastTab('一般用法不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.is_prescribed)){
			this.toastTab('是否处方药不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.canDiscount == ''){
			this.toastTab('是否优惠不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.price)){
			this.toastTab('售价不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(f.value.price) <= 0){
			this.toastTab('售价应大于0', 'error');
			this.btnCanEdit = false;
			return;
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			id: this.info.id,
			trade_name: this.info.trade_name,
			format: this.info.format,
			unit: f.value.unit,
			one_unit: f.value.one_unit,
			type: this.info.type,
			otc: f.value.otc,
			code: f.value.code,
			usage: f.value.usage,
			price: f.value.price,
			can_discount: f.value.canDiscount,
			is_prescribed: f.value.is_prescribed,
		}

		this.adminService.updatesupplies(this.info.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				this.toastTab('药品库存信息修改成功', '');
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
