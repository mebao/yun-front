import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-medical-check',
	templateUrl: './medical-check.component.html',
	styleUrls: ['./medical-check.component.scss'],
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
	loadingShow: boolean;
	url: string;
	info: {
		check_time: string,
	}
	id: string;
	editType: string;
	medicalCheck: string;

	checkList: any[];

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

		this.checkList = [];

		this.loadingShow = true;

		//获取物资列表
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&type=1,2';

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.medicalCheck = '';
		if(this.id && this.id != ''){
			// this.editType = 'update';
			// this.medicalCheck = sessionStorage.getItem('medicalCheck');
			// this.info = {
			// 	type: '',
			// 	medical: '',
			// 	reality_stock: JSON.parse(this.medicalCheck).realityStock,
			// 	check_time: JSON.parse(this.medicalCheck).checkTime.slice(0, JSON.parse(this.medicalCheck).checkTime.indexOf(' ')),
			// 	remark: JSON.parse(this.medicalCheck).remark,
			// }
		}else{
			this.editType = 'create';
			this.info = {
				check_time: '',
			}
		}

		this.getData(this.url);
	}

	getData(urlOptions) {
		this.adminService.searchsupplies(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						if(results.list[i].others.length > 0){
							for(var j = 0; j < results.list[i].others.length; j++){
								var check = {
									key: this.checkList.length + 1,
									show: true,
									use: true,
									sinfo_id: results.list[i].others[j].id,
									name: results.list[i].name,
									batch: results.list[i].others[j].batch,
									stock: results.list[i].others[j].stock,
									unit: results.list[i].unit,
									type: results.list[i].type,
									reality_stock: '',
									remark: '',
								}
								this.checkList.push(check);
							}
						}
						//修改，获取物资信息
						// if(this.editType == 'update'){
						// 	if(results.list[i].id == JSON.parse(this.medicalCheck).sinfoId){
						// 		this.info.type = results.list[i].type;
						// 		this.info.medical = results.list[i].string;
						// 	}
						// }
					}
				}
				this.loadingShow = false;
			}
		});
	}

	showMs(_key) {
		if(this.checkList.length > 0){
			for(var i = 0; i < this.checkList.length; i++){
				if(this.checkList[i].key == _key){
					this.checkList[i].show = !this.checkList[i].show;
				}
			}
		}
	}

	deleteMs(_key) {
		if(this.checkList.length > 0){
			for(var i = 0; i < this.checkList.length; i++){
				if(this.checkList[i].key == _key){
					this.checkList[i].use = false;
				}
			}
		}
	}

	create() {
		var clist = [];
		if(this.checkList.length > 0){
			for(var i = 0; i < this.checkList.length; i++){
				if(this.checkList[i].use){
					var c = {
						sinfo_id: this.checkList[i].sinfo_id,
						name: this.checkList[i].name,
						type: this.checkList[i].type,
						reality_stock: this.checkList[i].reality_stock,
						remark: this.checkList[i].remark,
					}
					if(this.adminService.isFalse(this.checkList[i].reality_stock)){
						this.toastTab(this.checkList[i].name + this.checkList[i].batch + '批次 ，实际库存不可为空', 'error');
						return;
					}
					if(Number(this.checkList[i].reality_stock) <= 0 || Number(this.checkList[i].reality_stock) % 1 != 0){
						this.toastTab(this.checkList[i].name + this.checkList[i].batch + '批次 ，实际库存应为大于0的整数', 'error');
						return;
					}
					clist.push(c);
				}
			}
		}
		if(this.editType == 'create'){
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				clist: clist,
				check_time: this.info.check_time,
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
			// var updateParams = {
			// 	username: this.adminService.getUser().username,
			// 	token: this.adminService.getUser().token,
			// 	clinic_id: this.adminService.getUser().clinicId,
			// 	sinfo_id: JSON.parse(this.info.medical).id,
			// 	name: JSON.parse(this.info.medical).name,
			// 	type: this.info.type,
			// 	reality_stock: f.value.reality_stock,
			// 	remark: f.value.remark,
			// 	check_time: this.info.check_time,
			// 	id: JSON.parse(this.medicalCheck).id,
			// }
			//
			// this.adminService.clinicstock(updateParams).then((data) => {
			// 	if(data.status == 'no'){
			// 		this.toastTab(data.errorMsg, 'error');
			// 	}else{
			// 		this.toastTab('盘点修改成功', '');
			// 		setTimeout(() => {
			// 			this.router.navigate(['./admin/medicalCheckList']);
			// 		}, 2000);
			// 	}
			// });
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
