import { Component }                         from '@angular/core';

import { DoctorService }                     from '../doctor/doctor.service';
import { AdminService }                      from '../admin.service';
import { Router }                            from '@angular/router';

import { ToastService }                      from '../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }            from '../../common/nll-toast/toast-model';

@Component({
    selector: 'admin-doctor-visit',
    templateUrl: './docbooking-visit.component.html',
})

export class DocbookingVisitComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		personal: boolean,
        payment: boolean,
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
    searchInfo: {
        duty: string,
        duty_text: string,
        today_num: number,
    }
    modalAddInfo = false;
    childInfo: {
        child_id: string,
        height: string,
        weight: string,
        body_temperature: string,
        breathe: string,
        blood_pressure: string,
        head_circum: string,
    }

    constructor(
        public doctorService: DoctorService,
        public adminService: AdminService,
        private router: Router,
        private toastService: ToastService,
    ) {}

	ngOnInit() {
		this.topBar = {
			title: '就诊管理',
			back: false,
		}

		this.moduleAuthority = {
			see: false,
			personal: false,
            payment: false,
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
            var userClinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
            if(userClinicRoles.length > 0){
                for(var i = 0; i < userClinicRoles.length; i++){
                    if(userClinicRoles[i].keyName == 'bookingCharge'){
                        // 查询用户是否含有收费权限
                        if(userClinicRoles[i].infos.length > 0){
                            for(var j = 0; j < userClinicRoles[i].infos.length; j++){
                                if(userClinicRoles[i].infos[j].keyName == 'payment'){
                                    this.moduleAuthority.payment = true;
                                }
                            }
                        }
                    }
                }
            }
		}

		this.loadingShow = true;

        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.visitList = [];
        this.hasData = false;

		var todayDate = this.adminService.getDayByDate(new Date());
        this.searchInfo = {
            duty: todayDate,
            duty_text: this.adminService.dateFormat(todayDate),
            today_num: new Date(todayDate).getTime(),
        }

        this.getData();

        this.canEdit = false;
        this.modalTabAgain = false;
        this.bookingId = '';

        this.childInfo = {
            child_id: '',
            height: '',
            weight: '',
            body_temperature: '',
            breathe: '',
            blood_pressure: '',
            head_circum:'',
        }
    }

    changeDate(_value) {
		this.searchInfo.duty = JSON.parse(_value).value;
        this.getData();
    }

    getData() {
        var url = this.url + '&duty=' + this.searchInfo.duty;
        if(this.moduleAuthority.personal && !this.moduleAuthority.see){
            url += '&myself=1';
        }
        this.doctorService.doctorwork(url).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
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
        }).catch((data) => {
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
            this.toastService.toast(toastCfg);
        });
    }

    setData(data) {
        if(data.length > 0){
            for(var i = 0; i < data.length; i++){
                if(data[i].doctorChilds.length > 0){
                    var hasSelected = false;
                    for(var j = 0; j < data[i].doctorChilds.length; j++){
                        if(data[i].doctorChilds[j].begin){
                            hasSelected = true;
                            data[i].selected = data[i].doctorChilds[j].serviceId;
                            data[i].visitChildId = data[i].doctorChilds[j].childId;
                            data[i].visitChildName = data[i].doctorChilds[j].childName;
                            data[i].visitTime = this.getTimeString(data[i].doctorChilds[j].begin);
                        }
                    }
                }
            }
        }
        return data;
    }

    changeVisit(serviceId, index, visitChildName) {
        if(!visitChildName){
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
    				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
    				this.toastService.toast(toastCfg);
                    this.canEdit = false;
                }else{
    				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '开始就诊', 3000);
    				this.toastService.toast(toastCfg);
                    this.getData();
                    this.canEdit = false;
                }
            }).catch((data) => {
                const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
                this.toastService.toast(toastCfg);
            });
        }else{
            var paramsEnd = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                end: dateString,
            }
            this.doctorService.updateservice(visit.selected, paramsEnd).then((data) => {
                if(data.status == 'no'){
    				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
    				this.toastService.toast(toastCfg);
                    this.canEdit = false;
                }else{
    				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '结束就诊', 3000);
    				this.toastService.toast(toastCfg);
                    this.getData();
                    this.canEdit = false;
                    if(this.moduleAuthority.payment){
                        this.modalTabAgain = true;
                        for(var x in visit.doctorChilds){
                            if(visit.doctorChilds[x].serviceId==visit.selected){
                                    this.bookingId = visit.doctorChilds[x].bookingId;
                            }
                        }
                    }
                }
            }).catch((data) => {
                const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
                this.toastService.toast(toastCfg);
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
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
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
		}).catch((data) => {
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
            this.toastService.toast(toastCfg);
        });
	}

    // 完善信息
    addInfo(child) {
        console.log(child);
        this.childInfo = {
            child_id: child.childId,
            height: child.height,
            weight: child.weight,
            body_temperature: child.bodyTemperature,
            breathe: child.breathe,
            blood_pressure: child.bloodPressure,
            head_circum:child.headCircum,
        }
        this.modalAddInfo = true;
    }

    closeInfo() {
        this.modalAddInfo = false;
    }

    confirmInfo() {
        if(!this.adminService.isFalse(this.childInfo.height) && (parseFloat(this.childInfo.height) <= 0)){
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '身高应大于0', 3000);
            this.toastService.toast(toastCfg);
        }
        if(!this.adminService.isFalse(this.childInfo.weight) && (parseFloat(this.childInfo.weight) <= 0)){
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '体重应大于0', 3000);
            this.toastService.toast(toastCfg);
        }
        if(!this.adminService.isFalse(this.childInfo.body_temperature) && (parseFloat(this.childInfo.body_temperature) <= 0)){
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '体温应大于0', 3000);
            this.toastService.toast(toastCfg);
        }
        if(!this.adminService.isFalse(this.childInfo.breathe) && (parseFloat(this.childInfo.breathe) <= 0)){
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '呼吸应大于0', 3000);
            this.toastService.toast(toastCfg);
        }
        if(!this.adminService.isFalse(this.childInfo.blood_pressure) && (parseFloat(this.childInfo.blood_pressure) <= 0)){
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '血压应大于0', 3000);
            this.toastService.toast(toastCfg);
        }
        if(!this.adminService.isFalse(this.childInfo.head_circum) && (parseFloat(this.childInfo.head_circum) <= 0)){
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '头围应大于0', 3000);
            this.toastService.toast(toastCfg);
        }
        this.modalAddInfo = false;
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            id: this.childInfo.child_id,
            height: this.adminService.isFalse(this.childInfo.height) ? null: this.childInfo.height.toString(),
            weight: this.adminService.isFalse(this.childInfo.weight) ? null: this.childInfo.weight.toString(),
            body_temperature: this.adminService.isFalse(this.childInfo.body_temperature) ? null: this.childInfo.body_temperature.toString(),
            breathe: this.adminService.isFalse(this.childInfo.breathe) ? null: this.childInfo.breathe.toString(),
            blood_pressure: this.adminService.isFalse(this.childInfo.blood_pressure) ? null: this.childInfo.blood_pressure.toString(),
            head_circum: this.adminService.isFalse(this.childInfo.head_circum) ? null: this.childInfo.head_circum.toString(),
        }
        this.adminService.childinfo(this.childInfo.child_id, params).then((data) => {
            if(data.status == 'no'){
                const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
                this.toastService.toast(toastCfg);
            }else{
				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '完善信息成功', 3000);
				this.toastService.toast(toastCfg);
                this.getData();
            }
        }).catch((data) => {
            const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
            this.toastService.toast(toastCfg);
        });
    }
}
