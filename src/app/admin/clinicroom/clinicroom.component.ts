import { Component, OnInit }              from '@angular/core';
import { ActivatedRoute, Router }         from '@angular/router';

import { AdminService }                   from '../admin.service';

@Component({
	selector: 'app-clinicroom',
	templateUrl: './clinicroom.component.html',
	styleUrls: ['./clinicroom.component.scss']
})
export class ClinicroomComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type: string,
	};
	bookingInfo: {
		id: string,
		name: string,
		type: string,
		room_no: string,
		remark: string,
	};
	editType: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.bookingInfo = {
			id: '',
			name: '',
			type: '',
			room_no: '',
			remark: '',
		}

		//获取id信息
		this.route.queryParams.subscribe((params) => {
			this.bookingInfo.id = params['id'];
		})

		//判断是创建还是修改
		if(this.bookingInfo.id && this.bookingInfo.id != ''){
			this.editType = 'update';
			//修改，获取诊室信息
			var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
			this.adminService.clinicconditions(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					for(var i = 0; i < results.conditions.length; i++){
						if(results.conditions[i].id == this.bookingInfo.id){
							this.bookingInfo.name = results.conditions[i].name;
							this.bookingInfo.type = results.conditions[i].type;
							this.bookingInfo.room_no = results.conditions[i].roomNo;
							this.bookingInfo.remark = results.conditions[i].remark;
						}
					}
				}
			})
		}else{
			this.editType = 'create';
		}

		this.topBar = {
			title: this.editType == 'create' ? '创建诊室' : '修改诊室信息',
			back: true,
		}
	}

	create(f) {
		if(f.value.name == ''){
			this.toastTab('诊室名称不可为空', 'error');
			return;
		}
		if(f.value.type == ''){
			this.toastTab('诊室类型不能为空', 'error');
			return;
		}
		if(f.value.room_no == ''){
			this.toastTab('诊室编号不可为空', 'error');
			return;
		}
		if(this.editType == 'create'){
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				name: f.value.name,
				type: f.value.type,
				room_no: f.value.room_no,
				remark: f.value.remark,
			}
			this.adminService.clinicroom(params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('诊室创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/clinicroom/list']);
					}, 2000);
				}
			})
		}else{
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				name: f.value.name,
				type: f.value.type,
				room_no: f.value.room_no,
				remark: f.value.remark,
			}
			this.adminService.updateclinicroom(this.bookingInfo.id, updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('诊室信息修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/clinicroom/list']);
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
