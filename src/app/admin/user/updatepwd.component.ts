import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../admin.service';

@Component({
    selector: 'admin-updatepwd',
    templateUrl: './updatepwd.component.html',
})

export class UpdatepwdComponent{
	topBar: {
		title: string,
		back: boolean,
	};
    isLoadingSave: boolean;
    validateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private _message: NzMessageService,
        private adminService: AdminService,
        private router: Router,
    ) {
        this.validateForm = this.fb.group({
            password: [ '' ],
            repassword: [ '' ],
        });
    }

    ngOnInit() {
        this.topBar = {
    		title: '修改密码',
    		back: true,
    	};

        this.isLoadingSave = false;
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    updatepwd() {
        this.isLoadingSave = true;
        if(this.validateForm.controls.password.value.trim() == ''){
            this._message.error('新密码不可为空');
            this.isLoadingSave = false;
            return;
        }
        if(this.validateForm.controls.repassword.value.trim() == ''){
            this._message.error('重复密码不可为空');
            this.isLoadingSave = false;
            return;
        }
        if(!this.validateForm.controls.password.value.match(/^\w+$/)){
            this._message.error('新密码只能由字母、数字和下划线组成');
            this.isLoadingSave = false;
            return;
        }
        if(!this.validateForm.controls.repassword.value.match(/^\w+$/)){
            this._message.error('新密码只能由字母、数字和下划线组成');
            this.isLoadingSave = false;
            return;
        }
        if(this.validateForm.controls.password.value != this.validateForm.controls.repassword.value){
            this._message.error('重复密码不一致');
            this.isLoadingSave = false;
            return;
        }

        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            password: this.validateForm.controls.password.value,
        }

        this.adminService.updatepwd(params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
                this.isLoadingSave = false;
            }else{
                this._message.success('密码修改成功');
				this.adminService.delCookie('user');
				sessionStorage.removeItem('userClinicRoles');
				sessionStorage.removeItem('userClinicRolesInfos');
				this.router.navigate(['./login']);
            }
        }).catch(() => {
            this._message.error('服务器错误');
            this.isLoadingSave = false;
        });
    }
}
