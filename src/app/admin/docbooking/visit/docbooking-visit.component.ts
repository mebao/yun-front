import { Component }                         from '@angular/core';
import { Router }                            from '@angular/router';

import { NzMessageService }                  from 'ng-zorro-antd';

import { DoctorService }                     from '../../doctor/doctor.service';
import { AdminService }                      from '../../admin.service';

@Component({
    selector: 'admin-doctor-visit',
    templateUrl: './docbooking-visit.component.html',
	styles: [ `
		.ant-form-item-label label:after{
		    display: none;
		}
		.ant-form-item{
			margin-bottom: 0;
		}
	`
  	]
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
    modalAddInfoTab: boolean;
    childInfo: {
        child_id: string,
        height: string,
        weight: string,
        body_temperature: string,
        breathe: string,
        blood_pressure: string,
        head_circum: string,
    }
    _bookingDate = null;

    constructor(
        private _message: NzMessageService,
        public doctorService: DoctorService,
        public adminService: AdminService,
        private router: Router,
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

        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;

        this.visitList = [];
        this.hasData = false;

		var todayDate = this.adminService.getDayByDate(new Date());
        this._bookingDate = new Date();

        this.getData();

        this.canEdit = false;
        this.modalTabAgain = false;
        this.bookingId = '';

        this.modalAddInfoTab = false;
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

    getData() {
        this.loadingShow = true;
        var url = this.url + '&duty=' + this.adminService.getDayByDate(new Date(this._bookingDate));
        if(this.moduleAuthority.personal && !this.moduleAuthority.see){
            url += '&myself=1';
        }
        this.doctorService.doctorwork(url).then((data) => {
            if(data.status == 'no'){
		        this.loadingShow = false;
                this._message.error(data.errorMsg);
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
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    setData(data) {
        if(data.length > 0){
            for(var i = 0; i < data.length; i++){
                if(data[i].doctorChilds.length > 0){
                    var hasSelected = false;
                    for(var j = 0; j < data[i].doctorChilds.length; j++){
                        if(data[i].doctorChilds[j].status == '4'){
                            hasSelected = true;
                            data[i].hasSelected = true;
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
                    this._message.error(data.errorMsg);
                    this.canEdit = false;
                }else{
                    this._message.success('开始就诊');
                    this.getData();
                    this.canEdit = false;
                }
            }).catch((data) => {
                this._message.error('服务器错误');
                this.canEdit = false;
            });
        }else{
            var paramsEnd = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                end: dateString,
            }
            this.doctorService.updateservice(visit.selected, paramsEnd).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                    this.canEdit = false;
                }else{
                    this._message.success('结束就诊');
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
                this._message.error('服务器错误');
                this.canEdit = false;
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
                this._message.error(data.errorMsg);
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
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

    // 完善信息
    addInfo(child) {
        this.childInfo = {
            child_id: child.childId,
            height: child.height,
            weight: child.weight,
            body_temperature: child.bodyTemperature,
            breathe: child.breathe,
            blood_pressure: child.bloodPressure,
            head_circum:child.headCircum,
        }
        this.modalAddInfoTab = true;
    }

    closeInfo() {
        this.modalAddInfoTab = false;
    }

    confirmInfo() {
        if(!this.adminService.isFalse(this.childInfo.height) && (parseFloat(this.childInfo.height) <= 0)){
            this._message.error('身高应大于0');
        }
        if(!this.adminService.isFalse(this.childInfo.weight) && (parseFloat(this.childInfo.weight) <= 0)){
            this._message.error('体重应大于0');
        }
        if(!this.adminService.isFalse(this.childInfo.body_temperature) && (parseFloat(this.childInfo.body_temperature) <= 0)){
            this._message.error('体温应大于0');
        }
        if(!this.adminService.isFalse(this.childInfo.breathe) && (parseFloat(this.childInfo.breathe) <= 0)){
            this._message.error('呼吸应大于0');
        }
        if(!this.adminService.isFalse(this.childInfo.blood_pressure) && (parseFloat(this.childInfo.blood_pressure) <= 0)){
            this._message.error('血压应大于0');
        }
        if(!this.adminService.isFalse(this.childInfo.head_circum) && (parseFloat(this.childInfo.head_circum) <= 0)){
            this._message.error('头围应大于0');
        }
        this.modalAddInfoTab = false;
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
                this._message.error(data.errorMsg);
            }else{
                this._message.success('完善信息成功');
                this.getData();
            }
        }).catch((data) => {
            this._message.error('服务器错误');
        });
    }
}
