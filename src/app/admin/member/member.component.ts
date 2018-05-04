import { Component }                         from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

import { NzMessageService }                  from 'ng-zorro-antd';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-member',
	templateUrl: './member.component.html',
	styleUrls: ['./member.component.scss'],
})
export class MemberComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	id: string;
	editType: string;
	serviceList: any[];
	assistList: any[];
	// 不可连续点击
	btnCanEdit: boolean;
    validateForm: FormGroup;

	constructor(
        private fb: FormBuilder,
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {
        this.validateForm = this.fb.group({
            name: [ '', [ Validators.required ]],
            give_scale: [ '', [ Validators.required ]],
            start_amount: [ '', [ Validators.required ]],
            // service: [ '', [ Validators.required ]],
            // assist: [ '', [ Validators.required ]],
            // check: [ '', [ Validators.required ]],
            // prescript: [ '', [ Validators.required ]],
            // other: [ '', [ Validators.required ]],
            unit: [ '%', [ Validators.required ]],
        });
	}

	ngOnInit() {
		this.topBar = {
			title: '会员',
			back: true,
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.editType = '';

		// 获取诊所科室
		// this.serviceList = [];
		// var urlOptions = '?username=' + this.adminService.getUser().username
		// 	 + '&token=' + this.adminService.getUser().token
		// 	 + '&clinic_id=' + this.adminService.getUser().clinicId;
		// this.adminService.servicelist(urlOptions).then((data) => {
		// 	if(data.status == 'no'){
		// 		this._message.error(data.errorMsg);
		// 	}else{
		// 		var results = JSON.parse(JSON.stringify(data.results));
		// 		this.serviceList = results.servicelist;
        //
		// 		this.reset();
		// 	}
		// }).catch(() => {
        //     this._message.error('服务器错误');
        // });
        //
		// // 获取辅助治疗
		// this.assistList = [];
		// var assistUrl = urlOptions + '&status=1';
		// this.adminService.searchassist(assistUrl).then((data) => {
		// 	if(data.status == 'no'){
		// 		this._message.error(data.errorMsg);
		// 	}else{
		// 		var results = JSON.parse(JSON.stringify(data.results));
		// 		this.assistList = results.list;
        //
		// 		this.resetAssist();
		// 	}
		// }).catch(() => {
            //     this._message.error('服务器错误');
            // });

        this.reset();
		this.btnCanEdit = false;
	}

	reset() {
		if(this.id && this.id != ''){
			this.editType = 'update';
			var member = JSON.parse(sessionStorage.getItem('memberInfo'));
            this.validateForm.controls.name.setValue(member.name);
            this.validateForm.controls.give_scale.setValue(member.giveScale);
            this.validateForm.controls.start_amount.setValue(member.startAmount);
			this.validateForm.addControl('status', new FormControl(member.status, Validators.required));
            // this.validateForm.controls.service.setValue(member.service);
            // this.validateForm.controls.assist.setValue(member.assist);
            // this.validateForm.controls.check.setValue(member.check);
            // this.validateForm.controls.prescript.setValue(member.prescript);
            // this.validateForm.controls.other.setValue(member.other);

			// 遍历诊所科室
			// if(this.serviceList.length > 0){
			// 	for(var i = 0; i < this.serviceList.length; i++){
			// 		var discount = '';
			// 		// 遍历会员科室
			// 		if(member.services.length > 0){
			// 			for(var j = 0; j < member.services.length; j++){
			// 				if(this.serviceList[i].serviceId == member.services[j].serviceId){
			// 					discount = member.services[j].discount;
			// 					this.serviceList[i].discount = member.services[j].discount;
			// 				}
			// 			}
			// 		}
			// 		this.validateForm.addControl(('service_' + this.serviceList[i].serviceId), new FormControl(discount, Validators.required));
			// 	}
			// }
		}else{
			this.editType = 'create';
		}
	}

	resetAssist() {
		// if(this.id && this.id != ''){
		// 	var member = JSON.parse(sessionStorage.getItem('memberInfo'));
		// 	// 遍历诊所辅助治疗
		// 	if(this.assistList.length > 0){
		// 		for(var i = 0; i < this.assistList.length; i++){
		// 			var discount = '';
		// 			// 遍历会员科室
		// 			if(member.assists.length > 0){
		// 				for(var j = 0; j < member.assists.length; j++){
		// 					if(this.assistList[i].id == member.assists[j].assistId){
		// 						discount = member.assists[j].discount;
		// 						this.assistList[i].discount = member.assists[j].discount;
		// 					}
		// 				}
		// 			}
		// 			this.validateForm.addControl(('assist_' + this.assistList[i].id), new FormControl(discount, Validators.required));
        //             console.log(discount);
		// 			console.log(this.validateForm.controls);
		// 		}
		// 	}
		// }
	}

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

	create() {
		this.btnCanEdit = true;
		// if(Number(this.validateForm.controls.service.value) < 0 || Number(this.validateForm.controls.service.value) > 100 || (Number(this.validateForm.controls.service.value) % 1 != 0)){
		// 	this._message.error('科室折扣应为大于0小于100的正整数');
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		// var mslist = [];
		// if(this.serviceList.length > 0){
		// 	for(var i = 0; i < this.serviceList.length; i++){
		// 		var key = 'service_' + this.serviceList[i].serviceId;
		// 		if(this.adminService.isFalse(this.validateForm.controls[key].value)){
		// 			this._message.error(this.serviceList[i].serviceName + '科室折扣不能为空');
		// 			this.btnCanEdit = false;
		// 			return;
		// 		}
		// 		if(Number(this.validateForm.controls[key].value) < 0 || Number(this.validateForm.controls[key].value) > 100 || (Number(this.validateForm.controls[key].value) % 1 != 0)){
		// 			this._message.error(this.serviceList[i].serviceName + '科室折扣应为大于0小于100的正整数');
		// 			this.btnCanEdit = false;
		// 			return;
		// 		}
		// 		var ms = {
		// 			service_id: this.serviceList[i].serviceId,
		// 			service_name: this.serviceList[i].serviceName,
		// 			discount: this.validateForm.controls[key].value.toString(),
		// 		}
		// 		mslist.push(ms);
		// 	}
		// }
		// if(this.adminService.isFalse(this.validateForm.controls.assist.value)){
		// 	this._message.error('辅助治疗折扣不能为空');
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		// var aslist = [];
		// if(this.assistList.length > 0){
		// 	for(var i = 0; i < this.assistList.length; i++){
		// 		var key = 'assist_' + this.assistList[i].id;
		// 		if(this.adminService.isFalse(this.validateForm.controls[key].value)){
		// 			this._message.error(this.assistList[i].name + '科室折扣不能为空');
		// 			this.btnCanEdit = false;
		// 			return;
		// 		}
		// 		if(Number(this.validateForm.controls[key].value) < 0 || Number(this.validateForm.controls[key].value) > 100 || (Number(this.validateForm.controls[key].value) % 1 != 0)){
		// 			this._message.error(this.assistList[i].name + '科室折扣应为大于0小于100的正整数');
		// 			this.btnCanEdit = false;
		// 			return;
		// 		}
		// 		var as = {
		// 			assist_id: this.assistList[i].id,
		// 			assist_name: this.assistList[i].name,
		// 			discount: this.validateForm.controls[key].value.toString(),
		// 		}
		// 		aslist.push(as);
		// 	}
		// }
		// if(this.adminService.isFalse(this.validateForm.controls.check.value)){
		// 	this._message.error('检查折扣不能为空');
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		// if(Number(this.validateForm.controls.check.value) < 0 || Number(this.validateForm.controls.check.value) > 100 || (Number(this.validateForm.controls.check.value) % 1 != 0)){
		// 	this._message.error('检查折扣应为大于0小于100的正整数');
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		// if(this.adminService.isFalse(this.validateForm.controls.prescript.value)){
		// 	this._message.error('药品折扣不能为空');
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		// if(Number(this.validateForm.controls.prescript.value) < 0 || Number(this.validateForm.controls.prescript.value) > 100 || (Number(this.validateForm.controls.prescript.value) % 1 != 0)){
		// 	this._message.error('药品折扣应为大于0小于100的正整数');
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		// if(this.adminService.isFalse(this.validateForm.controls.other.value)){
		// 	this._message.error('其他折扣不能为空');
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		// if(Number(this.validateForm.controls.other.value) < 0 || Number(this.validateForm.controls.other.value) > 100 || (Number(this.validateForm.controls.other.value) % 1 != 0)){
		// 	this._message.error('其他折扣应为大于0小于100的正整数');
		// 	this.btnCanEdit = false;
		// 	return;
		// }

		if(this.editType == 'create'){
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				name: this.validateForm.controls.name.value,
				// service: this.validateForm.controls.service.value,
				// check: this.validateForm.controls.check.value,
				// prescript: this.validateForm.controls.prescript.value,
				// other: this.validateForm.controls.other.value,
				// mslist: mslist,
				// assist: this.validateForm.controls.assist.value,
				// aslist: aslist,
                give_scale: this.validateForm.controls.give_scale.value,
                start_amount: this.validateForm.controls.start_amount.value,
			}
			this.adminService.addmember(params).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('会员创建成功');
					setTimeout(() => {
						this.router.navigate(['./admin/member/list']);
					}, 2000);
				}
			}).catch(() => {
                this._message.error('服务器错误');
                this.btnCanEdit = false;
            });
		}else{
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				name: this.validateForm.controls.name.value,
				// service: this.validateForm.controls.service.value,
				// check: this.validateForm.controls.check.value,
				// prescript: this.validateForm.controls.prescript.value,
				// other: this.validateForm.controls.other.value,
				// mslist: mslist,
				// assist: this.validateForm.controls.assist.value,
				// aslist: aslist,
				status: this.validateForm.controls.status.value,
                give_scale: this.validateForm.controls.give_scale.value,
                start_amount: this.validateForm.controls.start_amount.value,
			}
			this.adminService.updatemember(this.id, updateParams).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('会员修改成功');
					setTimeout(() => {
						this.router.navigate(['./admin/member/list']);
					}, 2000);
				}
			}).catch(() => {
                this._message.error('服务器错误');
                this.btnCanEdit = false;
            });
		}
	}
}
