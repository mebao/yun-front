import { Component }                           from '@angular/core';
import { Router, ActivatedRoute }              from '@angular/router';

import { AdminService }                        from '../admin.service';

@Component({
    selector: 'admin-role-authority-list',
    templateUrl: './role-authority-list.component.html',
    styleUrls: ['./role-authority-list.component.scss'],
})
export class RoleAuthorityListComponent{
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
    id: string;
    authorityList: any[];
    role: string;
	// 不可连续点击
	btnCanEdit: boolean;

    constructor(
        public adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

	ngOnInit(): void {
		this.topBar = {
			title: '角色权限',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.loadingShow = true;

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });

		this.role = sessionStorage.getItem('role');

        this.authorityList = [];
        var urlOptions = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&role_id=' + this.id;
        this.adminService.authoritylist(urlOptions).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                //构造数据，若是二级权限全选，则一级为选中状态
                if(results.list.length > 0){
                    for(var i = 0; i < results.list.length; i++){
                        if(results.list[i].info.length > 0){
                            var secondBoolean = 1;
                            for(var j = 0; j < results.list[i].info.length; j++){
                                if(results.list[i].info[j].isCheck == 0){
                                    secondBoolean = 0;
                                }
                            }
                            results.list[i].isCheck = secondBoolean;
                        }
                    }
                }
                this.authorityList = results.list;
		        this.loadingShow = false;
            }
        });

        this.btnCanEdit = false;
    }

    //选择一级权限
    selectAll(firstId, isCheck) {
        for(var i = 0; i < this.authorityList.length; i++){
            if(this.authorityList[i].id == firstId){
                this.authorityList[i].isCheck = (isCheck == 0 ? 1 : 0);
                for(var j = 0; j < this.authorityList[i].info.length; j++){
                    this.authorityList[i].info[j].isCheck = (isCheck == 0 ? 1 : 0);
                }
            }
        }
    }

    //选择二级权限
    select(firstId, secondId, isCheck) {
        for(var i = 0; i < this.authorityList.length; i++){
            if(this.authorityList[i].id == firstId){
                var secondBoolean = 1;
                for(var j = 0; j < this.authorityList[i].info.length; j++){
                    if(this.authorityList[i].info[j].id == secondId){
                        this.authorityList[i].info[j].isCheck = (isCheck == 0 ? 1 : 0);
                    }
                    //判断是否全选
                    if(this.authorityList[i].info[j].isCheck == 0){
                        secondBoolean = 0;
                    }
                }
                this.authorityList[i].isCheck = secondBoolean;
            }
        }
    }

    save() {
        this.btnCanEdit = true;
        var select = '';
        for(var i = 0; i < this.authorityList.length; i++){
            for(var j = 0; j < this.authorityList[i].info.length; j++){
                //判断是否选中
                if(this.authorityList[i].info[j].isCheck == 1){
                    select += this.authorityList[i].info[j].id + ',';
                }
            }
        }
        if(select.length > 0){
            select = select.substring(0, select.length - 1);
        }else{
            this.toastTab('权限不可为空', 'error');
            this.btnCanEdit = false;
            return;
        }

        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            auth_info_id: select,
        }

        this.adminService.setroleauth(this.id, params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
            }else{
                this.toastTab('权限保存成功', '');
                setTimeout(() => {
                    this.router.navigate(['./admin/crmRoleList']);
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
