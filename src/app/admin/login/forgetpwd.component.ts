import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd';

import { AuthService } from '../../auth.service';
import { AdminService } from '../admin.service';
import { config } from '../../config';

@Component({
    selector: 'forgetpwd',
    templateUrl: './forgetpwd.component.html',
    styleUrls: ['./forgetpwd.component.scss']
})

export class ForgetpwdComponent{
    num: number;
    codeImg = config.baseHTTP() + '/mebcrm/getcode?id=1';
    sms: {
        text: string,
        disabled: boolean,
    }
    isLoadingSave: boolean;
    validateForm: FormGroup;

	constructor(
        private fb: FormBuilder,
        private _message: NzMessageService,
		public authService: AuthService,
		public adminService: AdminService,
		public router: Router,
	) {
        this.validateForm = this.fb.group({
            username: [ '', [ Validators.required ]],
            password: [ '', [ Validators.required ]],
            vali_code: [ '', [ Validators.required ]],
            verify_code: [ '', [ Validators.required ]],
        });
    }

	ngOnInit(): void {
        document.title = '嘉宝云';
        this.num = 1;
        this.sms = {
            text: '验证码',
            disabled: false,
        }

        this.isLoadingSave = false;
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    changeCodeImg() {
        this.num++;
        this.codeImg = config.baseHTTP() + '/mebcrm/getcode?id=' + this.num;
    }

    // 发送验证码
    sendSms() {
        this.sms.disabled = true;
        var params = {
			mobile: this.validateForm.controls.username.value,
			action_type: 101,
			vali_code: this.validateForm.controls.vali_code.value,
        }
        this.authService.smsverifycode(params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
                this.sms.disabled = false;
            }else{
                this._message.success('短信验证码发送成功');
                var count = 60;
                this.sms.text = count + '秒后重发';
                var verifyCodeInterval = setInterval(() => {
                    this.sms.text = count-- + '秒后重发';
                    if(count == 0){
                        clearInterval(verifyCodeInterval);
                        this.sms.text = '重新发送';
                        this.sms.disabled = false;
                    }
                }, 1000);
            }
        }).catch(() => {
            this._message.error('服务器错误');
            this.sms.disabled = false;
        });
    }

    updatePwd() {
        this.isLoadingSave = true;
        if(this.validateForm.controls.username.value.length != 11){
            this._message.error('手机号码不足11位');
            this.isLoadingSave = false;
            return;
        }
        if(this.validateForm.controls.vali_code.value.length != 4){
            this._message.error('图形验证码不足4位');
            this.isLoadingSave = false;
            return;
        }
        if(this.validateForm.controls.verify_code.value.length == 0){
            this._message.error('验证码不可为空');
            this.isLoadingSave = false;
            return;
        }
        if(this.validateForm.controls.password.value.length == 0){
            this._message.error('新密码不可为空');
            this.isLoadingSave = false;
            return;
        }
        if(!this.validateForm.controls.password.value.match(/^\w+$/)){
            this._message.error('新密码只能由字母、数字和下划线组成');
            this.isLoadingSave = false;
            return;
        }
        var params = {
            mobile: this.validateForm.controls.username.value,
            verify_code: this.validateForm.controls.verify_code.value,
            password: this.validateForm.controls.password.value,
        }

        this.authService.forgetpwd(params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
                this.isLoadingSave = false;
            }else{
                this._message.success('密码修改成功');
                setTimeout(() => {
                    this.router.navigate(['./login']);
                }, 2000);
            }
        }).catch(() => {
            this._message.error('服务器错误');
            this.isLoadingSave = false;
        });
    }

    login() {
        this.router.navigate(['./login']);
    }
}
