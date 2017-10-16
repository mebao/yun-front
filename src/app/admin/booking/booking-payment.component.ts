import { Component }                               from '@angular/core';
import { ActivatedRoute, Router }                  from '@angular/router';

import { AdminService }                            from '../admin.service';

@Component({
	selector: 'admin-booking-payment',
	templateUrl: './booking-payment.component.html',
	styleUrls: ['./booking-payment.component.scss'],
})
export class BookingPaymentComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	bookingInfo: {
		age: string,
		allFee: string,
		bookingDate: string,
		bookingId: string,
		childId: string,
		childName: string,
		creatorId: string,
		creatorName: string,
		fees: any[],
		mobile: string,
		refNo: string,
		services: any[],
		status: string,
		statusText: string,
		time: string,
		type: string,
	}
	url: string;
	id: string;
	fee: {
		remark: string,
		canPay: string,
		feeInfo: {
			serviceFeeList: any[],
			serviceOriginalFee: string,
			serviceFee: string,
			checkFeeList: any[],
			checkOriginalFee: string,
			checkFee: string,
			medicalFeeList: any[],
			medicalOriginalFee: string,
			medicalFee: string,
			otherFeeList: any[],
			otherOriginalFee: string,
			otherFee: string,
		},
		fee: string,
		originalCost: string,
	};
	//获取用户会员信息
	userMember: {
		member: boolean,
		balance: string,
		service: string,
		services: any[],
		check: string,
		prescript: string,
		other: string,
	}
	modalTab: boolean;
	payInfo: {
		payWay: string,
		memberBalance: boolean,
		give_amount: string,
		remark: string,
	}

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '付款',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.bookingInfo = JSON.parse(sessionStorage.getItem('bookingInfo'));

		//获取费用详情
		this.fee = {
			remark: '',
			canPay: '',
			feeInfo: {
				serviceFeeList: [],
				serviceOriginalFee: '',
				serviceFee: '',
				checkFeeList: [],
				checkOriginalFee: '',
				checkFee: '',
				medicalFeeList: [],
				medicalOriginalFee: '',
				medicalFee: '',
				otherFeeList: [],
				otherOriginalFee: '',
				otherFee: '',
			},
			fee: '',
			originalCost: '',
		}

		this.userMember = {
			member: false,
			balance: '0.00',
			service: '1.00',
			services: [],
			check: '1.00',
			prescript: '1.00',
			other: '1.00',
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.modalTab = false;
		this.payInfo = {
			payWay: '',
			memberBalance: false,
			give_amount: '',
			remark: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		this.adminService.bookingfee(this.id + this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.fee.remark = results.tranRemark;
				var userUrl = this.url + '&id=' + this.bookingInfo.creatorId;
				this.adminService.searchuser(userUrl).then((userData) => {
					if(userData.status == 'no'){
						this.toastTab(userData.errorMsg, 'error');
					}else{
						var userResults = JSON.parse(JSON.stringify(userData.results));
						if(userResults.users.length > 0 && userResults.users[0].memberId){
							this.userMember.member = true;
							this.userMember.balance = this.adminService.toDecimal2(userResults.users[0].balance);
							//获取会员折扣信息
							var memberUrl = this.url + '&clinic_id=' + this.adminService.getUser().clinicId
								 + '&id=' + userResults.users[0].memberId;
							this.adminService.memberlist(memberUrl).then((memberData) => {
								if(memberData.status == 'no'){
									this.toastTab(memberData.errorMsg, 'error');
								}else{
									var memberResults = JSON.parse(JSON.stringify(memberData.results));
									if(memberResults.list.length > 0){
										this.userMember.service = this.adminService.toDecimal2(Number(memberResults.list[0].service) / 100);
										this.userMember.services = memberResults.list[0].services;
										this.userMember.check = this.adminService.toDecimal2(Number(memberResults.list[0].check) / 100);
										this.userMember.prescript = this.adminService.toDecimal2(Number(memberResults.list[0].prescript) / 100);
										this.userMember.other = this.adminService.toDecimal2(Number(memberResults.list[0].other) / 100);
										//计算折扣后的费用信息
										this.getFeeInfo(this.userMember, results);
									}
								}
							});
						}else{
							//计算折扣后的费用信息
							this.getFeeInfo(this.userMember, results);
						}
					}
				});
			}
		});
	}

	getFeeInfo(userMember, results) {
		if(results.feeinfo['医生服务费用'].length > 0){
			for(var i = 0; i < results.feeinfo['医生服务费用'].length; i++){
				var serviceDiscount = '';
				// 便利会员折扣
				if(userMember.services.length > 0){
					for(var j = 0; j < userMember.services.length; j++){
						// 通过serviceId
						if(results.feeinfo['医生服务费用'][i].serviceId == userMember.services[j].serviceId){
							serviceDiscount = this.adminService.toDecimal2(Number(userMember.services[j].discount) / 100);
						}
					}
				}
				results.feeinfo['医生服务费用'][i].serviceDiscount = serviceDiscount;
			}
		}
		this.fee = {
			remark: this.fee.remark,
			canPay: results.canPay,
			feeInfo: {
				serviceFeeList: results.feeinfo['医生服务费用'],
				serviceOriginalFee: '',
				serviceFee: '',
				checkFeeList: results.feeinfo['检查项目费用'],
				checkOriginalFee: '',
				checkFee: '',
				medicalFeeList: results.feeinfo['药方药品费用'],
				medicalOriginalFee: '',
				medicalFee: '',
				otherFeeList: results.feeinfo['其他费用'],
				otherOriginalFee: '',
				otherFee: '',
			},
			fee: '',
			originalCost: '',
		}

		// 折扣费用
		var fee = 0;
		// 原价
		var originalCost = 0;
		//服务
		var serviceFee = 0;
		var originalServiceFee = 0;
		if(this.fee.feeInfo.serviceFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.serviceFeeList.length; i++){
				// 如果具体服务折扣存在，则以具体服务折扣计算，否则以默认服务折扣计算
				serviceFee += parseFloat(this.fee.feeInfo.serviceFeeList[i].fee) * parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceDiscount != '' ? this.fee.feeInfo.serviceFeeList[i].serviceDiscount : userMember.service);
				originalServiceFee += parseFloat(this.fee.feeInfo.serviceFeeList[i].fee);
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(serviceFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalServiceFee));
		this.fee.feeInfo.serviceFee = this.adminService.toDecimal2(serviceFee);
		this.fee.feeInfo.serviceOriginalFee = this.adminService.toDecimal2(originalServiceFee);
		//检查
		var checkFee = 0;
		var originalCheckFee = 0;
		if(this.fee.feeInfo.checkFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.checkFeeList.length; i++){
				checkFee += parseFloat(this.fee.feeInfo.checkFeeList[i].fee) * parseFloat(userMember.check);
				originalCheckFee += parseFloat(this.fee.feeInfo.checkFeeList[i].fee);
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(checkFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalCheckFee));
		this.fee.feeInfo.checkFee = this.adminService.toDecimal2(checkFee);
		this.fee.feeInfo.checkOriginalFee = this.adminService.toDecimal2(originalCheckFee);
		//药品
		var medicalFee = 0;
		var originalMedicalFee = 0;
		if(this.fee.feeInfo.medicalFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.medicalFeeList.length; i++){
				if(this.fee.feeInfo.medicalFeeList[i].info.length > 0){
					for(var j = 0; j < this.fee.feeInfo.medicalFeeList[i].info.length; j++){
						//判断是否可以打折
						if(this.fee.feeInfo.medicalFeeList[i].info[j].canDiscount == '0'){
							//不可优惠
							medicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num);
						}else{
							//可以优惠
							medicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * Number(this.fee.feeInfo.medicalFeeList[i].info[j].num) * parseFloat(userMember.prescript);
						}
						originalMedicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num);
					}
				}
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(medicalFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalMedicalFee));
		this.fee.feeInfo.medicalFee = this.adminService.toDecimal2(medicalFee);
		this.fee.feeInfo.medicalOriginalFee = this.adminService.toDecimal2(originalMedicalFee);
		//其他
		var otherFee = 0;
		var originalOtherFee = 0;
		if(this.fee.feeInfo.otherFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.otherFeeList.length; i++){
				otherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].fee) * parseFloat(userMember.other);
				originalOtherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].fee) * parseFloat(userMember.other);
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(otherFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalOtherFee));
		this.fee.feeInfo.otherFee = this.adminService.toDecimal2(otherFee);
		this.fee.feeInfo.otherOriginalFee = this.adminService.toDecimal2(originalOtherFee);

		//判断余额是否足够支付
		if(fee <= parseFloat(this.userMember.balance)){
			this.payInfo.memberBalance = true;
		}

		this.fee.fee = this.adminService.toDecimal2(fee);
		this.fee.originalCost = this.adminService.toDecimal2(originalCost);
	}

	close() {
		this.modalTab = false;
		this.payInfo.payWay = '';
		this.payInfo.give_amount = '';
		this.payInfo.remark = '';
	}

	pay() {
		this.payInfo.payWay = '';
		this.modalTab = true;
	}

	confirmPay() {
		if(this.payInfo.payWay == ''){
			this.toastTab('请选择支付方式', 'error');
			return;
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount) && Number(this.payInfo.give_amount) <= 0){
			this.toastTab('减免金额应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount) && this.adminService.isFalse(this.payInfo.remark)){
			this.toastTab('减免金额存在时，备注不可为空', 'error');
			return;
		}
		var amountFee = '';
		if(!this.adminService.isFalse(this.payInfo.give_amount)){
			amountFee = this.adminService.toDecimal2(Number(this.fee.fee) - Number(this.payInfo.give_amount));
			if(Number(amountFee) < 0){
				this.toastTab('减免金额不可大于应付金额', 'error');
				return;
			}
		}else{
			amountFee = this.fee.fee;
		}

		this.modalTab = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			user_id: this.bookingInfo.creatorId,
			user_name: this.bookingInfo.creatorName,
			amount: amountFee,
			need_amount: this.fee.originalCost,
			pay_way: this.payInfo.payWay,
			give_amount: this.adminService.isFalse(this.payInfo.give_amount) ? null : this.payInfo.give_amount,
			remark: this.payInfo.remark,
		}
		this.adminService.feepay(this.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('支付完成', '');
				setTimeout(() => {
					this.router.navigate(['./admin/bookingCharge']);
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
