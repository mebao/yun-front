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
	// 权限
	moduleAuthority: {
		recharge: boolean,
	}
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
		name: string,
		member: boolean,
		balance: string,
		service: string,
		service_session: string,
		services: any[],
		assist: string,
		assist_session: string,
		assists: any[],
		check: string,
		check_session: string,
		prescript: string,
		prescript_session: string,
		other: string,
		other_session: string,
	}
	modalTab: boolean;
	payInfo: {
		payway: {
			way: string,
			text: string,
			money: string,
		},
		payway_second: {
			way: string,
			text: string,
			money: string,
		}
		memberBalance: boolean,
		give_amount: string,
		remark: string,
		stillNeedPay: string,
	}
	// 不可连续点击
	btnCanEdit: boolean;
	// 修改折扣
	editMemberType: string;
	// 支付方式
	paywayList: any[];

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '收费',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.bookingInfo = JSON.parse(sessionStorage.getItem('bookingInfo'));

		this.loadingShow = true;

		// 获取用户是否含有充值权限
		this.moduleAuthority = {
			recharge: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			this.moduleAuthority.recharge = true;
		}else{
			var userClinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
			if(userClinicRoles.length > 0){
				for(var i = 0; i < userClinicRoles.length; i++){
					if(userClinicRoles[i].keyName == 'userList'){
						// 查询用户管理下是否含有充值权限
						if(userClinicRoles[i].infos.length > 0){
							for(var j = 0; j < userClinicRoles[i].infos.length; j++){
								if(userClinicRoles[i].infos[j].keyName == 'recharge'){
									this.moduleAuthority.recharge = true;
								}
							}
						}
					}
				}
			}
		}

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
			name: '',
			member: false,
			balance: '0.00',
			service: '1.00',
			service_session: '1.00',
			services: [],
			assist: '1.00',
			assist_session: '1.00',
			assists: [],
			check: '1.00',
			check_session: '1.00',
			prescript: '1.00',
			prescript_session: '1.00',
			other: '1.00',
			other_session: '1.00',
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.modalTab = false;
		this.payInfo = {
			payway: {
				way: '',
				text: '',
				money: '',
			},
			payway_second: {
				way: '',
				text: '',
				money: '',
			},
			memberBalance: false,
			give_amount: '',
			remark: '',
			stillNeedPay: '',
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
				// 是否支付完成，支付完成后，discountInfo不为空
				if(results.discountInfo == ''){
					var userUrl = this.url + '&id=' + this.bookingInfo.creatorId;
					this.adminService.searchuser(userUrl).then((userData) => {
						if(userData.status == 'no'){
							this.toastTab(userData.errorMsg, 'error');
						}else{
							var userResults = JSON.parse(JSON.stringify(userData.results));
							if(userResults.users.length > 0 && userResults.users[0].memberId){
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
											this.userMember.member = true;
											this.userMember.name = memberResults.list[0].name;
											this.userMember.service = this.adminService.isFalse(memberResults.list[0].service) ? '1.00' : this.adminService.toDecimal2(Number(memberResults.list[0].service) / 100);
											this.userMember.service_session = this.userMember.service;
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
											this.userMember.assist_session = this.userMember.assist;
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
											this.userMember.check_session = this.userMember.check;
											this.userMember.prescript = this.adminService.toDecimal2(Number(memberResults.list[0].prescript) / 100);
											this.userMember.prescript_session = this.userMember.prescript;
											this.userMember.other = this.adminService.toDecimal2(Number(memberResults.list[0].other) / 100);
											this.userMember.other_session = this.userMember.other;
										}
										//计算折扣后的费用信息
										this.getFeeInfo(this.userMember, results);
									}
								});
							}else{
								//计算折扣后的费用信息
								this.getFeeInfo(this.userMember, results);
							}
							sessionStorage.setItem('bookingFee', JSON.stringify(results));
						}
					});
				}else{
					this.userMember = results.discountInfo;
					this.getFeeInfo(this.userMember, results);
				}
			}
		});

		// 获取支付方式
		this.paywayList = [];
		var clinicdata = this.adminService.getClinicdata();
		if(clinicdata == 'error'){
			this.toastTab('服务器错误', 'error');
		}else{
			var list = [];
			for(var payway in clinicdata.payWays){
				var item = {
					key: payway,
					value: clinicdata.payWays[payway],
					use: true,
				}
				list.push(item);
			}
			this.paywayList = list;
		}

		this.btnCanEdit = false;

		this.editMemberType = 'save';
	}

	// 去充值
	recharge() {
		this.router.navigate(['./admin/userList']);
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
				originalOtherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].fee);
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(otherFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalOtherFee));
		this.fee.feeInfo.otherFee = this.adminService.toDecimal2(otherFee);
		this.fee.feeInfo.otherOriginalFee = this.adminService.toDecimal2(originalOtherFee);
		this.fee.feeInfo.otherDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherOriginalFee) - parseFloat(this.fee.feeInfo.otherFee));

		//判断余额是否为0
		if(parseFloat(this.userMember.balance) != 0){
			this.payInfo.memberBalance = true;
		}

		// 实收费用为应收费用-已收预约费用

		this.fee.originalCost = this.adminService.toDecimal2(originalCost);
		this.fee.fee = this.adminService.toDecimal2(fee);
		this.fee.realFee = this.adminService.toDecimal2(fee);

		this.payInfo.stillNeedPay = this.fee.fee;

		this.loadingShow = false;
	}

	// 修改默认折扣
	updateMember() {
		this.editMemberType = 'update';
	}

	cancelMember() {
		if(this.userMember.services.length > 0){
			for(var service in this.userMember.services){
				this.userMember.services[service].discount = this.userMember.services[service].discount_session;
			}
		}
		if(this.userMember.assists.length > 0){
			for(var assist in this.userMember.assists){
				this.userMember.assists[assist].discount = this.userMember.assists[assist].discount_session;
			}
		}
		this.userMember.check = this.userMember.check_session;
		this.userMember.prescript = this.userMember.prescript_session;
		this.userMember.other = this.userMember.other_session;
		this.editMemberType = 'save';
	}

	changeMember(value, type, index) {
		if(parseFloat(value) <= 0 || parseFloat(value) > 1){
			this.toastTab('折扣应大于0，小于等于1', 'error');
			return;
		}
	}

	saveMember() {
		if(this.userMember.services.length > 0){
			for(var service in this.userMember.services){
				if(parseFloat(this.userMember.services[service].discount) <= 0 || parseFloat(this.userMember.services[service].discount) > 1){
					this.toastTab(this.userMember.services[service].serviceName + '折扣应大于0，小于等于1', 'error');
					return;
				}
			}
		}
		if(this.userMember.assists.length > 0){
			for(var assist in this.userMember.assists){
				if(parseFloat(this.userMember.assists[assist].discount) <= 0 || parseFloat(this.userMember.assists[assist].discount) > 1){
					this.toastTab(this.userMember.assists[assist].assistName + '折扣应大于0，小于等于1', 'error');
					return;
				}
			}
		}
		if(parseFloat(this.userMember.check) <= 0 || parseFloat(this.userMember.check) > 1){
			this.toastTab('检查折扣应大于0，小于等于1', 'error');
			return;
		}
		if(parseFloat(this.userMember.prescript) <= 0 || parseFloat(this.userMember.prescript) > 1){
			this.toastTab('药品折扣应大于0，小于等于1', 'error');
			return;
		}
		if(parseFloat(this.userMember.other) <= 0 || parseFloat(this.userMember.other) > 1){
			this.toastTab('其他折扣应大于0，小于等于1', 'error');
			return;
		}

		// 验证成功，重新缓存折扣
		if(this.userMember.services.length > 0){
			for(var service in this.userMember.services){
				this.userMember.services[service].discount = this.adminService.toDecimal2(this.userMember.services[service].discount);
				this.userMember.services[service].discount_session = this.userMember.services[service].discount;
			}
		}
		if(this.userMember.assists.length > 0){
			for(var assist in this.userMember.assists){
				this.userMember.assists[assist].discount = this.adminService.toDecimal2(this.userMember.assists[assist].discount);
				this.userMember.assists[assist].discount_session = this.userMember.assists[assist].discount;
			}
		}
		this.userMember.check = this.adminService.toDecimal2(this.userMember.check);
		this.userMember.prescript = this.adminService.toDecimal2(this.userMember.prescript);
		this.userMember.other = this.adminService.toDecimal2(this.userMember.other);
		this.userMember.check_session = this.userMember.check;
		this.userMember.prescript_session = this.userMember.prescript;
		this.userMember.other_session = this.userMember.other;
		this.getFeeInfo(this.userMember, JSON.parse(sessionStorage.getItem('bookingFee')));
		this.editMemberType = 'save';
	}

	// 选择支付方式
	changePayway(payway, canSelected) {
		// 判断是否可以选择
		if(canSelected){
			var hasList = [];
			if(this.payInfo.payway.way != '' || this.payInfo.payway_second.way != ''){
				// 判断选中是否在已选支付方式中
				var has = false;
				var num = '';
				if(this.payInfo.payway.way == payway.key){
					has = true;
					num = 'payway';
				}
				if(this.payInfo.payway_second.way == payway.key){
					has = true;
					num = 'payway_second';
				}
				if(has){
					if(this.payInfo[num == 'payway' ? 'payway_second' : 'payway'].way != ''){
						var item = {
							way: this.payInfo[num == 'payway' ? 'payway_second' : 'payway'].way,
							text: this.payInfo[num == 'payway' ? 'payway_second' : 'payway'].text,
							money: this.payInfo[num == 'payway' ? 'payway_second' : 'payway'].money,
						}
						hasList.push(item);
					}
					this.resetPayway(hasList);

					this.changePaywayList();
				}else{
					// 不再已选方式中，判断方式是否超过两种
					if(!(this.payInfo.payway.way != '' && this.payInfo.payway_second.way != '')){
						var hasList = [];
						if(this.payInfo.payway.way != ''){
							var item = {
								way: this.payInfo.payway.way,
								text: this.payInfo.payway.text,
								money: this.payInfo.payway.money,
							}
							hasList.push(item);
						}
						if(this.payInfo.payway_second.way != ''){
							var item = {
								way: this.payInfo.payway_second.way,
								text: this.payInfo.payway_second.text,
								money: this.payInfo.payway_second.money,
							}
							hasList.push(item);
						}
						var selectedItem = {
							way: payway.key,
							text: payway.value,
							money: '',
						}
						hasList.push(selectedItem);
						this.resetPayway(hasList);

						// 两种支付选择完毕，禁用其他选项
						for(var py of this.paywayList){
							if(py.key != this.payInfo.payway.way && py.key != this.payInfo.payway_second.way){
								py.use = false;
							}
						}
					}
				}
			}else{
				var selectedItem = {
					way: payway.key,
					text: payway.value,
					money: '',
				}
				hasList.push(selectedItem);
				this.resetPayway(hasList);

				this.changePaywayList();
			}
		}
	}

	/**
	 * 根据已选中支付方式，构造payway，
	 * 会员支付，只能在第一种支付方式
	 */
	resetPayway(hasList) {
		var item = {
			way: '',
			text: '',
			money: '',
		}
		this.payInfo.payway = item;
		this.payInfo.payway_second = item;
		if(hasList.length > 0){
			var memberItem = {
				way: '',
				text: '',
				money: '',
			}
			var firstItem = {
				way: '',
				text: '',
				money: '',
			}
			var secondItem = {
				way: '',
				text: '',
				money: '',
			}
			for(var has of hasList){
				if(has.way == 'member'){
					memberItem = has;
				}else{
					if(firstItem.way == ''){
						firstItem = has;
					}else{
						secondItem = has;
					}
				}
			}
			this.payInfo.payway = (memberItem.way == '' ? firstItem : memberItem);
			this.payInfo.payway_second = memberItem.way != '' ? firstItem : secondItem;
		}
	}

	/**
	 * 选择支付方式，选择了支付宝、微信、现金、刷卡等就不可选挂账
	 * 选择挂账，就不可选支付宝、微信、现金、刷卡等
	 * 选择支付宝，就不能够微信、现金、刷卡
	 * type: 1->选择了支付宝等、2->选择了挂账
	 */
	changePaywayList() {
		// 支付方式不足两种，解禁其他选项
		for(var py of this.paywayList){
			py.use = true;
		}
		// 第一种方式，是否为会员
		if(this.payInfo.payway.way != 'member' && this.payInfo.payway.way != 'guazhang' && this.payInfo.payway.way != ''){
			for(var py of this.paywayList){
				if(py.key != 'member' && py.key != this.payInfo.payway.way){
					py.use = false;
				}
			}
		}else if(this.payInfo.payway.way == 'guazhang'){
			for(var py of this.paywayList){
				if(py.key != 'guazhang' && py.key != 'member'){
					py.use = false;
				}
			}
		}
	}

	// 实时更新stillNeedPay
	changeMoney(type) {
		var stillNeedPay = parseFloat(this.fee.fee) - parseFloat(this.adminService.isFalse(this.payInfo.give_amount) ? '0' : this.payInfo.give_amount) - parseFloat(this.adminService.isFalse(this.payInfo.payway.money) ? '0' : this.payInfo.payway.money) - parseFloat(this.adminService.isFalse(this.payInfo.payway_second.money) ? '0' : this.payInfo.payway_second.money);
		if(stillNeedPay < 0){
			this.toastTab('金额输入错误，请重新输入', 'error');
			if(type == 'give_amount'){
				this.payInfo.give_amount = '';
			}
			if(type == 'payway'){
				this.payInfo.payway.money = '';
			}
			if(type == 'payway_second'){
				this.payInfo.payway_second.money = '';
			}
			this.changeMoney(type);
			return;
		}
		this.payInfo.stillNeedPay = this.adminService.toDecimal2(stillNeedPay.toString());
	}

	close() {
		this.modalTab = false;
		this.payInfo.payway = {
			way: '',
			text: '',
			money: '',
		};
		this.payInfo.payway_second = {
			way: '',
			text: '',
			money: '',
		};
		this.payInfo.give_amount = '';
		this.payInfo.remark = '';
		for(var py of this.paywayList){
			py.use = true;
		}
		this.payInfo.stillNeedPay = this.fee.fee;
	}

	pay() {
		// 如果折扣，为修改状态，默认执行取消操作
		if(this.editMemberType == 'update'){
			this.cancelMember();
		}
		this.payInfo.payway = {
			way: '',
			text: '',
			money: '',
		};
		this.payInfo.payway_second = {
			way: '',
			text: '',
			money: '',
		};
		this.modalTab = true;
	}

	print() {
		window.open('./admin/paymentPrint?id=' + this.id + '&layout=all');
	}

	confirmPay() {
		this.btnCanEdit = true;
		this.payInfo.remark = this.adminService.trim(this.payInfo.remark);
		if(parseFloat(this.fee.fee) < 0){
			this.toastTab('订单错误，不可支付', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway.way != '' && this.payInfo.payway.money == ''){
			this.toastTab(this.payInfo.payway.text + '金额不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway.way != '' && parseFloat(this.payInfo.payway.money) <= 0){
			this.toastTab(this.payInfo.payway.text + '金额应大于0', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway_second.way != '' && this.payInfo.payway_second.money == ''){
			this.toastTab(this.payInfo.payway_second.text + '金额不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway_second.way != '' && parseFloat(this.payInfo.payway_second.money) <= 0){
			this.toastTab(this.payInfo.payway_second.text + '金额应大于0', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway.way == '' && this.payInfo.payway_second.way == ''){
			this.toastTab('支付方式不可为空', 'error');
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

		// 若第一种支付方式为会员余额支付，需判断是否大于实际余额
		if(this.payInfo.payway.way == 'member' && parseFloat(this.payInfo.payway.money) > parseFloat(this.userMember.balance)){
			this.toastTab('会员余额支付金额超出实际会员余额', 'error');
			this.btnCanEdit = false;
			return;
		}

		// 验证金额是否一致
		var hasMoney = 0;
		if(this.payInfo.payway.way != ''){
			hasMoney += parseFloat(this.payInfo.payway.money);
		}
		if(this.payInfo.payway_second.way != ''){
			hasMoney += parseFloat(this.payInfo.payway_second.money);
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount)){
			hasMoney += parseFloat(this.payInfo.give_amount);
		}
		if(hasMoney != parseFloat(this.fee.fee)){
			this.toastTab('支付金额与消费金额不一致', 'error');
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
			amount: this.payInfo.payway.money.toString(),
			pay_way: this.payInfo.payway.way,
			need_amount: this.fee.originalCost,
			// pay_way: this.payInfo.payway,
			give_amount: this.adminService.isFalse(this.payInfo.give_amount) ? '0' : this.payInfo.give_amount,
			remark: this.payInfo.remark,
			second_way: this.payInfo.payway_second.way == '' ? null : this.payInfo.payway_second.way,
			second_amount: this.payInfo.payway_second.way == '' ? null : this.payInfo.payway_second.money,
			discount_info: JSON.stringify(this.userMember),
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
