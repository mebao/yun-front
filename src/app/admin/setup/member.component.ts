import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-member',
	templateUrl: './member.component.html',
})
export class MemberComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	memberInfo: {
		name: string,
		service: string,
		check: string,
		prescript: string,
		other: string,
		status: string,
	}
	id: string;
	editType: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '会员',
			back: true,
		}

		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		if(this.id && this.id != ''){
			this.editType = 'update';
			var member = JSON.parse(sessionStorage.getItem('memberInfo'));
			this.memberInfo = {
				name: member.name,
				service: member.service,
				check: member.check,
				prescript: member.prescript,
				other: member.other,
				status: member.status,
			}
		}else{
			this.editType = 'create';
			this.memberInfo = {
				name: '',
				service: '',
				check: '',
				prescript: '',
				other: '',
				status: '',
			}
		}
	}

	create(f) {
		if(f.value.name == ''){
			this.toastTab('会员名不能为空', 'error');
			return;
		}
		if(f.value.service == ''){
			this.toastTab('服务折扣不能为空', 'error');
			return;
		}
		if(Number(f.value.service) < 0 || Number(f.value.service) > 100){
			this.toastTab('服务折扣应在0至100之间', 'error');
			return;
		}
		if(f.value.check == ''){
			this.toastTab('检查折扣不能为空', 'error');
			return;
		}
		if(Number(f.value.check) < 0 || Number(f.value.check) > 100){
			this.toastTab('检查折扣应在0至100之间', 'error');
			return;
		}
		if(f.value.prescript == ''){
			this.toastTab('药品折扣不能为空', 'error');
			return;
		}
		if(Number(f.value.prescript) < 0 || Number(f.value.prescript) > 100){
			this.toastTab('药品折扣应在0至100之间', 'error');
			return;
		}
		if(f.value.other == ''){
			this.toastTab('其他折扣不能为空', 'error');
			return;
		}
		if(Number(f.value.other) < 0 || Number(f.value.other) > 100){
			this.toastTab('其他折扣应在0至100之间', 'error');
			return;
		}

		if(this.editType == 'create'){
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				name: f.value.name,
				service: f.value.service,
				check: f.value.check,
				prescript: f.value.prescript,
				other: f.value.other,
			}
			this.adminService.addmember(params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('会员创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/memberList']);
					}, 2000);
				}
			});
		}else{
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				name: f.value.name,
				service: f.value.service,
				check: f.value.check,
				prescript: f.value.prescript,
				other: f.value.other,
				status: f.value.status,
			}
			this.adminService.updatemember(this.id, updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('会员修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/memberList']);
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