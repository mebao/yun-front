import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-medical-check',
	templateUrl: './medical-check.component.html',
})
export class MedicalCheckComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	url: string;
	info: {
		type: string,
		medical: string,
		reality_stock: string,
		check_time: string,
		remark: string,
	}
	medicalList: any[];
	id: string;
	editType: string;
	medicalCheck: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '盘点',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		//获取物资列表
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;


		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.medicalCheck = '';
		if(this.id && this.id != ''){
			this.editType = 'update';
			this.medicalCheck = sessionStorage.getItem('medicalCheck');
			this.info = {
				type: '',
				medical: '',
				reality_stock: JSON.parse(this.medicalCheck).realityStock,
				check_time: JSON.parse(this.medicalCheck).checkTime.slice(0, JSON.parse(this.medicalCheck).checkTime.indexOf(' ')),
				remark: JSON.parse(this.medicalCheck).remark,
			}
		}else{
			this.editType = 'create';
			this.info = {
				type: '1',
				medical: '',
				reality_stock: '',
				check_time: '',
				remark: '',
			}
		}

		this.medicalList = [];
		this.search();
	}

	search() {
		var urlOptions = this.url + '&type=' + this.info.type;

		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchsupplies(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
						//修改，获取物资信息
						if(this.editType == 'update'){
							if(results.list[i].id == JSON.parse(this.medicalCheck).sinfoId){
								this.info.type = results.list[i].type;
								this.info.medical = results.list[i].string;
							}
						}
					}
				}
				this.medicalList = results.list;
			}
		});
	}

	create(f) {
		if(f.value.reality_stock == ''){
			this.toastTab('实际库存不可为空', 'error');
			return;
		}
		if(this.editType == 'create'){
			if(f.value.type == ''){
				this.toastTab('药品类型不可为空', 'error');
				return;
			}
			if(f.value.medical == ''){
				this.toastTab('药品不可为空', 'error');
				return;
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				sinfo_id: JSON.parse(f.value.medical).id,
				name: JSON.parse(f.value.medical).name,
				type: f.value.type,
				reality_stock: f.value.reality_stock,
				remark: f.value.remark,
				check_time: f.value.check_time,
			}

			this.adminService.clinicstock(params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('盘点添加成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/medicalCheckList']);
					}, 2000);
				}
			});
		}else{
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				sinfo_id: JSON.parse(this.info.medical).id,
				name: JSON.parse(this.info.medical).name,
				type: this.info.type,
				reality_stock: f.value.reality_stock,
				remark: f.value.remark,
				check_time: this.info.check_time,
				id: JSON.parse(this.medicalCheck).id,
			}

			this.adminService.clinicstock(updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('盘点修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/medicalCheckList']);
					}, 2000);
				}
			});
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