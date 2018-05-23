import { Component }                   from '@angular/core';

import { NzMessageService }            from 'ng-zorro-antd';

import { AdminService }                from '../../admin.service';

@Component({
    selector: 'admin-booking-assist-list',
    templateUrl: './booking-assist-list.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class BookingAssistList{
    topBar: {
        title: string,
        back: boolean,
    };
	// 权限
	moduleAuthority: {
		see: boolean,
		confirm: boolean,
        confirmOut: boolean,
	}
    loadingShow: boolean;
    hasData: boolean;
    assistList: any[];
    bookingAssistList: any[];
    searchInfo: {
        assist_id: string,
        doctor_name: string,
        child_name: string,
        is_finish: string,
    }
    _startDate = null;
    _endDate = null;
    url: string;
    modalConfirmTab: boolean;
    selectedInfo: {
        assist: any,
        text: string,
        medical: any,
        type: string,
    }
    asssitMList: any[];
    searchInfoM: {
        startDate: Date,
        endDate: Date,
    }

    constructor(
        private _message: NzMessageService,
        private adminService: AdminService,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '辅助治疗',
            back: false,
        }

		//权限
		this.moduleAuthority = {
			see: false,
    		confirm: false,
            confirmOut: false,
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

        var todayDate = this.adminService.getDayByDate(new Date());
        this.searchInfo = {
            assist_id: '',
            doctor_name: '',
            child_name: '',
            is_finish: '0',
        }
        this._startDate = new Date();
        this._endDate = new Date();
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-bookingAssistList'));
        if(sessionSearch){
			this.searchInfo = {
                assist_id: sessionSearch.assist_id,
                doctor_name: sessionSearch.doctor_name,
                child_name: sessionSearch.child_name,
                is_finish: sessionSearch.is_finish,
            }
            this._startDate = sessionSearch._startDate ? new Date(sessionSearch._startDate) : null;
            this._endDate = sessionSearch._endDate ? new Date(sessionSearch._endDate) : null;
		}

        this.hasData = false;
        this.assistList = [];
        this.bookingAssistList = [];

        this.url = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId;
        this.modalConfirmTab = false;
        this.selectedInfo = {
            assist: {},
            text: '',
            medical: '',
            type: '',
        }

        var searchassistUrl = this.url + '&status=1'
        this.adminService.searchassist(searchassistUrl).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.assistList = results.list;
            }
        }).catch((data) => {
            this._message.error('服务器错误');
        });
        this.search();
        this.asssitMList = [];
        this.searchInfoM = {
            startDate: null,
            endDate: null,
        }
    }

    getData(urlOptions) {
        this.adminService.bookingassist(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                // var newList = [];
                // if(results.list.length > 0){
                //     for(var i = 0; i < results.list.length; i++){
                //         results.list[i].bookingDate = this.adminService.dateFormat(results.list[i].bookingDate);
                //         // 判断该bookingId是否已经存在
                //         if(newList.length > 0){
                //             var hasBoolean = false;
                //             for(var j = 0; j < newList.length; j++){
                //                 if(results.list[i].bookingId == newList[j].bookingId){
                //                     hasBoolean = true;
                //                     newList[j].infoList.push(results.list[i]);
                //                 }
                //             }
                //             if(!hasBoolean){
                //                 newList.push({
                //                     bookingId: results.list[i].bookingId,
                //                     infoList: [results.list[i]],
                //                 });
                //             }
                //         }else{
                //             newList.push({
                //                 bookingId: results.list[i].bookingId,
                //                 infoList: [results.list[i]],
                //             });
                //         }
                //     }
                // }
                this.bookingAssistList = results.list;
                this.hasData = true;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    search() {
        this.loadingShow = true;
		sessionStorage.setItem('search-bookingAssistList', JSON.stringify({
            assist_id: this.searchInfo.assist_id,
            doctor_name: this.searchInfo.doctor_name,
            child_name: this.searchInfo.child_name,
            _startDate: this._startDate,
            _endDate: this._endDate,
        }));
        var urlOptions = this.url;
        if(this.searchInfo.assist_id && this.searchInfo.assist_id != ''){
            urlOptions += '&assist_id=' + this.searchInfo.assist_id;
        }
        if(this.searchInfo.doctor_name && this.searchInfo.doctor_name != ''){
            urlOptions += '&doctor_name=' + this.searchInfo.doctor_name;
        }
        if(this.searchInfo.child_name && this.searchInfo.child_name != ''){
            urlOptions += '&child_name=' + this.searchInfo.child_name;
        }
        if(this.searchInfo.is_finish && this.searchInfo.is_finish != ''){
            urlOptions += '&is_finish=' + this.searchInfo.is_finish;
        }
        if(this._startDate){
            urlOptions += '&bdate_big=' + this.adminService.getDayByDate(new Date(this._startDate));
        }
        if(this._endDate){
            urlOptions += '&bdate_less=' + this.adminService.getDayByDate(new Date(this._endDate));
        }
        this.getData(urlOptions);
    }

    _disabledStartDate = (startValue) => {
        if (!startValue || !this._endDate) {
            return false;
        }
        return startValue.getTime() > this._endDate.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this._startDate) {
            return false;
        }
        return endValue.getTime() < this._startDate.getTime();
    };

    //宝宝详情
    childInfo(_id) {
        window.open('./admin/child/info?id=' + _id);
    }

    finish(info) {
        this.selectedInfo = {
            assist: info,
            text: `确认完成-${info.childName}-（${info.number}次：${info.assistName}）`,
            medical: {},
            type: 'assist',
        }
        this.modalConfirmTab = true;
    }

    closeConfirm() {
        this.modalConfirmTab = false;
        this.selectedInfo = {
            assist: {},
            text: '',
            medical: {},
            type: '',
        }
    }

    confirm() {
        this.modalConfirmTab = false;
        if(this.selectedInfo.type == 'assist'){
            // 完成辅助治疗
            var params = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                clinic_id: this.adminService.getUser().clinicId,
                id: this.selectedInfo.assist.id,
            }
            this.adminService.finishassist(this.selectedInfo.assist.id, params).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                }else{
                    this.search();
                    this._message.success('完成成功');
                }
            }).catch(() => {
                this._message.error('服务器错误');
            });
        }else{
            // 药品完成出库操作
            var outParams = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                clinic_id: this.adminService.getUser().clinicId,
                bdate_big: this.searchInfoM.startDate ? this.adminService.getDayByDate(new Date(this.searchInfoM.startDate)) : null,
                bdate_less: this.searchInfoM.endDate ? this.adminService.getDayByDate(new Date(this.searchInfoM.endDate)) : null
            }
            this.adminService.outassistdrug(this.selectedInfo.medical.durgId, outParams).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                }else{
                    this._message.success('完成成功');
                    this.searchMList();
                }
            }).catch(() => {
                this._message.error('服务器错误');
            });
        }
    }

    searchMList() {
        var urlOptions = this.url;
        this.getDataMedical(urlOptions);
    }

    getDataMedical(urlOptions) {
        this.loadingShow = true;
        this.adminService.countassist(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.asssitMList = results.list;
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    _disabledStartDateM = (startValue) => {
        if (!startValue || !this.searchInfoM.endDate) {
            return false;
        }
        return startValue.getTime() > this.searchInfoM.endDate.getTime();
    };

    _disabledEndDateM = (endValue) => {
        if (!endValue || !this.searchInfoM.startDate) {
            return false;
        }
        return endValue.getTime() < this.searchInfoM.startDate.getTime();
    };

    confirmOut(info) {
        this.selectedInfo = {
            assist: {},
            text: `确认-${info.name}-（${info.num}${info.unit}）完成出库`,
            medical: info,
            type: 'out',
        }
        this.modalConfirmTab = true;
    }
}
