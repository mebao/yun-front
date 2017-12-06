import { Component }                          from '@angular/core';
import { Router }                             from '@angular/router';

import { AuthService }                        from '../../auth.service';
import { AdminService }                       from '../admin.service';
import { config }                             from '../../config';

@Component({
    selector: 'forgetpwd',
    templateUrl: './forgetpwd.component.html',
    styleUrls: ['./forgetpwd.component.scss']
})

export class ForgetpwdComponent{
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    num: number;
    codeImg = config.baseHTTP + '/mebcrm/getcode?id=1';
    sms: {
        text: string,
        disabled: boolean,
    }
    info: {
        username: string,
        vali_code: string,
        verify_code: string,
        password: string,
    }
    btnCanEdit: boolean;

	constructor(
		public authService: AuthService,
		public adminService: AdminService,
		public router: Router,
	) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

        this.num = 1;
        this.sms = {
            text: '验证码',
            disabled: false,
        }
        this.info = {
            username: '',
            vali_code: '',
            verify_code: '',
            password: '',
        }

        this.btnCanEdit = false;
    }

    changeCodeImg() {
        this.num++;
        this.codeImg = config.baseHTTP + '/mebcrm/getcode?id=' + this.num;
    }

    // 发送验证码
    sendSms() {
        this.sms.disabled = true;
        var params = {
			mobile: this.info.username,
			action_type: 101,
			vali_code: this.info.vali_code,
        }
        this.authService.smsverifycode(params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
                this.sms.disabled = false;
            }else{
                this.toastTab('短信验证码发送成功', '');
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
        });
    }

    updatePwd() {
        this.btnCanEdit = true;
        if(!this.info.password.match(/^\w+$/)){
            this.toastTab('新密码只能由字母、数字和下划线组成', 'error');
            this.btnCanEdit = false;
            return;
        }
        var params = {
            mobile: this.info.username,
            verify_code: this.info.verify_code,
            password: this.info.password,
        }

        this.authService.forgetpwd(params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
            }else{
                this.toastTab('密码修改成功', '');
                setTimeout(() => {
                    this.router.navigate(['./login']);
                }, 2000);
            }
        });
    }

    login() {
        this.router.navigate(['./login']);
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
