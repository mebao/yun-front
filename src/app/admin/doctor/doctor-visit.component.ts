import { Component }                         from '@angular/core';

import { DoctorService }                     from './doctor.service';
import { AdminService }                      from '../admin.service';
import { Router }                            from '@angular/router';

@Component({
    selector: 'admin-doctor-visit',
    templateUrl: './doctor-visit.component.html',
})

export class DoctorVisitComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type: string,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		personal: boolean,
	}
	loadingShow: boolean;
    url: string;
    visitList: any[];
    hasData: boolean;
    timeGo: any;
	// 不可连续点击
	canEdit: boolean;
    modalTabAgain : boolean;
    bookingId: string;

    constructor(
        public doctorService: DoctorService,
        public adminService: AdminService,
        private router: Router,
    ) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.topBar = {
			title: '就诊管理',
			back: false,
		}

		this.moduleAuthority = {
			see: false,
			personal: false,
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

		this.loadingShow = true;

        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.visitList = [];
        this.hasData = false;
        this.getData();

        this.canEdit = false;
        this.modalTabAgain = false;
        this.bookingId = '';
    }

    getData() {
        var url = this.url;
        if(this.moduleAuthority.personal && !this.moduleAuthority.see){
            url += '&myself=1';
        }
        this.doctorService.doctorwork(url).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.visitList = this.setData(results.doctors);
                this.hasData = true;
                // 开启定时器
                if(this.timeGo){
                    clearInterval(this.timeGo);
                }
                this.timeGo = setInterval(() => {
                    this.visitList = this.setData(results.doctors);
                }, 1000);
		        this.loadingShow = false;
            }
        });
    }

    setData(data) {
        if(data.length > 0){
            for(var i = 0; i < data.length; i++){
                if(data[i].doctorChilds.length > 0){
                    for(var j = 0; j < data[i].doctorChilds.length; j++){
                        if(data[i].doctorChilds[j].begin){
                            data[i].selected = data[i].doctorChilds[j].serviceId;
                            data[i].visitChild = data[i].doctorChilds[j].childName;
                            data[i].visitTime = this.getTimeString(data[i].doctorChilds[j].begin);
                        }
                    }
                }
            }
        }
        return data;
    }

    changeVisit(serviceId, index, visitChild) {
        if(!visitChild){
            this.visitList[index].selected = serviceId;
        }
    }

    receive(visit, type) {
        this.canEdit = true;
        var date = new Date();
        var dateString = this.adminService.getDayByDate(date) + ' '  + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        if(type == 'begin'){
            var params = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                begin: dateString,
            }
            this.doctorService.updateservice(visit.selected, params).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.canEdit = false;
                }else{
                    this.toastTab('开始就诊', '');
                    this.getData();
                    this.canEdit = false;
                }
            });
        }else{
            var paramsEnd = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                end: dateString,
            }
            this.doctorService.updateservice(visit.selected, paramsEnd).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.canEdit = false;
                }else{
                    this.toastTab('结束就诊', '');
                    this.getData();
                    this.canEdit = false;
                    var userClinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
        			if(userClinicRoles.length > 0){
        				for(var i = 0; i < userClinicRoles.length; i++){
        					if(userClinicRoles[i].keyName == 'bookingCharge'){
        						// 查询用户是否含有收费权限
        						if(userClinicRoles[i].infos.length > 0){
        							for(var j = 0; j < userClinicRoles[i].infos.length; j++){
        								if(userClinicRoles[i].infos[j].keyName == 'payment'){
        									this.modalTabAgain = true;
                                            for(var x in visit.doctorChilds){
                                                if(visit.doctorChilds[x].serviceId==visit.selected){
                                                        this.bookingId = visit.doctorChilds[x].bookingId;
                                                }
                                            }
        								}
        							}
        						}
        					}
        				}
        			}
                }
            });
        }
    }

    getTimeString(begin) {
        var seconds = new Date().getTime() - new Date(begin).getTime();
        seconds = parseInt((seconds / 1000).toString());
        var second = seconds % 60;
        var minutes = parseInt((seconds / 60).toString());
        var minute = minutes % 60;
        var hour = parseInt((minutes / 60).toString());
        return (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second);
    }

    closeAgain(){
        this.modalTabAgain = false;
    }

    confirmType() {
        var urlOptions = this.url;
		urlOptions += '&id=' + this.bookingId;
        this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					var allFee = 0;
					if(results.weekbooks[0].fees.length > 0){
						for(var j = 0; j < results.weekbooks[0].fees.length; j++){
							allFee += Number(results.weekbooks[0].fees[j].fee);
						}
					}
					results.weekbooks[0].allFee = parseFloat(allFee.toString());
				}
                sessionStorage.setItem('bookingInfo', JSON.stringify(results.weekbooks[0]));
				this.loadingShow = false;
                this.router.navigate(['./admin/bookingPayment'], {queryParams: {id: this.bookingId}});
			}
		})
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
