import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-material-check',
	templateUrl: './material-check.component.html',
	styleUrls: ['../medical/medical-check.component.scss'],
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
	loadingShow: boolean;
	url: string;
	info: {
		check_time: string,
	}
	id: string;
	editType: string;
	materialCheck: string;

	checkList: any[];
	// 不可连续点击
	btnCanEdit: boolean;

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

		//获取物资列表
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&type=3,4';

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.materialCheck = '';
		this.editType = 'create';
		this.info = {
			check_time: '',
		}

		this.loadingShow = true;

		this.getData(this.url);

		this.btnCanEdit = false;
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
		this.btnCanEdit = true;
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
						this.toastTab(this.checkList[i].name + '，实际库存不可为空', 'error');
						this.btnCanEdit = false;
						return;
					}
					if(Number(this.checkList[i].reality_stock) < 0 || Number(this.checkList[i].reality_stock) % 1 != 0){
						this.toastTab(this.checkList[i].name + '，实际库存应为大于等于0的整数', 'error');
						this.btnCanEdit = false;
						return;
					}
					clist.push(c);
				}
			}
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			clist: clist,
			// check_time: this.info.check_time,
		}

		this.adminService.clinicstock(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				this.toastTab('盘点添加成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/material/checkList']);
				}, 2000);
			}
		});
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
