import { Component, OnInit }                       from '@angular/core';
import { Router, ActivatedRoute }                  from '@angular/router';

import { AdminService }                            from '../admin.service';

@Component({
	selector: 'app-medical-supplier',
	templateUrl: './medical-supplier.component.html',
})
export class MedicalSupplierComponent{
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
		company: string,
		contacts: string,
		mobile: string,
	};
	editType: string;
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '医疗用品供应商',
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
			company: '',
			contacts: '',
			mobile: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.info.id = params.id;
		})

		if(this.info.id && this.info.id != ''){
			this.editType = 'update';
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
							if(results.list[i].id == this.info.id){
								this.info = results.list[i];
							}
						}
					}
				}
			})
		}else{
			this.editType = 'create';
		}

		this.btnCanEdit = false;
	}

	create(f) {
		this.btnCanEdit = true;
		if(f.value.name == ''){
			this.toastTab('供应商名不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.company == ''){
			this.toastTab('供应商公司不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.contacts == ''){
			this.toastTab('联系人不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.mobile == ''){
			this.toastTab('联系人电话不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(f.value.mobile.length != 11){
			this.toastTab('联系人电话应为11位', 'error');
			this.btnCanEdit = false;
			return;
		}

		if(this.editType == 'create'){
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				name: f.value.name,
				company: f.value.company,
				contacts: f.value.contacts,
				mobile: f.value.mobile,
			}

			this.adminService.supplier(params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('医疗用品供应商创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/medicalSupplierList']);
					}, 2000);
				}
			})
		}else{
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				id: this.info.id,
				name: f.value.name,
				company: f.value.company,
				contacts: f.value.contacts,
				mobile: f.value.mobile,
			}

			this.adminService.updatesupplier(this.info.id, updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('医疗用品供应商修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/medical/supplierList']);
					}, 2000);
				}
			})
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
