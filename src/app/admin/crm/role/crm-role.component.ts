import { Component }                        from '@angular/core';
import { Location }                         from '@angular/common';
import { Router }                           from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

import { NzMessageService }                 from 'ng-zorro-antd';

import { AdminService }                     from '../../admin.service';

@Component({
	selector: 'admin-crm-role',
	templateUrl: './crm-role.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})
export class CrmRoleComponent{
	topBar: {
		title: string,
		back: boolean,
	};
    validateForm: FormGroup;
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		private location: Location,
        private fb: FormBuilder,
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {
        this.validateForm = this.fb.group({
            name: [ '', [ Validators.required ]],
        });
	}

	ngOnInit(): void {
		this.topBar = {
			title: '角色',
			back: true,
		}

		this.btnCanEdit = false;
	}

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

	create() {
		this.btnCanEdit = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			name: this.validateForm.controls.name.value,
		}

		this.adminService.clinicrole('', params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('角色创建成功');
				setTimeout(() => {
					this.location.back();
				}, 2000);
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}
}
