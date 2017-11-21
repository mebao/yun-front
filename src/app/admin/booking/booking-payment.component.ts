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
	loadingShow: boolean;
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
			serviceDiscount: string,
			serviceFee: string,
			assistFeeList: any[],
			assistOriginalFee: string,
			assistDiscount: string,
			assistFee: string,
			checkFeeList: any[],
			checkOriginalFee: string,
			checkDiscount: string,
			checkFee: string,
			medicalFeeList: any[],
			medicalOriginalFee: string,
			medicalDiscount: string,
			medicalFee: string,
			otherFeeList: any[],
			otherOriginalFee: string,
			otherDiscount: string,
			otherFee: string,
			bookingFee: string,
		},
		// 费用合计
		originalCost: string,
		// 应收费用
		fee: string,
		// 实收费用
		realFee: string,
	};
	//获取用户会员信息
	userMember: {
		member: boolean,
		balance: string,
		service: string,
		services: any[],
		assist: string,
		assists: any[],
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
	// 不可连续点击
	btnCanEdit: boolean;

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

		this.loadingShow = true;

		//获取费用详情
		this.fee = {
			remark: '',
			canPay: '',
			feeInfo: {
				serviceFeeList: [],
				serviceOriginalFee: '',
				serviceDiscount: '',
				serviceFee: '',
				assistFeeList: [],
				assistOriginalFee: '',
				assistDiscount: '',
				assistFee: '',
				checkFeeList: [],
				checkOriginalFee: '',
				checkDiscount: '',
				checkFee: '',
				medicalFeeList: [],
				medicalOriginalFee: '',
				medicalDiscount: '',
				medicalFee: '',
				otherFeeList: [],
				otherOriginalFee: '',
				otherDiscount: '',
				otherFee: '',
				bookingFee: '',
			},
			originalCost: '',
			fee: '',
			realFee: '',
		}

		this.userMember = {
			member: false,
			balance: '0.00',
			service: '1.00',
			services: [],
			assist: '1.00',
			assists: [],
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
				this.loadingShow = false;
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
								 + '&id=' + userResults.users[0].memberId + '&status=1';
							this.adminService.memberlist(memberUrl).then((memberData) => {
								if(memberData.status == 'no'){
									this.toastTab(memberData.errorMsg, 'error');
								}else{
									var memberResults = JSON.parse(JSON.stringify(memberData.results));
									if(memberResults.list.length > 0){
										this.userMember.service = this.adminService.isFalse(memberResults.list[0].service) ? '1.00' : this.adminService.toDecimal2(Number(memberResults.list[0].service) / 100);
										this.userMember.services = memberResults.list[0].services;
										this.userMember.assist = this.adminService.isFalse(memberResults.list[0].assist) ? '1.00' :  this.adminService.toDecimal2(Number(memberResults.list[0].assist) / 100);
										this.userMember.assists = memberResults.list[0].assists;
										this.userMember.check = this.adminService.toDecimal2(Number(memberResults.list[0].check) / 100);
										this.userMember.prescript = this.adminService.toDecimal2(Number(memberResults.list[0].prescript) / 100);
										this.userMember.other = this.adminService.toDecimal2(Number(memberResults.list[0].other) / 100);
									}
									//计算折扣后的费用信息
									this.getFeeInfo(this.userMember, results);
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

		this.btnCanEdit = false;
	}

	getFeeInfo(userMember, results) {
		if(results.feeinfo['医生服务费用'].length > 0){
			for(var i = 0; i < results.feeinfo['医生服务费用'].length; i++){
				var serviceDiscount = '';
				// 遍历会员科室折扣
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
		if(results.feeinfo['辅助项目费用'].length > 0){
			for(var i = 0; i < results.feeinfo['辅助项目费用'].length; i++){
				var assistDiscount = '';
				// 遍历会员辅助项目折扣
				if(userMember.assists.length > 0){
					for(var j = 0; j < userMember.assists.length; j++){
						// 通过assistId
						if(results.feeinfo['辅助项目费用'][i].projectId == userMember.assists[j].assistId){
							assistDiscount = this.adminService.toDecimal2(Number(userMember.assists[j].discount) / 100);
						}
					}
				}
				results.feeinfo['辅助项目费用'][i].assistDiscount = assistDiscount;
			}
		}
		this.fee = {
			remark: this.fee.remark,
			canPay: results.canPay,
			feeInfo: {
				serviceFeeList: results.feeinfo['医生服务费用'],
				serviceOriginalFee: '',
				serviceDiscount: '',
				serviceFee: '',
				assistFeeList: results.feeinfo['辅助项目费用'],
				assistOriginalFee: '',
				assistDiscount: '',
				assistFee: '',
				checkFeeList: results.feeinfo['检查项目费用'],
				checkOriginalFee: '',
				checkDiscount: '',
				checkFee: '',
				medicalFeeList: results.feeinfo['药方药品费用'],
				medicalOriginalFee: '',
				medicalDiscount: '',
				medicalFee: '',
				otherFeeList: results.feeinfo['其他费用'],
				otherOriginalFee: '',
				otherDiscount: '',
				otherFee: '',
				bookingFee: results.feeinfo['预约金'].fee,
			},
			originalCost: '',
			fee: '',
			realFee: '',
		}


		// 折扣费用
		var fee = 0;
		// 原价
		var originalCost = 0;
		//科室
		var serviceFee = 0;
		var originalServiceFee = 0;
		if(this.fee.feeInfo.serviceFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.serviceFeeList.length; i++){
				// 如果具体科室折扣存在，则以具体科室折扣计算，否则以默认科室折扣计算
				serviceFee += parseFloat(this.fee.feeInfo.serviceFeeList[i].fee) * parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceDiscount != '' ? this.fee.feeInfo.serviceFeeList[i].serviceDiscount : userMember.service);
				originalServiceFee += parseFloat(this.fee.feeInfo.serviceFeeList[i].fee);
			}
		}
		// 科室费用，应减去对应的预约金
		serviceFee = serviceFee - parseFloat(this.fee.feeInfo.bookingFee);
		fee += parseFloat(this.adminService.toDecimal2(serviceFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalServiceFee));
		this.fee.feeInfo.serviceFee = this.adminService.toDecimal2(serviceFee);
		this.fee.feeInfo.serviceOriginalFee = this.adminService.toDecimal2(originalServiceFee);
		this.fee.feeInfo.serviceDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.serviceOriginalFee) - parseFloat(this.fee.feeInfo.serviceFee) - parseFloat(this.fee.feeInfo.bookingFee));
		// 辅助项目
		var assistFee = 0;
		var originalAssistFee = 0;
		if(this.fee.feeInfo.assistFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.assistFeeList.length; i++){
				// 如果具体辅助项目折扣存在，则以具体辅助项目折扣计算，否则以默认辅助项目折扣计算
				assistFee += parseFloat(this.fee.feeInfo.assistFeeList[i].fee) * parseFloat(this.fee.feeInfo.assistFeeList[i].assistDiscount != '' ? this.fee.feeInfo.assistFeeList[i].assistDiscount : userMember.assist);
				originalAssistFee += parseFloat(this.fee.feeInfo.assistFeeList[i].fee);
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(assistFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalAssistFee));
		this.fee.feeInfo.assistFee = this.adminService.toDecimal2(assistFee);
		this.fee.feeInfo.assistOriginalFee = this.adminService.toDecimal2(originalAssistFee);
		this.fee.feeInfo.assistDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.assistOriginalFee) - parseFloat(this.fee.feeInfo.assistFee));
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
		this.fee.feeInfo.checkDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.checkOriginalFee) - parseFloat(this.fee.feeInfo.checkFee));
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
		this.fee.feeInfo.medicalDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalOriginalFee) - parseFloat(this.fee.feeInfo.medicalFee));
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
		this.fee.feeInfo.otherDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherOriginalFee) - parseFloat(this.fee.feeInfo.otherFee));

		//判断余额是否足够支付
		if(fee <= parseFloat(this.userMember.balance)){
			this.payInfo.memberBalance = true;
		}

		// 实收费用为应收费用-已收预约费用

		this.fee.originalCost = this.adminService.toDecimal2(originalCost);
		this.fee.fee = this.adminService.toDecimal2(fee);
		this.fee.realFee = this.adminService.toDecimal2(fee);

		this.loadingShow = false;
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

	print() {
		window.open('./admin/paymentPrint?id=' + this.id + '&layout=all');
	}

	confirmPay() {
		this.btnCanEdit = true;
		if(this.payInfo.payWay == ''){
			this.toastTab('请选择支付方式', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount) && Number(this.payInfo.give_amount) <= 0){
			this.toastTab('减免金额应大于0', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount) && this.adminService.isFalse(this.payInfo.remark)){
			this.toastTab('减免金额存在时，备注不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		var amountFee = '';
		if(!this.adminService.isFalse(this.payInfo.give_amount)){
			amountFee = this.adminService.toDecimal2(Number(this.fee.fee) - Number(this.payInfo.give_amount));
			if(Number(amountFee) < 0){
				this.toastTab('减免金额不可大于应付金额', 'error');
				this.btnCanEdit = false;
				return;
			}
		}else{
			amountFee = this.fee.fee;
		}
		if(parseFloat(amountFee) < 0){
			this.toastTab('订单错误，不可支付', 'error');
			this.btnCanEdit = false;
			return;
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
				this.btnCanEdit = false;
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
