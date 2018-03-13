import { Component }                           from '@angular/core';
import { ActivatedRoute, Router }              from '@angular/router';

import { AdminService }                        from '../admin.service';

@Component({
    selector: 'admin-assist',
    templateUrl: './assist.component.html',
})

export class AssistComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    typeList: any[];
    info: {
        name: string,
        price: string,
        type: string,
    }
    id: string;
    editType: string;
	// 不可连续点击
	btnCanEdit: boolean;

    constructor(
        public adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

	ngOnInit() {
		this.topBar = {
			title: '辅助治疗',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

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

        this.info = {
            name: '',
            price: '',
            type: '',
        }

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
        });

        if(!this.adminService.isFalse(this.id)){
            this.editType = 'update';
            var urlOptions = '?username=' + this.adminService.getUser().username
                 + '&token=' + this.adminService.getUser().token
                 + '&clinic_id=' + this.adminService.getUser().clinicId
                 + '&id=' + this.id;

            this.adminService.searchassist(urlOptions).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                }else{
                    var results = JSON.parse(JSON.stringify(data.results));
                    if(results.list.length > 0){
                        this.info = {
                            name: results.list[0].name,
                            type: results.list[0].type,
                            price: results.list[0].price,
                        }
                    }
                }
            });
        }else{
            this.editType = 'create';
        }

        this.btnCanEdit = false;
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

    create() {
        this.btnCanEdit = true;
        this.info.name = this.adminService.trim(this.info.name);
        if(this.adminService.isFalse(this.info.name)){
            this.toastTab('辅助治疗名不可为空', 'error');
            this.btnCanEdit = false;
            return;
        }
        if(this.adminService.isFalse(this.info.type)){
            this.toastTab('辅助治疗类型不可为空', 'error');
            this.btnCanEdit = false;
            return;
        }
        if(this.adminService.isFalse(this.info.price)){
            this.toastTab('辅助治疗价格不可为空', 'error');
            this.btnCanEdit = false;
            return;
        }
        if(parseFloat(this.info.price) < 0){
            this.toastTab('辅助治疗价格应大于0', 'error');
            this.btnCanEdit = false;
            return;
        }

        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            name: this.info.name,
            type: this.info.type,
            price: this.info.price,
            assist_id: this.editType == 'update' ? this.id : null,
        }

        this.adminService.clinicassist(params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
            }else{
                this.toastTab(this.editType == 'update' ? '辅助治疗修改成功' : '辅助治疗创建成功', '');
                setTimeout(() => {
                    this.router.navigate(['./admin/assistList']);
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
