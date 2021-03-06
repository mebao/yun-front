import { Component }                     from '@angular/core';
import { ActivatedRoute, Router }        from '@angular/router';
import { Location }                      from '@angular/common';

import { NzMessageService }              from 'ng-zorro-antd';

import { AdminService }                  from '../../admin.service';
//<reference path="../../common/goeasy/goeasy.d.ts">

@Component({
    selector: 'admin-payment-booking-fee',
    templateUrl: './payment-booking-fee.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class PaymentBookingFee{
	topBar: {
		title: string,
		back: boolean,
	};
    id: string;
    type: string;
	booking: {
		age: string,
		bookingDate: string,
		bookingId: string,
		childId: string,
		childName: string,
		creatorId: string,
		creatorName: string,
		refNo: string,
		serviceId: string,
		serviceName: string,
		time: string,
		type: string,
		userDoctorId: string,
		userDoctorName: string,
		services: any[],
		fees: any[],
		status: string,
		totalFee: string,
		remark: string,
        bookingFee: string,
        serviceFee: string,
	};
    showTab: string;
    paymentInfo: {
        member: boolean,
        memberId: string,
        memberName: string,
        balanceCanPay: boolean,
        payType: string,
        type: string,
        userBalance: string,
        qrcode: boolean,
        qrcodeUrl: string,
        result: string,
    }
    // 禁止支付按钮连续提交
    btnCanEdit: boolean;
    modalConfirmTab: boolean;
    loadingShow = false;

    constructor(
        private _message: NzMessageService,
        public adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
    ) {}

    ngOnInit() {
        this.topBar = {
            title: '支付预约金',
            back: true,
        }

        this.id = '';
        this.type = '';
        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.type = params.type;
        });

		this.booking = {
			age: '',
			bookingDate: '',
			bookingId: '',
			childId: '',
			childName: '',
			creatorId: '',
			creatorName: '',
			refNo: '',
			serviceId: '',
			serviceName: '',
			time: '',
			type: '',
			userDoctorId: '',
			userDoctorName: '',
			services: [],
			fees: [],
			status: '',
			totalFee: '',
			remark: '',
            bookingFee: '0',
            serviceFee: '',
		};

        this.loadingShow = true;

        var urlOptions = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&id=' + this.id;
        this.adminService.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.weekbooks.length > 0){
                    this.booking = results.weekbooks[0];
                    if(this.booking.fees.length > 0){
                        for(var i = 0; i < this.booking.fees.length; i++){
                            if(this.booking.fees[i].type == 'booking'){
                                this.booking.bookingFee = this.booking.fees[i].fee;
                            }
                            if(this.booking.fees[i].type == 'service'){
                                this.booking.serviceFee = this.booking.fees[i].fee;
                            }
                        }
                    }
                    // 预约未支付预约金，开启推送通道
                    if(this.booking.status == '1'){
                        // this.getMessage(this.id);
                    }
                    // 获取家长信息
                    this.getUserInfo(this.booking.creatorId);
                }
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });

        this.showTab = '0';

        this.paymentInfo = {
            member: false,
            memberId: '',
            memberName: '',
            balanceCanPay: false,
            payType: '',
            type: '',
            userBalance: '',
            qrcode: false,
            qrcodeUrl: '',
            result: '',
        }

        this.btnCanEdit = false;
        this.modalConfirmTab = false;
    }

    // 获取家长信息，是否是会员
    getUserInfo(id) {
        var urlOptions = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&id=' + id;
        this.adminService.searchuser(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.users.length > 0){
                    this.paymentInfo.userBalance = results.users[0].userBalance;
                    // 判断会员余额是否足够支付
                    if(parseFloat(results.users[0].userBalance) >= parseFloat(this.booking.bookingFee)){
                        this.paymentInfo.balanceCanPay = true;
                    }else{
                        this.paymentInfo.balanceCanPay = false;
                    }
                    this.paymentInfo.memberId = results.users[0].memberId;
                    this.paymentInfo.memberName = results.users[0].memberName;
                    // 判断是否是会员，如果是会员，则不可支付全额
                    if(results.users[0].memberId == null){
                        this.paymentInfo.member = false;
                    }else{
                        this.paymentInfo.member = true;
                        this.paymentInfo.payType = 'yyj';
                    }
                }
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    changePayType() {
        if(this.paymentInfo.payType == ''){
            this.cancel();
        }
    }

    payment() {
        if(this.paymentInfo.payType == ''){
            this._message.error('请先选择支付类型');
            return;
        }
        this.showTab = '1';
    }

    cancel() {
        this.showTab = '0';
        this.paymentInfo.type = '';
    }

    closeQrcode() {
        this.btnCanEdit = false;
        this.paymentInfo.qrcode = false;
    }

    comfirm() {
        this.btnCanEdit = true;
        if(this.adminService.isFalse(this.paymentInfo.type)){
            this._message.error('支付方式不可为空');
            this.btnCanEdit = false;
            return;
        }
        if(this.paymentInfo.type.indexOf('member') != -1 || this.paymentInfo.type == 'card' || this.paymentInfo.type == 'money' || this.paymentInfo.type == 'wc_zhuan'){
            this.loadingShow = true;
            // 支付
            var urlOptions = this.id + '?username=' + this.adminService.getUser().username
                 + '&token=' + this.adminService.getUser().token
                 + '&pay_way=' + this.paymentInfo.type
                 + '&type=' + this.paymentInfo.payType;
            this.adminService.memberbooking(urlOptions).then((data) => {
                if(data.status == 'no'){
                    this.loadingShow = false;
                    this.btnCanEdit = false;
                    this._message.error(data.errorMsg);
                }else{
    		        if(this.type == 'booking'){
                        this.loadingShow = false;
                        this._message.success('支付成功');
                        setTimeout(() => {
                            this.router.navigate(['./admin/bookingList']);
                        }, 2000);
                    }else if(this.type == 'bookingConfirm'){
                        this.loadingShow = false;
                        this._message.success('支付成功');
                        setTimeout(() => {
                            this.router.navigate(['./admin/bookingConfirm']);
                        }, 2000);
                    }else if(this.type == 'bookingList'){
                        this.loadingShow = false;
                        this._message.success('支付成功');
                        setTimeout(() => {
                            this.router.navigate(['./admin/bookingList']);
                        }, 2000);
                    }else if(this.type == 'bookingIn'){
                        // 支付成功，后进行登记操作
                        this.bookingIn();
                    }
                }
            }).catch((data) => {
                this.loadingShow = false;
                this.btnCanEdit = false;
                this._message.error('服务器数据错误');
            });
        }else{
            this.paymentInfo.qrcodeUrl = this.adminService.getUrl() + '/mebcrm/paybooking/' + this.id + '?username=' + this.adminService.getUser().username + '&token=' + this.adminService.getUser().token + '&pay_way=' + this.paymentInfo.type + '&type=' + this.paymentInfo.payType;
            this.paymentInfo.qrcode = true;
        }
    }

    getMessage(id) {
		let that = this;
		// 接受授权推送
		var goEasy = new GoEasy({
			appkey: 'BS-7bc92c359e3c48399dc20be67c1013a4'
		});

		goEasy.subscribe({
			channel: 'pay_yyj' + id,
			onMessage: function (message) {
                console.log(message);
                goEasy.unsubscribe({
        			channel: 'pay_yyj' + id,
                });
				that.paymentInfo.qrcode = false;
                that.paymentInfo.result = message.content;
                if(that.type == 'booking'){
                    that.modalConfirmTab = true;
                }else if(that.type == 'bookingConfirm'){
                    that.modalConfirmTab = true;
                }else if(that.type == 'bookingList'){
                    that.modalConfirmTab = true;
                }else if(that.type == 'bookingIn'){
                    // 支付成功，后进行登记操作
                    that.bookingIn();
                }
			}
		});
	}

    // 登记
    bookingIn() {
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            status: 3,
        }
        this.adminService.updatebookstatus(this.booking.bookingId ,params).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this.btnCanEdit = false;
                this._message.error(data.errorMsg);
            }else{
                this.loadingShow = false;
                if(this.paymentInfo.type == '0'){
                    this._message.success('支付成功，已登记');
                    setTimeout(() => {
                        this.confirm();
                    }, 2000);
                }else{
                    this.paymentInfo.result += '登记成功';
                    this.modalConfirmTab = true;
                }
            }
        }).catch(() => {
            this.loadingShow = false;
            this.btnCanEdit = false;
            this._message.error('服务器错误');
        });
    }

    confirm() {
        if(this.type == 'booking'){
            this.router.navigate(['./admin/bookingList']);
        }else if(this.type == 'bookingConfirm'){
            this.router.navigate(['./admin/bookingConfirm']);
        }else if(this.type == 'bookingList'){
            this.router.navigate(['./admin/bookingList']);
        }else if(this.type == 'bookingIn'){
            this.router.navigate(['./admin/bookingIn']);
        }
    }
}
