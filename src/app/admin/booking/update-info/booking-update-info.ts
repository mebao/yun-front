import { Component }                  from '@angular/core';
import { ActivatedRoute }             from '@angular/router';

import { NzMessageService }           from 'ng-zorro-antd';

import { AdminService }               from '../../admin.service';

@Component({
    selector: 'admin-booking-update-info',
    templateUrl: './booking-update-info.html'
})

export class BookingUpdateInfo{
    topBar: {
        title: string,
        back: boolean,
    };
    url: string;
    showBookingInfo: boolean;
    bookingId: string;
    booking: {
        bookingId: string,
        childId: string,
        childName: string,
        fees: any[],
        services: any[],
        status: string,
        statusText: string,
        time: string,
        type: string,
        tranInfo: any,
        yyj: any,
        tranList: any[],
    };
    bookingInfo: {
        child: any,
        doctor: any,
        service: any,
        time: string,
        status: string,
    }
    booking_date = null;
    childList: any[];
    doctorList: any[];
    serviceList: any[];
    timeList: any[];
    statusList: any[];
    isVisible = false;
    isConfirmLoading = false;
    selectFee: {
        projectName: string,
        feeId: string,
    }
    updateFee: {
        projectName: string,
        feeId: string,
        price: string,
        number: string,
        fee: number,
    }
    payList: any[];
    updateTran: {
        id: string,
        type: string,
        typeText: string,
        need_amount: string,
        amount: string,
        give_amount: string,
        pay_way: string,
        pay_way_text: string,
        second_way: string,
        second_way_text: string,
        second_amount: string,
        remark: string,
    }

    constructor(
        private route: ActivatedRoute,
        private _message: NzMessageService,
        private as: AdminService,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '预约修改详情',
            back: true,
        }
        this.url = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;

        this.route.queryParams.subscribe((params) => {
            this.bookingId = params.id;
        });

        this.showBookingInfo = true;
        this.booking = {
            bookingId: '',
            childId: '',
            childName: '',
            fees: [],
            services: [],
            status: '',
            statusText: '',
            time: '',
            type: '',
            tranInfo: {},
            yyj: {},
            tranList: [],
        };
        this.bookingInfo = {
            child: {},
            doctor: {},
            service: {},
            time: '',
            status: '',
        }
        this.childList = [];
        this.getChildList();
        this.doctorList = [];
        this.getDoctorList();
        this.serviceList = [];
        this.getServiceList();
        this.timeList = [];
        this.getTimeList();
        this.statusList = [
            {id: '1', text: '待支付预约金'},
            {id: '2', text: '已支付预约金'},
            {id: '3', text: '已登记'},
            {id: '4', text: '就诊中'},
            {id: '11', text: '就诊结束'},
            {id: '5', text: '已完成'},
        ]
        this.selectFee = {
            projectName: '',
            feeId: '',
        }
        this.updateFee = {
            projectName: '',
            feeId: '',
            price: '',
            number: '',
            fee: 0,
        }
        this.payList = [];
        var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			this.setClinicData(JSON.parse(clinicdata));
		}else{
			this.as.clinicdata().then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.setClinicData(results);
				}
			}).catch(() => {
                this._message.error('服务器错误');
            });
		}
        this.updateTran = {
            id: '',
            type: '',
            typeText: '',
            need_amount: '',
            amount: '',
            give_amount: '',
            pay_way: '',
            pay_way_text: '',
            second_way: '',
            second_way_text: '',
            second_amount: '',
            remark: '',
        }

        this.getData();
    }

    getData() {
        var urlOptions = this.url + '&id=' + this.bookingId;
        this.as.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.weekbooks.length > 0){
                    this.booking = results.weekbooks[0];
                    this.booking.tranList = [];
                    if(this.booking.yyj.id){
                        this.booking.tranList.push({
                            id: this.booking.yyj.id,
                            type: this.booking.yyj.type,
                            typeText: this.booking.yyj.typeText,
                            need_amount: '',
                            amount: this.booking.yyj.amount,
                            give_amount: this.booking.yyj.giveAmount,
                            pay_way: this.booking.yyj.payWay,
                            pay_way_text: this.booking.yyj.wayText,
                            second_way: '',
                            second_way_text: '',
                            second_amount: '',
                            remark: this.booking.yyj.remark,
                        });
                    }
                    if(this.booking.tranInfo.id){
                        this.booking.tranList.push({
                            id: this.booking.tranInfo.id,
                            type: this.booking.tranInfo.type,
                            typeText: this.booking.tranInfo.typeText,
                            need_amount: this.booking.tranInfo.needAmount,
                            amount: this.booking.tranInfo.amount,
                            give_amount: this.booking.tranInfo.giveAmount,
                            pay_way: this.booking.tranInfo.payWay,
                            pay_way_text: this.booking.tranInfo.wayText,
                            second_way: this.booking.tranInfo.secondWay,
                            second_way_text: this.booking.tranInfo.secondWay ? this.booking.tranInfo.secondWayText : '',
                            second_amount: this.booking.tranInfo.secondAmount,
                            remark: this.booking.tranInfo.remark,
                        });
                    }
                }else{
                    this._message.error('未查询到该预约');
                }
            }
        }).catch((data) => {
            this._message.error(`服务器错误`);
        });
    }

    changeShowBookingInfo() {
        this.cancelFee();
        this.showBookingInfo = !this.showBookingInfo;
        if(!this.showBookingInfo){
            // 点击修改
            this.bookingInfo = {
                child: {},
                doctor: {},
                service: {},
                time: this.booking.time,
                status: this.booking.status,
            }
            // 获取小孩
            if(this.childList.length > 0){
                for(var child of this.childList){
                    if(child.childId == this.booking.childId){
                        this.bookingInfo.child = child;
                    }
                }
            }
            // 获取医生
            if(this.doctorList.length > 0){
                for(var doctor of this.doctorList){
                    if(doctor.doctorId == (this.booking.services.length > 0 ? this.booking.services[0].userDoctorId : '')){
                        this.bookingInfo.doctor = doctor;
                    }
                }
            }
            // 获取科室
            if(this.serviceList.length > 0){
                for(var service of this.serviceList){
                    if(service.serviceId == (this.booking.services.length > 0 ? this.booking.services[0].serviceId : '')){
                        this.bookingInfo.service = service;
                    }
                }
            }
            // 获取日期
            this.booking_date = this.booking.services.length > 0 ?  new Date(this.as.dateFormatHasWord(this.booking.services[0].serviceDate)) : '';
            // 获取时间
            if(this.timeList.length > 0){
                for(var time of this.timeList){
                    if(time.id == (this.booking.services.length > 0 ? this.booking.services[0].serviceTime : '')){
                        this.bookingInfo.time = time.id;
                    }
                }
            }
        }
    }

    getChildList() {
        this.as.searchchild(this.url).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.childList = [];
                if(results.child.length > 0){
                    for(var child of results.child){
                        this.childList.push({
                            childId: child.childId,
                            childName: child.childName,
                        });
                    }
                }
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    getDoctorList() {
        var urlOptions = this.url + '&role=2';
        this.as.adminlist(urlOptions).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.doctorList = [];
                if(results.adminlist.length > 0){
                    for(var doctor of results.adminlist){
                        this.doctorList.push({
                            doctorId: doctor.id,
                            doctorName: doctor.realName,
                        });
                    }
                }
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    getServiceList() {
        this.as.servicelist(this.url).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                this.serviceList = [];
                if(results.servicelist.length > 0){
                    for(var service of results.servicelist){
                        this.serviceList.push({
                            serviceId: service.serviceId,
                            serviceName: service.serviceName,
                        });
                    }
                }
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    getTimeList() {
        for(var i = 8; i < 24; i++){
            for(var j = 0; j < 4; j++){
                var second = '';
                switch(j){
                    case 0:
                        second = '00';
                        break;
                    case 1:
                        second = '20';
                        break;
                    case 2:
                        second = '30';
                        break;
                    case 3:
                        second = '40';
                        break;
                }
                this.timeList.push({
                    id: (i > 9 ? i : '0' + i) + ':' + second,
                    name: (i > 9 ? i : '0' + i) + ':' + second,
                });
            }
        }
    }

    setClinicData(clinicdata) {
        if(clinicdata.payWays){
            for(var pay in clinicdata.payWays){
                this.payList.push({
                    id: pay,
                    name: clinicdata.payWays[pay],
                });
            }
        }
    }

    saveInfo() {
        var param = {
			username: this.as.getUser().username,
			token: this.as.getUser().token,
			clinic_id: this.as.getUser().clinicId,
            type: this.booking.type,
			service_id: this.bookingInfo.service.serviceId,
            service_name: this.bookingInfo.service.serviceName,
			user_doctor_id: this.bookingInfo.doctor.doctorId,
			user_doctor_name: this.bookingInfo.doctor.doctorName,
			booking_date: this.as.getDayByDate(this.booking_date),
			time: this.bookingInfo.time,
            status: this.bookingInfo.status
		}
		this.as.updatebooking(this.bookingId, param).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                this._message.success('修改成功');
                this.showBookingInfo = true;
                this.getData();
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    deleteFee(fee) {
        this.selectFee = {
            projectName: fee.projectName,
            feeId: fee.feeId,
        }
        this.isVisible = true;
    }

    handleOk = (e) => {
        this.isConfirmLoading = true;
        var urlOptions = this.selectFee.feeId + '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        this.as.deletebkfee(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.isVisible = false;
                this.isConfirmLoading = false;
                this._message.error(data.errorMsg);
            }else{
                this._message.success('费用删除成功');
                this.isVisible = false;
                this.isConfirmLoading = false;
                this.getData();
            }
        }).catch(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
            this._message.error('服务器错误');
        });
    };

    handleCancel = (e) => {
        this.isVisible = false;
    };

    selectUpdateFee(fee) {
        this.showBookingInfo = true;
        this.updateFee = {
            projectName: fee.projectName,
            feeId: fee.feeId,
            price: fee.price,
            number: fee.number,
            fee: fee.fee,
        }
    }

    changeFee() {
        if(parseFloat(this.updateFee.price) < 0){
            this._message.error('费用单价不可小于0');
            return;
        }
        if(Number(this.updateFee.number) <= 0){
            this._message.error('消费数量不可小于等于0');
            return;
        }
        this.updateFee.fee = parseFloat(this.updateFee.price) * Number(this.updateFee.number);
    }

    cancelFee() {
        this.updateFee = {
            projectName: '',
            feeId: '',
            price: '',
            number: '',
            fee: 0,
        }
    }

    saveFee() {
        if(parseFloat(this.updateFee.price) < 0){
            this._message.error('费用单价不可小于0');
            return;
        }
        if(Number(this.updateFee.number) <= 0){
            this._message.error('消费数量不可小于等于0');
            return;
        }
        this.updateFee.fee = parseFloat(this.updateFee.price) * Number(this.updateFee.number);
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            booking_id: this.bookingId,
            project_name: this.updateFee.projectName,
            price: this.updateFee.price,
            number: this.updateFee.number,
            fee: this.updateFee.fee,
            id: this.updateFee.feeId,
        }
        this.as.addfee(params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                this._message.success('费用修改成功');
                this.cancelFee();
                this.getData();
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    selectUpdateTran(tran) {
        this.updateTran = {
            id: tran.id,
            type: tran.type,
            typeText: tran.typeText,
            need_amount: tran.need_amount,
            amount: tran.amount,
            give_amount: tran.give_amount,
            pay_way: tran.pay_way,
            pay_way_text: tran.pay_way_text,
            second_way: tran.second_way,
            second_way_text: tran.second_way_text,
            second_amount: tran.second_amount,
            remark: tran.remark,
        }
    }

    cancelTran() {
        this.updateTran = {
            id: '',
            type: '',
            typeText: '',
            need_amount: '',
            amount: '',
            give_amount: '',
            pay_way: '',
            pay_way_text: '',
            second_way: '',
            second_way_text: '',
            second_amount: '',
            remark: '',
        }
    }

    saveTran() {
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            need_amount: this.updateTran.type == '3' ? null : this.updateTran.need_amount,
            amount: this.updateTran.amount,
            give_amount: this.updateTran.give_amount,
            pay_way: this.updateTran.pay_way,
            second_way: this.updateTran.type == '3' ? null : this.updateTran.second_way,
            second_amount: this.updateTran.type == '3' ? null : this.updateTran.second_way ? this.updateTran.second_amount : null,
            remark: this.updateTran.remark,
        }
        this.as.updatetran(this.updateTran.id, params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                this._message.success('交易修改成功');
                this.cancelTran();
                this.getData();
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    changeTran() {

    }
}
