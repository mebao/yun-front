import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-medicalsupplies',
	templateUrl: './medical.component.html',
})
export class MedicalComponent{
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
		manufacturer: string,
		format: string,
		type: string,
		unit: string,
		oneUnit: string,
		otc: string,
		code: string,
		can_discount: string,
		is_prescribed: string,
		usage: string,
		price: string,
	};
	editType: string;
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
			title: '药品',
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
			manufacturer: '',
			format: '',
			type: '',
			unit: '',
			oneUnit: '',
			otc: '',
			code: '',
			can_discount: '',
			is_prescribed: '',
			usage: '',
			price: '',
		}

		this.OneUnits = [];

		this.route.queryParams.subscribe((params) => {
			this.info.id = params.id;
		});

		if(this.info.id && this.info.id != ''){
			this.editType = 'update';
			var urlOptions = '?username=' + this.adminService.getUser().username
			 	 + '&token=' + this.adminService.getUser().token
			 	 + '&clinic_id=' + this.adminService.getUser().clinicId;
			this.adminService.medicalsupplieslist(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.medicalSupplies.length > 0){
						for(var i = 0; i < results.medicalSupplies.length; i++){
							if(results.medicalSupplies[i].id == this.info.id){
								this.info = results.medicalSupplies[i];
								this.info.trade_name = results.medicalSupplies[i].tradeName;
								this.info.can_discount = results.medicalSupplies[i].canDiscount;
								this.info.is_prescribed = results.medicalSupplies[i].isPrescribed;
							}
						}
					}
				}
			})
		}else{
			this.editType = 'create';
		}

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

	create(f) {
		this.btnCanEdit = true;
		f.value.name = this.adminService.trim(f.value.name);
		f.value.trade_name = this.adminService.trim(f.value.trade_name);
		f.value.manufacturer = this.adminService.trim(f.value.manufacturer);
		f.value.format = this.adminService.trim(f.value.format);
		f.value.otc = this.adminService.trim(f.value.otc);
		f.value.code = this.adminService.trim(f.value.code);
		f.value.usage = this.adminService.trim(f.value.usage);
		if(f.value.name == ''){
			this.toastTab('药品名不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.trade_name == ''){
			this.toastTab('商品名不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.manufacturer == ''){
			this.toastTab('生产厂家不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.format == ''){
			this.toastTab('规格不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.type == ''){
			this.toastTab('药品类型不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.unit == ''){
			this.toastTab('单位不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.one_unit == ''){
			this.toastTab('剂量单位不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.otc == ''){
			this.toastTab('国药准字不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.code == ''){
			this.toastTab('条形码不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(f.value.price)){
			this.toastTab('售价不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(f.value.price) < 0){
			this.toastTab('售价应大于等于0', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.can_discount == ''){
			this.toastTab('能否优惠不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.is_prescribed == ''){
			this.toastTab('是否处方药不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.usage == ''){
			this.toastTab('一般用法不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			name: f.value.name,
			trade_name: f.value.trade_name,
			manufacturer: f.value.manufacturer,
			format: f.value.format,
			type: f.value.type,
			unit: f.value.unit,
			usage: f.value.usage,
			otc: f.value.otc,
			code: f.value.code,
			price: f.value.price.toString(),
			can_discount: f.value.can_discount,
			is_prescribed: f.value.is_prescribed,
			one_unit: f.value.one_unit,
		}

		var urlOptions = '';
		if(this.editType == 'update'){
			urlOptions = '/' + this.info.id;
		}

		this.adminService.medicalsupplies(urlOptions, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				if(this.editType == 'update'){
					this.toastTab('药品修改成功', '');
				}else{
					this.toastTab('药品创建成功', '');
				}
				setTimeout(() => {
					this.router.navigate(['./admin/medical/list']);
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
