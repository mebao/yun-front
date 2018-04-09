import { Component }                   from '@angular/core';

import { Location }                     from '@angular/common';

import { AdminService }                from '../admin.service';

import { ToastService }                from '../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }      from '../../common/nll-toast/toast-model';

@Component({
    selector: 'admin-setup-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})

export class Message{
	topBar: {
		title: string,
		back: boolean,
	};
    messageList: any[];
    messageListSession: string;
    loadingShow: boolean;
    btnCanEdit: boolean;
    type: string;

    constructor(
        private adminService: AdminService,
        private toastService: ToastService,
		private location: Location,
    ) {}

    ngOnInit() {
    	this.topBar = {
    		title: '消息订阅',
    		back: true,
    	};

        this.messageList = [];
        this.messageListSession = '';
        this.loadingShow = true;
        this.btnCanEdit = false;
        this.type = 'info';
        var urlOptions = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&clinic_id=' + this.adminService.getUser().clinicId;
        this.adminService.messagetypes(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.messageList = results.list;
                this.messageListSession = JSON.stringify(this.messageList);
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
            this.toastService.toast(toastCfg);
        });
    }

    selectType(message, _index) {
        if(this.type == 'update'){
            this.messageList[_index].choosed = (message.choosed == 0 ? 1 : 0);
        }
    }

    cancel() {
        this.messageList = JSON.parse(this.messageListSession);
        this.type = 'info';
    }

    save() {
        if(this.type == 'update'){
            this.loadingShow = true;
            this.btnCanEdit = true;
            var ids = '';
            if(this.messageList.length > 0){
                for(var i = 0; i < this.messageList.length; i++){
                    if(this.messageList[i].choosed == 1){
                        ids += this.messageList[i].id + ',';
                    }
                }
            }
            if(ids.length > 0){
                ids = ids.substr(0, ids.length - 1);
            }
            var params = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                clinic_id: this.adminService.getUser().clinicId,
                ids: ids,
            }

            this.adminService.messagejoin(params).then((data) => {
                if(data.status == 'no'){
                    this.loadingShow = false;
                    this.btnCanEdit = false;
                    const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
                    this.toastService.toast(toastCfg);
                }else{
                    this.loadingShow = false;
                    this.btnCanEdit = false;
                    this.type = 'info';
                    const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '订阅成功', 3000);
                    this.toastService.toast(toastCfg);
                    // 将最新订阅信息存贮在cookie中
                    var user = this.adminService.getUser();
                    user.messageTypes = ids;
    				this.adminService.setCookie('user', JSON.stringify(user), 1);
                    // setTimeout(() => {
            		//     this.location.back();
                    // }, 2000);
                }
            }).catch(() => {
                this.loadingShow = false;
                this.btnCanEdit = false;
                const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
                this.toastService.toast(toastCfg);
            });
        }else{
            this.type = 'update';
        }
    }
}
