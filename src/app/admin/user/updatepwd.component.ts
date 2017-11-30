import { Component }                               from '@angular/core';

import { AdminService }                            from '../admin.service';

@Component({
    selector: 'admin-updatepwd',
    templateUrl: './updatepwd.component.html',
})

export class UpdatepwdComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    info: {
        password: string,
        repassword: string,
    }
    btnCanEdit: boolean;

    constructor(
        private adminService: AdminService,
    ) {}

    ngOnInit() {
        this.topBar = {
    		title: '修改密码',
    		back: true,
    	};
    	this.toast = {
    		show: 0,
    		text: '',
    		type:  '',
    	};

        this.info = {
            password: '',
            repassword: '',
        }
        this.btnCanEdit = false;
    }

    updatepwd() {
        this.btnCanEdit = true;
        if(!this.info.password.match(/^\w+$/)){
            this.toastTab('新密码只能由字母、数字和下划线组成', 'error');
            this.btnCanEdit = false;
            return;
        }
        if(!this.info.repassword.match(/^\w+$/)){
            this.toastTab('新密码只能由字母、数字和下划线组成', 'error');
            this.btnCanEdit = false;
            return;
        }
        if(this.info.password != this.info.repassword){
            this.toastTab('重复密码不一致', 'error');
            this.btnCanEdit = false;
            return;
        }

        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            password: this.info.password,
        }

        this.adminService.updatepwd(params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
            }else{
                this.toastTab('密码修改成功', '');
                this.info = {
                    password: '',
                    repassword: '',
                }
                this.btnCanEdit = false;
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
