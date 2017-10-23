import { Component }                   from '@angular/core';
import { ActivatedRoute }              from '@angular/router';

import { AdminService }                from '../admin.service';

@Component({
    selector: 'admin-medical-purchase-info',
    templateUrl: './medical-purchase-info.component.html'
})

export class MedicalPurchaseInfoComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
    params: {
        id: string;
        type: string;
    }
    infoList: any[];

    constructor(
        public adminService: AdminService,
        private route: ActivatedRoute,
    ) {}

	ngOnInit() {
		this.topBar = {
			title: '入库详情',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

        this.route.queryParams.subscribe((params) => {
            this.params = {
                id: params.id,
                type: params.type,
            }
        });

        // 获取入库 详情
        this.infoList = [];
        var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&type=' + this.params.type
             + '&id=' + this.params.id;
        this.adminService.purchaserecords(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.list.length > 0){
                    for(var i = 0; i < results.list.length; i++){
						results.list[i].aboutTime = !this.adminService.isFalse(results.list[i].aboutTime) ? this.adminService.dateFormat(results.list[i].aboutTime) : '';
                    }
                }
                this.infoList = results.list;
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
