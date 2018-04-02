import { Component }                                from '@angular/core';
import { Router }                                   from '@angular/router';

import { AdminService }                             from '../admin.service';

@Component({
    selector: 'admin-assist-list',
    templateUrl: 'assist-list.component.html',
})

export class AssistListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    // 权限
    moduleAuthority: {
        see: boolean,
        edit: boolean,
    }
	loadingShow: boolean;
    assistList: any[];
    hasData: boolean;
    url: string;
    typeList: any[];
    searchInfo: {
        name: string,
        type: string,
        status: string,
    }

    constructor(
        public adminService: AdminService,
        private router: Router,
    ) {}

	ngOnInit() {
		this.topBar = {
			title: '辅助治疗列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.moduleAuthority = {
			see: false,
			edit: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.loadingShow = false;

        this.assistList = [];
        this.hasData = false;

		//从缓存中获取clinicdata
		this.typeList = [];
		var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			this.setClinicData(JSON.parse(clinicdata));
		}else{
			this.adminService.clinicdata().then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.setClinicData(results);
				}
			});
		}

        if(JSON.parse(sessionStorage.getItem('search-assistList'))){
            this.searchInfo = JSON.parse(sessionStorage.getItem('search-assistList'));
        }else{
            this.searchInfo = {
                name: '',
                type: '',
                status: '1'
            }
        }
        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.search();
    }

    setClinicData(data) {
        for(var item in data.typeAssist){
            var type = {
                key: item,
                value: data.typeAssist[item]
            }
            this.typeList.push(type);
        }
    }

    search() {
        this.loadingShow = true;
        sessionStorage.setItem('search-assistList', JSON.stringify(this.searchInfo));
        var urlOptions = this.url;
        if(!this.adminService.isFalse(this.searchInfo.name)){
            urlOptions += '&name=' + this.searchInfo.name;
        }
        if(!this.adminService.isFalse(this.searchInfo.type)){
            urlOptions += '&type=' + this.searchInfo.type;
        }
        if(!this.adminService.isFalse(this.searchInfo.status)){
            urlOptions += '&status=' + this.searchInfo.status;
        }
        this.getData(urlOptions);
    }

    getData(urlOpltions) {
        this.adminService.searchassist(urlOpltions).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.assistList = results.list;
                this.hasData = true;
		        this.loadingShow = false;
            }
        });
    }

    add() {
        this.router.navigate(['./admin/assist']);
    }

    update(assist) {
        this.router.navigate(['./admin/assist'], {queryParams: {id: assist.id}});
    }

    updateStatus(assist) {
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            name: assist.name,
            type: assist.type,
            price: assist.price,
            status: assist.status == '1' ? '0' : '1',
            assist_id: assist.id,
        }

        this.adminService.clinicassist(params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                this.toastTab('状态修改成功', '');
                this.search();
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
