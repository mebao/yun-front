import { Component }                     from '@angular/core';
import { ActivatedRoute, Router }        from '@angular/router';
import { Location }                      from '@angular/common';

import { AdminService }                  from '../admin.service';
///<reference path="../../common/goeasy/goeasy.d.ts">

@Component({
    selector: 'admin-payment-booking-fee',
    templateUrl: './payment-booking-fee.html',
    styleUrls: ['./payment-booking-fee.scss'],
})

export class PaymentBookingFee{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
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
	};
    showTab: string;
    paymentInfo: {
        type: string,
        balance: string,
        canBalance: boolean,
        qrcode: boolean,
        qrcodeUrl: string,
        result: string,
    }
    // 禁止支付按钮连续提交
    btnCanEdit: boolean;
    modalConfirmTab: boolean;

    constructor(
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
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

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
		};

        var urlOptions = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&id=' + this.id;
        this.adminService.searchbooking(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.weekbooks.length > 0){
                    this.booking = results.weekbooks[0];
                    if(this.booking.fees.length > 0){
                        for(var i = 0; i < this.booking.fees.length; i++){
                            if(this.booking.fees[i].type == 'booking'){
                                this.booking.bookingFee = this.booking.fees[i].fee;
                            }
                        }
                    }
                    // 获取家长信息
                    this.getUserInfo(this.booking.creatorId);
                }
            }
        });

        this.showTab = '0';

        this.paymentInfo = {
            type: '',
            balance: '',
            canBalance: false,
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
             + '&id=' + id;
        this.adminService.searchuser(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.users.length > 0){
                    this.paymentInfo.balance = results.users[0].balance;
                    if(parseFloat(this.paymentInfo.balance) > parseFloat(this.booking.bookingFee)){
                        this.paymentInfo.canBalance = true;
                    }
                }
            }
        });
    }

    payment() {
        this.showTab = '1';
    }

    cancel() {
        this.showTab = '0';
        this.paymentInfo.type = '';
    }

    comfirm() {
        this.btnCanEdit = true;
        if(this.paymentInfo.type == '0'){
            // 余额支付
            var urlOptions = this.id + '?username=' + this.adminService.getUser().username
                 + '&token=' + this.adminService.getUser().token;
            this.adminService.memberbooking(urlOptions).then((data) => {
                if(data.status == 'no'){
                    this.toastTab(data.errorMsg, 'error');
                    this.btnCanEdit = false;
                }else{
    		        if(this.type == 'booking'){
                        this.toastTab('支付成功', '');
                        setTimeout(() => {
                            this.router.navigate(['./admin/bookingList']);
                        }, 2000);
                    }else if(this.type == 'bookingConfirm'){
                        this.toastTab('支付成功', '');
                        setTimeout(() => {
                            this.router.navigate(['./admin/bookingConfirm']);
                        }, 2000);
                    }else if(this.type == 'bookingIn'){
                        // 支付成功，后进行登记操作
                        this.bookingIn();
                    }
                }
            }).catch((data) => {
                this.toastTab('服务器数据错误', 'error');
            });
        }else{
            this.paymentInfo.qrcodeUrl = this.adminService.getUrl() + '/mebcrm/paybooking/' + this.id + '?username=' + this.adminService.getUser().username + '&token=' + this.adminService.getUser().token;
            this.paymentInfo.qrcode = true;
            this.getMessage(this.id);
        }
    }



    getMessage(id) {
		let that = this;
		// 接受授权推送
		var goEasy = new GoEasy({
			appkey: 'BC-ddb7b873cab7467a82e7555677a667a1'
		});

		goEasy.subscribe({
			channel: 'pay_yyj' + id,
			onMessage: function (message) {
                goEasy.unsubscribe({
        			channel: 'pay_yyj' + id,
                });
				that.paymentInfo.qrcode = false;
                that.paymentInfo.result = message.content;
                if(that.type == 'booking'){
                    that.modalConfirmTab = true;
                }else if(that.type == 'bookingConfirm'){
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
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
            }else{
                if(this.paymentInfo.type == '0'){
                    this.toastTab('支付成功，已登记', '');
                    setTimeout(() => {
                        this.confirm();
                    }, 2000);
                }else{
                    this.paymentInfo.result += '，登记成功';
                    this.modalConfirmTab = true;
                }
            }
        });
    }

    confirm() {
        if(this.type == 'booking'){
            this.router.navigate(['./admin/bookingList']);
        }else if(this.type == 'bookingConfirm'){
            this.router.navigate(['./admin/bookingConfirm']);
        }else if(this.type == 'bookingIn'){
            this.router.navigate(['./admin/bookingIn']);
        }
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
