import { Component }                               from '@angular/core';
import { ActivatedRoute, Router }                  from '@angular/router';

import { AdminService }                            from '../../admin.service';

@Component({
	selector: 'admin-payment-print',
	templateUrl: './payment-print.component.html',
	styleUrls: ['./payment-print.component.scss'],
})
export class PaymentPrintComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	tran: {
		info: {
			time: string,
			wayText: string,
			amount: string,
			giveAmount: string,
			adminName: string,
			secondAmount: string,
			secondWay: string,
			secondWayText: string,
		},
		id: string,
	};
	bookingInfo: {
		age: string,
		genderText: string,
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
		yyj: {
			amount: string,
			time: string,
			wayText: string,
		}
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
			tcmFeeList: any[],
			tcmOriginalFee: string,
			tcmDiscount: string,
			tcmFee: string,
			otherFeeList: any[],
			otherOriginalFee: string,
			otherDiscount: string,
			otherFee: string,
			bookingFee: string,
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
		assist: string,
		assists: any[],
		check: string,
		prescript: string,
		tcm: string,
		other: string,
	}
	modalTab: boolean;
	payInfo: {
		payWay: string,
		memberBalance: boolean,
		give_amount: string,
		remark: string,
	}
	// 记录支付时的折扣信息
	discount_info: {
		service: any[],
		assist: any[],
		check: any[],
		medical: any[],
		tcm: any[],
		other: any[],
	}
	// 折扣方式
	dataCode: string;
	// 支付类型
	paymentType: string;
	tranInfo: {
		amount: string,
		wayText: string,
		time: string,
	};

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.tran = {
			info: {
				time: '',
				wayText: '',
				amount: '',
				giveAmount: '',
				adminName: '',
				secondAmount: '',
				secondWay: '',
				secondWayText: '',
			},
			id:''
		}
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
				tcmFeeList: [],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				otherFeeList: [],
				otherOriginalFee: '',
				otherDiscount: '',
				otherFee: '',
				bookingFee: '',
			},
			fee: '',
			originalCost: '',
		}

		this.userMember = {
			member: false,
			balance: '0.00',
			service: '100',
			services: [],
			assist: '100',
			assists: [],
			check: '100',
			prescript: '100',
			tcm: '100',
			other: '100',
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

		this.discount_info = {
			service: [],
			assist: [],
			check: [],
			medical: [],
			tcm: [],
			other: [],
		}

		this.paymentType = '';
		this.tranInfo = {
			amount: '',
			wayText: '',
			time: '',
		};

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		this.adminService.bookingfee(this.id + this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.fee.remark = results.tranRemark;
				this.dataCode = results.dataCode;
				// 第一种discount_info解析方式
				if(results.dataCode == 0){
					if(results.discountInfo == '' || !results.discountInfo){
						var userUrl = this.url + '&id=' + this.bookingInfo.creatorId
							+ '&clinic_id=' + this.adminService.getUser().clinicId;
						this.adminService.searchuser(userUrl).then((userData) => {
							if(userData.status == 'no'){
								this.toastTab(userData.errorMsg, 'error');
							}else{
								var userResults = JSON.parse(JSON.stringify(userData.results));
								if(userResults.users.length > 0){
									this.userMember.balance = this.adminService.toDecimal2(userResults.users[0].balance);
								}
								if(userResults.users[0].memberId){
									//获取会员折扣信息
									var memberUrl = this.url + '&clinic_id=' + this.adminService.getUser().clinicId
										 + '&id=' + userResults.users[0].memberId + '&status=1';
									this.adminService.memberlist(memberUrl).then((memberData) => {
										if(memberData.status == 'no'){
											this.toastTab(memberData.errorMsg, 'error');
										}else{
											var memberResults = JSON.parse(JSON.stringify(memberData.results));
											if(memberResults.list.length > 0){
												this.userMember.member = true;
												this.userMember.service = this.adminService.isFalse(memberResults.list[0].service) ? '1.00' : this.adminService.toDecimal2(Number(memberResults.list[0].service) / 100);
												// 计算每一个服务的折扣
												if(memberResults.list[0].services.length > 0){
													for(var service in memberResults.list[0].services){
														if(memberResults.list[0].services[service].discount != ''){
															memberResults.list[0].services[service].discount = this.adminService.toDecimal2(Number(memberResults.list[0].services[service].discount) / 100);
														}else{
															memberResults.list[0].services[service].discount = this.userMember.service;
														}
														memberResults.list[0].services[service].discount_session = memberResults.list[0].services[service].discount;
													}
												}
												this.userMember.services = memberResults.list[0].services;
												this.userMember.assist = this.adminService.isFalse(memberResults.list[0].assist) ? '1.00' :  this.adminService.toDecimal2(Number(memberResults.list[0].assist) / 100);
												// 计算每一个辅助治疗的折扣
												if(memberResults.list[0].assists.length > 0){
													for(var assist in memberResults.list[0].assists){
														if(memberResults.list[0].assists[assist].discount != ''){
															memberResults.list[0].assists[assist].discount = this.adminService.toDecimal2(Number(memberResults.list[0].assists[assist].discount) / 100);
														}else{
															memberResults.list[0].assists[assist].discount = this.userMember.assist;
														}
														memberResults.list[0].assists[assist].discount_session = memberResults.list[0].assists[assist].discount;
													}
												}
												this.userMember.assists = memberResults.list[0].assists;
												this.userMember.check = this.adminService.toDecimal2(Number(memberResults.list[0].check) / 100);
												this.userMember.prescript = this.adminService.toDecimal2(Number(memberResults.list[0].prescript) / 100);
												this.userMember.other = this.adminService.toDecimal2(Number(memberResults.list[0].other) / 100);
											}
											//计算折扣后的费用信息
											this.getFeeInfoFirst(this.userMember, results);
										}
									});
								}else{
									// 不是会员，会员折扣，由100更改为1
									this.userMember = {
										member: false,
										balance: '0.00',
										service: '1',
										services: [],
										assist: '1',
										assists: [],
										check: '1',
										prescript: '1',
										tcm: '1',
										other: '1',
									}
									//计算折扣后的费用信息
									this.getFeeInfoFirst(this.userMember, results);
								}
								sessionStorage.setItem('bookingFee', JSON.stringify(results));
							}
						});
					}else{
						this.userMember = results.discountInfo;
						this.getFeeInfoFirst(this.userMember, results);
					}
				}else{
					// 第二种discount_info解析方式
					if(!this.adminService.isFalse(results.discountInfo)){
						this.discount_info = results.discountInfo;
					}
					var userUrl = this.url + '&id=' + this.bookingInfo.creatorId
						+ '&clinic_id=' + this.adminService.getUser().clinicId;
					this.adminService.searchuser(userUrl).then((userData) => {
						if(userData.status == 'no'){
							this.toastTab(userData.errorMsg, 'error');
						}else{
							var userResults = JSON.parse(JSON.stringify(userData.results));
							if(userResults.users.length > 0){
								this.userMember.balance = this.adminService.toDecimal2(userResults.users[0].balance);
							}
							if(userResults.users[0].memberId){
								//获取会员折扣信息
								var memberUrl = this.url + '&clinic_id=' + this.adminService.getUser().clinicId
									 + '&id=' + userResults.users[0].memberId + '&status=1';
								this.adminService.memberlist(memberUrl).then((memberData) => {
									if(memberData.status == 'no'){
										this.toastTab(memberData.errorMsg, 'error');
									}else{
										var memberResults = JSON.parse(JSON.stringify(memberData.results));
										if(memberResults.list.length > 0){
											this.userMember.member = true;
											this.userMember.service = this.adminService.isFalse(memberResults.list[0].service) ? '100' : memberResults.list[0].service;
											// 计算每一个服务的折扣
											if(memberResults.list[0].services.length > 0){
												for(var service in memberResults.list[0].services){
													if(memberResults.list[0].services[service].discount == ''){
														memberResults.list[0].services[service].discount = this.userMember.service;
													}
													memberResults.list[0].services[service].discount_session = memberResults.list[0].services[service].discount;
												}
											}
											this.userMember.services = memberResults.list[0].services;
											this.userMember.assist = this.adminService.isFalse(memberResults.list[0].assist) ? '100' : memberResults.list[0].assist;
											// 计算每一个辅助治疗的折扣
											if(memberResults.list[0].assists.length > 0){
												for(var assist in memberResults.list[0].assists){
													if(memberResults.list[0].assists[assist].discount == ''){
														memberResults.list[0].assists[assist].discount = this.userMember.assist;
													}
													memberResults.list[0].assists[assist].discount_session = memberResults.list[0].assists[assist].discount;
												}
											}
											this.userMember.assists = memberResults.list[0].assists;
											this.userMember.check = memberResults.list[0].check;
											this.userMember.prescript = memberResults.list[0].prescript;
											this.userMember.other = memberResults.list[0].other;
										}
										//计算折扣后的费用信息
										this.initMemberAndFee(this.userMember, results);
									}
								});
							}else{
								//计算折扣后的费用信息
								this.initMemberAndFee(this.userMember, results);
							}
							sessionStorage.setItem('bookingFee', JSON.stringify(results));
						}
					});
				}
			}
		});

		this.adminService.searchbooking(this.url + '&id=' + this.id + '&clinic_id=' + this.adminService.getUser().clinicId).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.tran.id = results.weekbooks[0].tranId;
				this.adminService.searchtran(this.url + '&id=' + this.tran.id + '&clinic_id=' + this.adminService.getUser().clinicId).then((data) => {
					if(data.status == 'no'){
						this.toastTab(data.errorMsg, 'error');
					}else{
						var results = JSON.parse(JSON.stringify(data.results));
						this.tran.info = results.list[0];
					}
				});
			}
		});

	}

	initMemberAndFee(userMember, results) {
		/**
		 * 支付预约金or支付全额
		 * 支付全额，用户非会员，不可打折
		 */
		if(results.feeinfo['预约金']){
			// 含有预约金、discount_info、支付预约金
			this.paymentType = '30';
			this.noBookingfeeAndHasmember(results);
		}else{
			// 含有预约金、discount_info、支付全额（预约金信息删除）
			this.paymentType = '40';
			this.tranInfo = results.tranInfo;
			this.noBookingfee(results);
		}
	}

	noBookingfeeAndHasmember(results) {
		if(results.feeinfo['医生服务费用'].length > 0){
			for(var i = 0; i < results.feeinfo['医生服务费用'].length; i++){
				var serviceDiscount = '';
				// 遍历会员科室折扣
				if(this.userMember.services.length > 0){
					for(var j = 0; j < this.userMember.services.length; j++){
						// 通过serviceId
						if(results.feeinfo['医生服务费用'][i].serviceId == this.userMember.services[j].serviceId){
							serviceDiscount = this.userMember.services[j].discount;
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
				if(this.userMember.assists.length > 0){
					for(var j = 0; j < this.userMember.assists.length; j++){
						// 通过assistId
						if(results.feeinfo['辅助项目费用'][i].projectId == this.userMember.assists[j].assistId){
							assistDiscount = this.userMember.assists[j].discount;
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
				tcmFeeList: results.feeinfo['中药药方费用'],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				otherFeeList: results.feeinfo['其他费用'],
				otherOriginalFee: '',
				otherDiscount: '',
				otherFee: '',
				bookingFee: results.feeinfo['预约金'].fee,
			},
			fee: '',
			originalCost: '',
		}

		this.getFeeInfo();
	}

	noBookingfee(results) {
		if(results.feeinfo['医生服务费用'].length > 0){
			for(var i = 0; i < results.feeinfo['医生服务费用'].length; i++){
				results.feeinfo['医生服务费用'][i].serviceDiscount = '100';
			}
		}
		if(results.feeinfo['辅助项目费用'].length > 0){
			for(var i = 0; i < results.feeinfo['辅助项目费用'].length; i++){
				results.feeinfo['辅助项目费用'][i].assistDiscount = '100';
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
				tcmFeeList: results.feeinfo['中药药方费用'],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				otherFeeList: results.feeinfo['其他费用'],
				otherOriginalFee: '',
				otherDiscount: '',
				otherFee: '',
				bookingFee: this.adminService.toDecimal2(results.tranInfo.amount),
			},
			fee: '',
			originalCost: '',
		}

		this.getFeeInfo();
	}

	getFeeInfo() {
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
				// 支付时的服务折扣
				if(this.discount_info.service.length > 0){
					for(var index in this.discount_info.service){
						if(this.fee.feeInfo.serviceFeeList[i].id == this.discount_info.service[index].id){
							this.fee.feeInfo.serviceFeeList[i].serviceDiscount = this.discount_info.service[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.serviceFeeList[i].serviceDiscount)){
						this.fee.feeInfo.serviceFeeList[i].serviceDiscount = this.userMember.service;
					}
				}
				var fee_service = parseFloat(this.fee.feeInfo.serviceFeeList[i].price) * parseFloat(this.fee.feeInfo.serviceFeeList[i].number) * parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceDiscount) / 100;
				serviceFee += fee_service;
				originalServiceFee += parseFloat(this.fee.feeInfo.serviceFeeList[i].price) * parseFloat(this.fee.feeInfo.serviceFeeList[i].number);

				this.fee.feeInfo.serviceFeeList[i].serviceFee = this.adminService.toDecimal2(fee_service);
				this.fee.feeInfo.serviceFeeList[i].originalServiceFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.serviceFeeList[i].price) * parseFloat(this.fee.feeInfo.serviceFeeList[i].number));
				this.fee.feeInfo.serviceFeeList[i].serviceDiscountFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.serviceFeeList[i].originalServiceFee) - parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceFee));
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
				// 支付时的辅助项目折扣
				if(this.discount_info.assist.length > 0){
					for(var index in this.discount_info.assist){
						if(this.fee.feeInfo.assistFeeList[i].id == this.discount_info.assist[index].id){
							this.fee.feeInfo.assistFeeList[i].assistDiscount = this.discount_info.assist[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.assistFeeList[i].assistDiscount)){
						this.fee.feeInfo.assistFeeList[i].assistDiscount = this.userMember.assist;
					}
				}
				var fee_assist = parseFloat(this.fee.feeInfo.assistFeeList[i].price) * parseFloat(this.fee.feeInfo.assistFeeList[i].number) * parseFloat(this.fee.feeInfo.assistFeeList[i].assistDiscount) / 100;
				assistFee += fee_assist;
				originalAssistFee += parseFloat(this.fee.feeInfo.assistFeeList[i].price) * parseFloat(this.fee.feeInfo.assistFeeList[i].number);

				this.fee.feeInfo.assistFeeList[i].assistFee = this.adminService.toDecimal2(fee_assist);
				this.fee.feeInfo.assistFeeList[i].originalAssistFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.assistFeeList[i].price) * parseFloat(this.fee.feeInfo.assistFeeList[i].number));
				this.fee.feeInfo.assistFeeList[i].assistDiscountFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.assistFeeList[i].originalAssistFee) - parseFloat(this.fee.feeInfo.assistFeeList[i].assistFee));
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
				// 支付时的检查折扣
				if(this.discount_info.check.length > 0){
					for(var index in this.discount_info.check){
						if(this.fee.feeInfo.checkFeeList[i].id == this.discount_info.check[index].id){
							this.fee.feeInfo.checkFeeList[i].checkDiscount = this.discount_info.check[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.checkFeeList[i].checkDiscount)){
						this.fee.feeInfo.checkFeeList[i].checkDiscount = this.userMember.check;
					}
				}
				var fee_check = parseFloat(this.fee.feeInfo.checkFeeList[i].price) * parseFloat(this.fee.feeInfo.checkFeeList[i].number) * parseFloat(this.fee.feeInfo.checkFeeList[i].checkDiscount) / 100;
				checkFee += fee_check;
				originalCheckFee += parseFloat(this.fee.feeInfo.checkFeeList[i].price) * parseFloat(this.fee.feeInfo.checkFeeList[i].number);

				this.fee.feeInfo.checkFeeList[i].checkFee = this.adminService.toDecimal2(fee_check);
				this.fee.feeInfo.checkFeeList[i].originalCheckFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.checkFeeList[i].price) * parseFloat(this.fee.feeInfo.checkFeeList[i].number));
				this.fee.feeInfo.checkFeeList[i].checkDiscountFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.checkFeeList[i].originalCheckFee) - parseFloat(this.fee.feeInfo.checkFeeList[i].checkFee));
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
						// 支付时的药品折扣
						if(this.discount_info.medical.length > 0){
							for(var index in this.discount_info.medical){
								if(this.fee.feeInfo.medicalFeeList[i].id + '_' + j == this.discount_info.medical[index].id){
									this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount = this.discount_info.medical[index].discount;
								}
							}
						}else{
							if(this.adminService.isFalse(this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount)){
								this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount = this.userMember.prescript;
							}
						}
						var fee_medical = 0;
						//判断是否可以打折
						if(this.fee.feeInfo.medicalFeeList[i].info[j].canDiscount == '0'){
							//不可优惠
							fee_medical = parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num);
						}else{
							//可以优惠
							fee_medical = parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount) / 100;
						}
						medicalFee += fee_medical;
						originalMedicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num);

						this.fee.feeInfo.medicalFeeList[i].info[j].medicalFee = this.adminService.toDecimal2(fee_medical);
						this.fee.feeInfo.medicalFeeList[i].info[j].originalMedicalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num));
						this.fee.feeInfo.medicalFeeList[i].info[j].medicalDiscountFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].originalMedicalFee) - parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].medicalFee));
					}
				}
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(medicalFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalMedicalFee));
		this.fee.feeInfo.medicalFee = this.adminService.toDecimal2(medicalFee);
		this.fee.feeInfo.medicalOriginalFee = this.adminService.toDecimal2(originalMedicalFee);
		this.fee.feeInfo.medicalDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalOriginalFee) - parseFloat(this.fee.feeInfo.medicalFee));
		//中药
		var tcmFee = 0;
		var originalTcmFee = 0;
		if(this.fee.feeInfo.tcmFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.tcmFeeList.length; i++){
				// 支付时的其他折扣
				if(this.discount_info.tcm.length > 0){
					for(var index in this.discount_info.tcm){
						if(this.fee.feeInfo.tcmFeeList[i].id == this.discount_info.tcm[index].id){
							this.fee.feeInfo.tcmFeeList[i].tcmDiscount = this.discount_info.tcm[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.tcmFeeList[i].tcmDiscount)){
						this.fee.feeInfo.tcmFeeList[i].tcmDiscount = this.userMember.tcm;
					}
				}
				var fee_tcm = parseFloat(this.fee.feeInfo.tcmFeeList[i].price) * parseFloat(this.fee.feeInfo.tcmFeeList[i].number) * parseFloat(this.fee.feeInfo.tcmFeeList[i].tcmDiscount) / 100;
				tcmFee += fee_tcm;
				originalTcmFee += parseFloat(this.fee.feeInfo.tcmFeeList[i].price) * parseFloat(this.fee.feeInfo.tcmFeeList[i].number);

				this.fee.feeInfo.tcmFeeList[i].tcmFee = this.adminService.toDecimal2(fee_tcm);
				this.fee.feeInfo.tcmFeeList[i].originalTcmFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.tcmFeeList[i].price) * parseFloat(this.fee.feeInfo.tcmFeeList[i].number));
				this.fee.feeInfo.tcmFeeList[i].tcmDiscountFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.tcmFeeList[i].originalTcmFee) - parseFloat(this.fee.feeInfo.tcmFeeList[i].tcmFee));
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(tcmFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalTcmFee));
		this.fee.feeInfo.tcmFee = this.adminService.toDecimal2(tcmFee);
		this.fee.feeInfo.tcmOriginalFee = this.adminService.toDecimal2(originalTcmFee);
		this.fee.feeInfo.tcmDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.tcmOriginalFee) - parseFloat(this.fee.feeInfo.tcmFee));
		//其他
		var otherFee = 0;
		var originalOtherFee = 0;
		if(this.fee.feeInfo.otherFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.otherFeeList.length; i++){
				// 支付时的其他折扣
				if(this.discount_info.other.length > 0){
					for(var index in this.discount_info.other){
						if(this.fee.feeInfo.otherFeeList[i].id == this.discount_info.other[index].id){
							this.fee.feeInfo.otherFeeList[i].otherDiscount = this.discount_info.other[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.otherFeeList[i].otherDiscount)){
						this.fee.feeInfo.otherFeeList[i].otherDiscount = this.userMember.other;
					}
				}
				var fee_other = parseFloat(this.fee.feeInfo.otherFeeList[i].price) * parseFloat(this.fee.feeInfo.otherFeeList[i].number) * parseFloat(this.fee.feeInfo.otherFeeList[i].otherDiscount) / 100;
				otherFee += fee_other;
				originalOtherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].price) * parseFloat(this.fee.feeInfo.otherFeeList[i].number);

				this.fee.feeInfo.otherFeeList[i].otherFee = this.adminService.toDecimal2(fee_other);
				this.fee.feeInfo.otherFeeList[i].originalOtherFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherFeeList[i].price) * parseFloat(this.fee.feeInfo.otherFeeList[i].number));
				this.fee.feeInfo.otherFeeList[i].otherDiscountFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherFeeList[i].originalOtherFee) - parseFloat(this.fee.feeInfo.otherFeeList[i].otherFee));
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

		this.fee.fee = this.adminService.toDecimal2(fee);
		this.fee.originalCost = this.adminService.toDecimal2(originalCost);
	}

	getFeeInfoFirst(userMember, results) {
		if(results.feeinfo['医生服务费用'].length > 0){
			for(var i = 0; i < results.feeinfo['医生服务费用'].length; i++){
				var serviceDiscount = '';
				// 遍历会员科室折扣
				if(userMember.services.length > 0){
					for(var j = 0; j < userMember.services.length; j++){
						// 通过serviceId
						if(results.feeinfo['医生服务费用'][i].serviceId == userMember.services[j].serviceId){
							serviceDiscount = userMember.services[j].discount;
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
							assistDiscount = userMember.assists[j].discount;
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
				tcmFeeList: results.feeinfo['中药药方费用'],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				otherFeeList: results.feeinfo['其他费用'],
				otherOriginalFee: '',
				otherDiscount: '',
				otherFee: '',
				bookingFee: results.feeinfo['预约金'] == null ? '0.00' : results.feeinfo['预约金'].fee,
			},
			fee: '',
			originalCost: '',
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
				this.fee.feeInfo.serviceFeeList[i].serviceFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.serviceFeeList[i].fee) * parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceDiscount != '' ? this.fee.feeInfo.serviceFeeList[i].serviceDiscount : userMember.service));
				this.fee.feeInfo.serviceFeeList[i].originalServiceFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.serviceFeeList[i].fee));
				this.fee.feeInfo.serviceFeeList[i].serviceDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.serviceFeeList[i].originalServiceFee) - parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceFee));
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
				this.fee.feeInfo.assistFeeList[i].assistFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.assistFeeList[i].fee) * parseFloat(this.fee.feeInfo.assistFeeList[i].assistDiscount != '' ? this.fee.feeInfo.assistFeeList[i].assistDiscount : userMember.assist));
				this.fee.feeInfo.assistFeeList[i].originalAssistFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.assistFeeList[i].fee));
				this.fee.feeInfo.assistFeeList[i].assistDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.assistFeeList[i].originalAssistFee) - parseFloat(this.fee.feeInfo.assistFeeList[i].assistFee));
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
				this.fee.feeInfo.checkFeeList[i].checkFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.checkFeeList[i].fee) * parseFloat(userMember.check));
				this.fee.feeInfo.checkFeeList[i].originalCheckFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.checkFeeList[i].fee));
				this.fee.feeInfo.checkFeeList[i].checkDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.checkFeeList[i].originalCheckFee) - parseFloat(this.fee.feeInfo.checkFeeList[i].checkFee));
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
							this.fee.feeInfo.medicalFeeList[i].info[j].medicalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num));
						}else{
							//可以优惠
							medicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * Number(this.fee.feeInfo.medicalFeeList[i].info[j].num) * parseFloat(userMember.prescript);
							this.fee.feeInfo.medicalFeeList[i].info[j].medicalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * Number(this.fee.feeInfo.medicalFeeList[i].info[j].num) * parseFloat(userMember.prescript));
						}
						originalMedicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num);
						this.fee.feeInfo.medicalFeeList[i].info[j].originalMedicalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num));
						this.fee.feeInfo.medicalFeeList[i].info[j].medicalDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].originalMedicalFee) - parseFloat(	this.fee.feeInfo.medicalFeeList[i].info[j].medicalFee));
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
				originalOtherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].fee);
				this.fee.feeInfo.otherFeeList[i].otherFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherFeeList[i].fee) * parseFloat(userMember.other));
				this.fee.feeInfo.otherFeeList[i].originalOtherFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherFeeList[i].fee));
				this.fee.feeInfo.otherFeeList[i].otherDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherFeeList[i].originalOtherFee) - parseFloat(this.fee.feeInfo.otherFeeList[i].otherFee));
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
