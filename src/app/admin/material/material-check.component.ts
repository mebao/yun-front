import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-material-check',
	templateUrl: './material-check.component.html',
})
export class MaterialCheckComponent{
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
		material: string,
		reality_stock: string,
		check_time: string,
		remark: string,
	}
	materialList: any[];
	id: string;
	editType: string;
	materialCheck: string;

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

		this.materialCheck = '';
		if(this.id && this.id != ''){
			this.editType = 'update';
			this.materialCheck = sessionStorage.getItem('materialCheck');
			this.info = {
				type: '',
				material: '',
				reality_stock: JSON.parse(this.materialCheck).realityStock,
				check_time: JSON.parse(this.materialCheck).checkTime.slice(0, JSON.parse(this.materialCheck).checkTime.indexOf(' ')),
				remark: JSON.parse(this.materialCheck).remark,
			}
		}else{
			this.editType = 'create';
			this.info = {
				type: '3',
				material: '',
				reality_stock: '',
				check_time: '',
				remark: '',
			}
		}

		this.materialList = [];
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
							if(results.list[i].id == JSON.parse(this.materialCheck).sinfoId){
								this.info.type = results.list[i].type;
								this.info.material = results.list[i].string;
							}
						}
					}
				}
				this.materialList = results.list;
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
				this.toastTab('物资类型不可为空', 'error');
				return;
			}
			if(f.value.material == ''){
				this.toastTab('物资不可为空', 'error');
				return;
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				sinfo_id: JSON.parse(f.value.material).id,
				name: JSON.parse(f.value.material).name,
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
						this.router.navigate(['./admin/materialCheckList']);
					}, 2000);
				}
			});
		}else{
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				sinfo_id: JSON.parse(this.info.material).id,
				name: JSON.parse(this.info.material).name,
				type: this.info.type,
				reality_stock: f.value.reality_stock,
				remark: f.value.remark,
				check_time: this.info.check_time,
				id: JSON.parse(this.materialCheck).id,
			}

			this.adminService.clinicstock(updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('盘点修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/materialCheckList']);
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