import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-material-purchase',
	templateUrl: './material-purchase.component.html',
	styleUrls: ['./material-purchase.component.scss'],
})
export class MaterialPurchaseComponent{
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
		supplier: string,
		about_time: string,
		fee: string,
	};
	list: any[];
	materialSupplies: any[];
	mslist: any[];

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '物资入库',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.info = {
			supplier: '',
			about_time: '',
			fee: '',
		}

		this.mslist = [];
		this.mslist.push({key: 1, show: true, use: true});

		//获取供应商
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.adminService.supplierlist(urlOptions).then((data) => {
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

		//获取医疗用品
		var materialsupplieslistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&type=3,4';
		this.adminService.medicalsupplieslist(materialsupplieslistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.medicalSupplies.length > 0){
					for(var i = 0; i < results.medicalSupplies.length; i++){
						results.medicalSupplies[i].string = JSON.stringify(results.medicalSupplies[i]);
					}
				}
				this.materialSupplies = results.medicalSupplies;
			}
		})
	}

	showMs(_key) {
		if(this.mslist.length > 0){
			for(var i = 0; i < this.mslist.length; i++){
				if(this.mslist[i].key == _key){
					this.mslist[i].show = !this.mslist[i].show;
				}
			}
		}
	}

	addMs() {
		if(this.mslist.length > 0){
			for(var i = 0; i < this.mslist.length; i++){
				this.mslist[i].show = false;
			}
		}
		this.mslist.push({key: this.mslist.length + 1, show: true, use: true});
	}

	deleteMs(_key) {
		if(this.mslist.length > 0){
			for(var i = 0; i < this.mslist.length; i++){
				if(this.mslist[i].key == _key){
					this.mslist[i].use = false;
				}
			}
		}
	}

	feeChange(f) {
		var numBoolean = false;
		var bidBoolean = false;
		var num = 0;
		var feeAll = 0;
		for(var i = 0; i < this.mslist.length; i++){
			//判断是否可用
			if(this.mslist[i].use){
				var key = this.mslist[i].key;
				num++;
				if(f.value['num_' + key] != ''){
					if(isNaN(Number(f.value['num_' + key]))){
						this.toastTab('第' + num + '条物资入库数量请输入数字', 'error');
						return;
					}
					numBoolean = true;
				}
				if(f.value['bid_' + key] != ''){
					if(isNaN(Number(f.value['bid_' + key]))){
						this.toastTab('第' + num + '条物资进价请输入数字', 'error');
						return;
					}
					bidBoolean = true;
				}
			}
			if(numBoolean && bidBoolean){
				feeAll += Number(f.value['num_' + key]) * Number(f.value['bid_' + key]);
			}
		}
		this.info.fee = String(feeAll);
	}

	create(f) {
		if(f.value.supplier == ''){
			this.toastTab('供应商不可为空', 'error');
			return;
		}
		if(this.adminService.isFalse(f.value.about_time)){
			this.toastTab('发货时间不可为空', 'error');
			return;
		}
		var msParamsList = [];
		var num = 0;
		if(this.mslist.length > 0){
			for(var i = 0; i < this.mslist.length; i++){
				//判断可用
				if(this.mslist[i].use){
					var msParams = {
						ms_name: '',
						unit: '',
						num: '',
						bid: '',
						type: '',
						usage: '',
						one_unit: '',
						price: '',
						can_discount: '',
						is_prescribed: '0',
					}
					var key = this.mslist[i].key;
					num++;
					if(f.value['ms_' + key] == ''){
						this.toastTab('第' + num + '条物资不可为空', 'error');
						return;
					}
					msParams.ms_name = JSON.parse(f.value['ms_' + key]).name;
					msParams.unit = JSON.parse(f.value['ms_' + key]).unit;
					msParams.type = JSON.parse(f.value['ms_' + key]).type;
					msParams.usage = JSON.parse(f.value['ms_' + key]).usage;
					msParams.one_unit = JSON.parse(f.value['ms_' + key]).oneUnit;
					if(this.adminService.isFalse(f.value['num_' + key])){
						this.toastTab('第' + num + '条物资入库数量不可为空', 'error');
						return;
					}
					if(parseFloat(f.value['num_' + key]) <= 0 || Number(f.value['num_' + key]) % 1 != 0){
						this.toastTab('第' + num + '条物资入库数量应为大于0的整数', 'error');
						return;
					}
					msParams.num = f.value['num_' + key];
					if(this.adminService.isFalse(f.value['bid_' + key])){
						this.toastTab('第' + num + '条物资进价不可为空', 'error');
						return;
					}
					if(parseFloat(f.value['bid_' + key]) <= 0){
						this.toastTab('第' + num + '条物资进价应大于0', 'error');
						return;
					}
					msParams.bid = f.value['bid_' + key];
					msParams.price = '';
					if(f.value['can_discount_' + key] == ''){
						this.toastTab('第' + num + '条物资优惠类型不可为空', 'error');
						return;
					}
					msParams.can_discount = f.value['can_discount_' + key];
					msParamsList.push(msParams);
				}
			}
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			supplier_id: JSON.parse(f.value.supplier).id,
			supplier_name: JSON.parse(f.value.supplier).name,
			about_time: f.value.about_time,
			fee: this.info.fee,
			mslist: msParamsList,
		}

		this.adminService.purchaserecord(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('物资入库创建成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/materialPurchaseList']);
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
