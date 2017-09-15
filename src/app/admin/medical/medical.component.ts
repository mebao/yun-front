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
		type: string,
		unit: string,
		one_unit: string,
		usage: string,
	};
	editType: string;
	drugUnits: any[];
	OneUnits: any[];

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
			type: '',
			unit: '',
			one_unit: '',
			usage: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.info.id = params.id;
		});

		if(this.info.id && this.info.id != ''){
			this.editType = 'update';
			var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
			this.adminService.medicalsupplieslist(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.medicalSupplies.length > 0){
						for(var i = 0; i < results.medicalSupplies.length; i++){
							if(results.medicalSupplies[i].id == this.info.id){
								this.info = results.medicalSupplies[i];
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
	}

	setClinicData(results) {
		this.drugUnits = results.drugUnits;
		this.OneUnits = results.OneUnits;
	}

	create(f) {
		if(f.value.name == ''){
			this.toastTab('药品名不可为空', 'error');
			return;
		}
		if(f.value.type == ''){
			this.toastTab('药品类型不可为空', 'error');
			return;
		}
		if(f.value.unit == ''){
			this.toastTab('单位不可为空', 'error');
			return;
		}
		if(f.value.one_unit == ''){
			this.toastTab('剂量单位不可为空', 'error');
			return;
		}
		if(f.value.usage == ''){
			this.toastTab('一般用法不可为空', 'error');
			return;
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			name: f.value.name,
			type: f.value.type,
			unit: f.value.unit,
			usage: f.value.usage,
			one_unit: f.value.one_unit,
		}

		var urlOptions = '';
		if(this.editType == 'update'){
			urlOptions = '/' + this.info.id;
		}

		this.adminService.medicalsupplies(urlOptions, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				if(this.editType == 'update'){
					this.toastTab('药品修改成功', '');
				}else{
					this.toastTab('药品创建成功', '');
				}
				setTimeout(() => {
					this.router.navigate(['./admin/medicalList']);
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
