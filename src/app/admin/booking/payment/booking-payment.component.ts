import { Component }                               from '@angular/core';
import { ActivatedRoute, Router }                  from '@angular/router';

import { NzMessageService }                        from 'ng-zorro-antd';

import { AdminService }                            from '../../admin.service';

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
			tcmFeeList: any[],
			tcmOriginalFee: string,
			tcmDiscount: string,
			tcmFee: string,
			bookingFee: string,
		},
		// 费用合计
		originalCost: string,
		// 应收费用
		fee: string,
		// 去除活动卡支付，仍需支付
		stillNeedFee: string,
		// 收费结果
		resultsList: any[],
		// 支付详情
		tranInfo: any,
	};
	//获取用户会员信息
	userInfo: {
		actCards: any[],
		selectedActcard: {
			service: any[],
		},
		member: {
			name: string,
			// 会员列表
			memberList: any[],
			// 选中会员
			selectedMember: string,
			// 选中会员json
			selectedMemberJson: any,
			// 是否是会员
			member: boolean,
			userBalance: string,
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
			tcm: string,
			tcm_session: string,
			other: string,
			other_session: string,
		}
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
	// 错误收费页面
	pageType: string;
	// 支付类型
	paymentType: string;
	modalTabAddPay: boolean;
	tranInfo: any;
	// 药方弹窗，用于判断是否含有未出药
	prescriptTabShow: boolean;
	// 选择他人活动卡
	selectedInfo: {
		user: any,
		userList: any[],
	}

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '收费',
			back: true,
		}

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
				tcmFeeList: [],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				bookingFee: '',
			},
			originalCost: '',
			fee: '',
			stillNeedFee: '',
			resultsList: [],
			tranInfo: {},
		}

		this.userInfo = {
			actCards: [],
			selectedActcard: {
				service: [],
			},
			member: {
				name: '',
				memberList: [],
				selectedMember: '',
				selectedMemberJson: {},
				member: false,
				userBalance: '0.00',
				service: '100',
				service_session: '100',
				services: [],
				assist: '100',
				assist_session: '100',
				assists: [],
				check: '100',
				check_session: '100',
				prescript: '100',
				prescript_session: '100',
				tcm: '100',
				tcm_session: '100',
				other: '100',
				other_session: '100',
			}
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

		this.discount_info = {
			service: [],
			assist: [],
			check: [],
			medical: [],
			tcm: [],
			other: [],
		}

		this.modalTabAddPay = false;

		this.pageType = '';
		this.paymentType = '';
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.bookingfee(this.id + this.url).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				// 	feeinfo为[]
				if(this.adminService.isArray(results.feeinfo)){
					this.loadingShow = false;
					this.pageType = '1';
				}else{
					this.fee.remark = results.tranRemark;
					this.dataCode = results.dataCode;
					// 第一种discount_info解析方式
					if(results.dataCode == '0'){
						if(results.discountInfo == '' || !results.discountInfo){
							var userUrl = this.url + '&id=' + this.bookingInfo.creatorId;
							this.adminService.searchuser(userUrl).then((userData) => {
								if(userData.status == 'no'){
									this._message.error(userData.errorMsg);
								}else{
									var userResults = JSON.parse(JSON.stringify(userData.results));
									if(userResults.users.length > 0){
										this.userInfo.member.userBalance = this.adminService.toDecimal2(userResults.users[0].balance);
									}
									if(userResults.users[0].memberId){
										//获取会员折扣信息
										var memberUrl = this.url + '&id=' + userResults.users[0].memberId + '&status=1';
										this.adminService.memberlist(memberUrl).then((memberData) => {
											if(memberData.status == 'no'){
												this._message.error(memberData.errorMsg);
											}else{
												var memberResults = JSON.parse(JSON.stringify(memberData.results));
												if(memberResults.list.length > 0){
													this.userInfo.member.member = true;
													this.userInfo.member.name = memberResults.list[0].name;
													this.userInfo.member.service = this.adminService.isFalse(memberResults.list[0].service) ? '1.00' : this.adminService.toDecimal2(Number(memberResults.list[0].service) / 100);
													this.userInfo.member.service_session = this.userInfo.member.service;
													// 计算每一个服务的折扣
													if(memberResults.list[0].services.length > 0){
														for(var service in memberResults.list[0].services){
															if(memberResults.list[0].services[service].discount != ''){
																memberResults.list[0].services[service].discount = this.adminService.toDecimal2(Number(memberResults.list[0].services[service].discount) / 100);
															}else{
																memberResults.list[0].services[service].discount = this.userInfo.member.service;
															}
															memberResults.list[0].services[service].discount_session = memberResults.list[0].services[service].discount;
														}
													}
													this.userInfo.member.services = memberResults.list[0].services;
													this.userInfo.member.assist = this.adminService.isFalse(memberResults.list[0].assist) ? '1.00' :  this.adminService.toDecimal2(Number(memberResults.list[0].assist) / 100);
													this.userInfo.member.assist_session = this.userInfo.member.assist;
													// 计算每一个辅助治疗的折扣
													if(memberResults.list[0].assists.length > 0){
														for(var assist in memberResults.list[0].assists){
															if(memberResults.list[0].assists[assist].discount != ''){
																memberResults.list[0].assists[assist].discount = this.adminService.toDecimal2(Number(memberResults.list[0].assists[assist].discount) / 100);
															}else{
																memberResults.list[0].assists[assist].discount = this.userInfo.member.assist;
															}
															memberResults.list[0].assists[assist].discount_session = memberResults.list[0].assists[assist].discount;
														}
													}
													this.userInfo.member.assists = memberResults.list[0].assists;
													this.userInfo.member.check = this.adminService.toDecimal2(Number(memberResults.list[0].check) / 100);
													this.userInfo.member.check_session = this.userInfo.member.check;
													this.userInfo.member.prescript = this.adminService.toDecimal2(Number(memberResults.list[0].prescript) / 100);
													this.userInfo.member.prescript_session = this.userInfo.member.prescript;
													this.userInfo.member.other = this.adminService.toDecimal2(Number(memberResults.list[0].other) / 100);
													this.userInfo.member.other_session = this.userInfo.member.other;
												}
												//计算折扣后的费用信息
												this.getFeeInfoFirst(this.userInfo, results);
											}
										}).catch(() => {
											this._message.error('服务器错误');
										});
									}else{
										// 不是会员，会员折扣，由100更改为1
										this.userInfo.member = {
											name: '',
											memberList: [],
											selectedMember: '',
											selectedMemberJson: {},
											member: false,
											userBalance: '0.00',
											service: '1',
											service_session: '1',
											services: [],
											assist: '1',
											assist_session: '1',
											assists: [],
											check: '1',
											check_session: '1',
											prescript: '1',
											prescript_session: '1',
											tcm: '1',
											tcm_session: '1',
											other: '1',
											other_session: '1',
										}

										//计算折扣后的费用信息
										this.getFeeInfoFirst(this.userInfo, results);
									}
									sessionStorage.setItem('bookingFee', JSON.stringify(results));
								}
							}).catch(() => {
								this._message.error('服务器错误');
							});
						}else{
							this.userInfo.member = results.discountInfo;
							this.getFeeInfoFirst(this.userInfo, results);
						}
					}else{
						// 第二种discount_info解析方式
						if(!this.adminService.isFalse(results.discountInfo)){
							this.discount_info = results.discountInfo;
						}
						var userUrl = this.url + '&id=' + this.bookingInfo.creatorId;
						this.adminService.searchuser(userUrl).then((userData) => {
							if(userData.status == 'no'){
								this._message.error(userData.errorMsg);
							}else{
								var userResults = JSON.parse(JSON.stringify(userData.results));
								sessionStorage.setItem('bookingFee', JSON.stringify(results));
								if(userResults.users.length > 0){
									// 重构活动卡信息
									if(userResults.users[0].actCards.length > 0){
										for(var indexActcard in userResults.users[0].actCards){
											// 判断活动卡是否可用
											if(this.bookingInfo.services.length > 0 && this.bookingInfo.services[0].serviceId == userResults.users[0].actCards[indexActcard].projectId){
												userResults.users[0].actCards[indexActcard].disabled = 0;
											}else{
												userResults.users[0].actCards[indexActcard].disabled = 1;
											}
											userResults.users[0].actCards[indexActcard].userId = userResults.users[0].id;
											userResults.users[0].actCards[indexActcard].userName = userResults.users[0].name;
											userResults.users[0].actCards[indexActcard].num = Number(userResults.users[0].actCards[indexActcard].num);
											if(userResults.users[0].actCards[indexActcard].num > 0){
												this.userInfo.actCards.push(userResults.users[0].actCards[indexActcard]);
											}
										}
									}

									this.userInfo.member.userBalance = this.adminService.toDecimal2(userResults.users[0].userBalance ? userResults.users[0].userBalance : '0.00');
									// 根据会员获取折扣信息
									if(userResults.users[0].members.length > 0){
										var hasMember = false;
										for(var i = 0; i < userResults.users[0].members.length; i++){
											// 初始化，会员支付，可选
											userResults.users[0].members[i].use = true;
											userResults.users[0].members[i].key = 'member_' + userResults.users[0].members[i].umId;
											userResults.users[0].members[i].value = userResults.users[0].members[i].memberName;
											userResults.users[0].members[i].string = JSON.stringify(userResults.users[0].members[i]);
											// 获取可用会员
											if(userResults.users[0].members[i].canUse == '1'){
												hasMember = true;
												this.userInfo.member.memberList.push(userResults.users[0].members[i]);
												// 选中第一个可用会员
												if(this.userInfo.member.selectedMember == ''){
													this.userInfo.member.selectedMember = userResults.users[0].members[i].string;
													this.userInfo.member.selectedMemberJson = userResults.users[0].members[i];
												}
											}
										}
										// 没有找到可用会员
										if(hasMember){
											this.getMemberDiscount(this.userInfo.member.selectedMemberJson);
										}else{
											this.getMemberDiscount('');
										}
									}else{
										this.getMemberDiscount('');
									}
								}else{
									this.loadingShow = false;
									this._message.error('用户信息错误');
								}
							}
						}).catch(() => {
							this._message.error('服务器错误');
						});
					}
				}
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});

		// 获取支付方式
		this.paywayList = [];
		var clinicdata = sessionStorage.getItem('clinicdata');
		if(clinicdata && clinicdata != ''){
			this.getPaywayList(JSON.parse(clinicdata));
		}else{
			this.adminService.clinicdata().then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.getPaywayList(results);
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}

		this.btnCanEdit = false;

		this.editMemberType = 'save';

		this.prescriptTabShow = false;

		this.selectedInfo = {
			user: {},
			userList: [],
		}
		this.getOtherUser();
	}

	selectMember(event) {
		this.userInfo.member.selectedMember = event;
		this.userInfo.member.selectedMemberJson = JSON.parse(this.userInfo.member.selectedMember);
		this.getMemberDiscount(this.userInfo.member.selectedMemberJson);
	}

	getMemberDiscount(memberInfo) {
		if(memberInfo.memberId){
			//获取会员折扣信息
			var memberUrl = this.url + '&id=' + memberInfo.memberId + '&status=1';
			this.adminService.memberlist(memberUrl).then((memberData) => {
				if(memberData.status == 'no'){
					this._message.error(memberData.errorMsg);
				}else{
					var memberResults = JSON.parse(JSON.stringify(memberData.results));
					if(memberResults.list.length > 0){
						this.userInfo.member.member = true;
						this.userInfo.member.name = memberResults.list[0].name;
						this.userInfo.member.service = this.adminService.isFalse(memberResults.list[0].service) ? '100' : memberResults.list[0].service;
						this.userInfo.member.service_session = this.userInfo.member.service;
						// 计算每一个服务的折扣
						if(memberResults.list[0].services.length > 0){
							for(var service in memberResults.list[0].services){
								if(memberResults.list[0].services[service].discount == ''){
									memberResults.list[0].services[service].discount = this.userInfo.member.service;
								}
								memberResults.list[0].services[service].discount_session = memberResults.list[0].services[service].discount;
							}
						}
						this.userInfo.member.services = memberResults.list[0].services;
						this.userInfo.member.assist = this.adminService.isFalse(memberResults.list[0].assist) ? '100' : memberResults.list[0].assist;
						this.userInfo.member.assist_session = this.userInfo.member.assist;
						// 计算每一个辅助治疗的折扣
						if(memberResults.list[0].assists.length > 0){
							for(var assist in memberResults.list[0].assists){
								if(memberResults.list[0].assists[assist].discount == ''){
									memberResults.list[0].assists[assist].discount = this.userInfo.member.assist;
								}
								memberResults.list[0].assists[assist].discount_session = memberResults.list[0].assists[assist].discount;
							}
						}
						this.userInfo.member.assists = memberResults.list[0].assists;
						this.userInfo.member.check = memberResults.list[0].check;
						this.userInfo.member.check_session = this.userInfo.member.check;
						this.userInfo.member.prescript = memberResults.list[0].prescript;
						this.userInfo.member.prescript_session = this.userInfo.member.prescript;
						this.userInfo.member.other = memberResults.list[0].other;
						this.userInfo.member.other_session = this.userInfo.member.other;
					}else{
						this._message.error('会员被停用或信息错误，默认不打折');
					}
					//计算折扣后的费用信息
					this.initMemberAndFee(JSON.parse(sessionStorage.getItem('bookingFee')));
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}else{
			//计算折扣后的费用信息
			this.initMemberAndFee(JSON.parse(sessionStorage.getItem('bookingFee')));
		}
	}

	getPaywayList(clinicdata) {
		if(clinicdata == 'error'){
			this._message.error('服务器错误');
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
	}

	// 去充值
	recharge() {
		this.router.navigate(['./admin/userList']);
	}

	initMemberAndFee(results) {
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
				otherFeeList: results.feeinfo['其他费用'],
				otherOriginalFee: '',
				otherDiscount: '',
				otherFee: '',
				tcmFeeList: results.feeinfo['中药药方费用'],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				bookingFee: this.adminService.toDecimal2(results.tranInfo.amount),
			},
			originalCost: '',
			fee: '',
			stillNeedFee: '',
			resultsList: [],
			tranInfo: results.tranInfo,
		}
		this.getFeeInfo();
	}

	noBookingfeeAndHasmember(results) {
		if(results.feeinfo['医生服务费用'].length > 0){
			for(var i = 0; i < results.feeinfo['医生服务费用'].length; i++){
				var serviceDiscount = '';
				// 遍历会员科室折扣
				if(this.userInfo.member.services.length > 0){
					for(var j = 0; j < this.userInfo.member.services.length; j++){
						// 通过serviceId
						if(results.feeinfo['医生服务费用'][i].serviceId == this.userInfo.member.services[j].serviceId){
							serviceDiscount = this.userInfo.member.services[j].discount;
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
				if(this.userInfo.member.assists.length > 0){
					for(var j = 0; j < this.userInfo.member.assists.length; j++){
						// 通过assistId
						if(results.feeinfo['辅助项目费用'][i].projectId == this.userInfo.member.assists[j].assistId){
							assistDiscount = this.userInfo.member.assists[j].discount;
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
				tcmFeeList: results.feeinfo['中药药方费用'],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				bookingFee: results.feeinfo['预约金'].fee,
			},
			originalCost: '',
			fee: '',
			stillNeedFee: '',
			resultsList: [],
			tranInfo: results.tranInfo,
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
		var hasServiceActcard = false;
		if(this.fee.feeInfo.serviceFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.serviceFeeList.length; i++){
				// 判断是否选择活动卡
				var serviceActcardIndex = '';
				this.fee.feeInfo.serviceFeeList[i].hasActcard = false;
				if(this.userInfo.selectedActcard.service.length > 0){
					for(var actcardIndex in this.userInfo.selectedActcard.service){
						if(this.fee.feeInfo.serviceFeeList[i].serviceId == this.userInfo.selectedActcard.service[actcardIndex].projectId){
							this.fee.feeInfo.serviceFeeList[i].hasActcard = true;
							this.fee.feeInfo.serviceFeeList[i].serviceDiscount = 100;
							hasServiceActcard = true;
							this.userInfo.selectedActcard.service[actcardIndex].pay_way = 'activity';
							this.userInfo.selectedActcard.service[actcardIndex].pay_text = this.userInfo.selectedActcard.service[actcardIndex].activityName;
							serviceActcardIndex = actcardIndex;
						}
					}
				}
				// 如果具体科室折扣存在，则以具体科室折扣计算，否则以默认科室折扣计算
				// 支付时的服务折扣
				if(this.bookingInfo.status == '5' && this.discount_info.service.length > 0){
					for(var index in this.discount_info.service){
						if(this.fee.feeInfo.serviceFeeList[i].id == this.discount_info.service[index].id){
							this.fee.feeInfo.serviceFeeList[i].serviceDiscount = this.discount_info.service[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.serviceFeeList[i].serviceDiscount) || this.fee.feeInfo.serviceFeeList[i].serviceDiscount == 0){
						this.fee.feeInfo.serviceFeeList[i].serviceDiscount = this.userInfo.member.service;
					}
				}
				var _fee = parseFloat(this.fee.feeInfo.serviceFeeList[i].number) * parseFloat(this.fee.feeInfo.serviceFeeList[i].price);
				this.fee.feeInfo.serviceFeeList[i].serviceDiscount_session = this.fee.feeInfo.serviceFeeList[i].serviceDiscount;
				var fee_service = _fee * parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceDiscount) / 100;
				this.fee.feeInfo.serviceFeeList[i].serviceFee = this.adminService.toDecimal2(fee_service);
				serviceFee += fee_service;
				originalServiceFee += _fee;
				// fee中为实际支付的费用
				this.fee.feeInfo.serviceFeeList[i].originalFee = this.adminService.toDecimal2(_fee);
				// 费用结果
				var resultsInfo = {
					id: this.fee.feeInfo.serviceFeeList[i].id,
					fee: fee_service,
					discount: this.fee.feeInfo.serviceFeeList[i].serviceDiscount,
				}
				this.fee.resultsList.push(resultsInfo);
			}
		}
		// 科室费用，应减去对应的预约金
		serviceFee = serviceFee - parseFloat(this.fee.feeInfo.bookingFee);

		// 有活动卡，计算活动卡抵用金额后
		if(this.userInfo.selectedActcard.service.length > 0){
			this.userInfo.selectedActcard.service[0].pay_money = serviceFee.toString();
		}
		fee += serviceFee;
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
				if(this.bookingInfo.status == '5' && this.discount_info.assist.length > 0){
					for(var index in this.discount_info.assist){
						if(this.fee.feeInfo.assistFeeList[i].id == this.discount_info.assist[index].id){
							this.fee.feeInfo.assistFeeList[i].assistDiscount = this.discount_info.assist[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.assistFeeList[i].assistDiscount)){
						this.fee.feeInfo.assistFeeList[i].assistDiscount = this.userInfo.member.assist;
					}
				}
				this.fee.feeInfo.assistFeeList[i].assistDiscount_session = this.fee.feeInfo.assistFeeList[i].assistDiscount;
				var fee_assist = parseFloat(this.fee.feeInfo.assistFeeList[i].number) * parseFloat(this.fee.feeInfo.assistFeeList[i].price) * parseFloat(this.fee.feeInfo.assistFeeList[i].assistDiscount) / 100;
				this.fee.feeInfo.assistFeeList[i].assistFee = this.adminService.toDecimal2(fee_assist);
				assistFee += fee_assist;
				originalAssistFee += parseFloat(this.fee.feeInfo.assistFeeList[i].number) * parseFloat(this.fee.feeInfo.assistFeeList[i].price);
				// fee中为实际支付的费用
				this.fee.feeInfo.assistFeeList[i].originalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.assistFeeList[i].number) * parseFloat(this.fee.feeInfo.assistFeeList[i].price));
				// 费用结果
				var resultsInfo = {
					id: this.fee.feeInfo.assistFeeList[i].id,
					fee: fee_assist,
					discount: this.fee.feeInfo.assistFeeList[i].assistDiscount,
				}
				this.fee.resultsList.push(resultsInfo);
			}
		}
		fee += assistFee;
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
				if(this.bookingInfo.status == '5' && this.discount_info.check.length > 0){
					for(var index in this.discount_info.check){
						if(this.fee.feeInfo.checkFeeList[i].id == this.discount_info.check[index].id){
							this.fee.feeInfo.checkFeeList[i].checkDiscount = this.discount_info.check[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.checkFeeList[i].checkDiscount)){
						this.fee.feeInfo.checkFeeList[i].checkDiscount = this.userInfo.member.check;
					}
				}
				this.fee.feeInfo.checkFeeList[i].checkDiscount_session = this.fee.feeInfo.checkFeeList[i].checkDiscount;
				var fee_check = parseFloat(this.fee.feeInfo.checkFeeList[i].number) * parseFloat(this.fee.feeInfo.checkFeeList[i].price) * parseFloat(this.fee.feeInfo.checkFeeList[i].checkDiscount) / 100;
				this.fee.feeInfo.checkFeeList[i].checkFee = this.adminService.toDecimal2(fee_check);
				checkFee += fee_check;
				originalCheckFee += parseFloat(this.fee.feeInfo.checkFeeList[i].number) * parseFloat(this.fee.feeInfo.checkFeeList[i].price);
				// fee中为实际支付的费用
				this.fee.feeInfo.checkFeeList[i].originalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.checkFeeList[i].number) * parseFloat(this.fee.feeInfo.checkFeeList[i].price));
				// 费用结果
				var resultsInfo = {
					id: this.fee.feeInfo.checkFeeList[i].id,
					fee: fee_check,
					discount: this.fee.feeInfo.checkFeeList[i].checkDiscount,
				}
				this.fee.resultsList.push(resultsInfo);
			}
		}
		fee += checkFee;
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
						if(this.bookingInfo.status == '5' && this.discount_info.medical.length > 0){
							for(var index in this.discount_info.medical){
								if(this.fee.feeInfo.medicalFeeList[i].id + '_' + j == this.discount_info.medical[index].id){
									this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount = this.discount_info.medical[index].discount;
								}
							}
						}else{
							if(this.adminService.isFalse(this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount)){
								this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount = this.userInfo.member.prescript;
							}
						}
						this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount_session = this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount;
						this.fee.feeInfo.medicalFeeList[i].info[j].fee = parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * Number(this.fee.feeInfo.medicalFeeList[i].info[j].num);
						var fee_ms = 0;
						//判断是否可以打折
						if(this.fee.feeInfo.medicalFeeList[i].info[j].canDiscount == '0'){
							//不可优惠
							fee_ms = this.fee.feeInfo.medicalFeeList[i].info[j].fee;
						}else{
							//可以优惠
							fee_ms = this.fee.feeInfo.medicalFeeList[i].info[j].fee * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].msDiscount) / 100;
						}
						this.fee.feeInfo.medicalFeeList[i].info[j].fee = this.adminService.toDecimal2(this.fee.feeInfo.medicalFeeList[i].info[j].fee);
						this.fee.feeInfo.medicalFeeList[i].info[j].msFee = this.adminService.toDecimal2(fee_ms);
						medicalFee += fee_ms;
						originalMedicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].num);
					}
				}
				// 费用结果
				var resultsInfo = {
					id: this.fee.feeInfo.medicalFeeList[i].id,
					fee: medicalFee,
					discount: null,
				}
				this.fee.resultsList.push(resultsInfo);
			}
		}
		fee += medicalFee;
		originalCost += parseFloat(this.adminService.toDecimal2(originalMedicalFee));
		this.fee.feeInfo.medicalFee = this.adminService.toDecimal2(medicalFee);
		this.fee.feeInfo.medicalOriginalFee = this.adminService.toDecimal2(originalMedicalFee);
		this.fee.feeInfo.medicalDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.medicalOriginalFee) - parseFloat(this.fee.feeInfo.medicalFee));
		// 中药药方
		var tcmFee = 0;
		var originalTcmFee = 0;
		if(this.fee.feeInfo.tcmFeeList.length > 0){
			for(var i = 0; i < this.fee.feeInfo.tcmFeeList.length; i++){
				// 支付时的中药折扣
				if(this.bookingInfo.status == '5' && this.discount_info.tcm.length > 0){
					for(var index in this.discount_info.tcm){
						if(this.fee.feeInfo.tcmFeeList[i].id == this.discount_info.tcm[index].id){
							this.fee.feeInfo.tcmFeeList[i].tcmDiscount = this.discount_info.tcm[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.tcmFeeList[i].tcmDiscount)){
						this.fee.feeInfo.tcmFeeList[i].tcmDiscount = this.userInfo.member.tcm;
					}
				}
				this.fee.feeInfo.tcmFeeList[i].tcmDiscount_session = this.fee.feeInfo.tcmFeeList[i].tcmDiscount;
				var fee_tcm = parseFloat(this.fee.feeInfo.tcmFeeList[i].number) * parseFloat(this.fee.feeInfo.tcmFeeList[i].price) * parseFloat(this.fee.feeInfo.tcmFeeList[i].tcmDiscount) / 100;
				this.fee.feeInfo.tcmFeeList[i].tcmFee = this.adminService.toDecimal2(fee_tcm);
				tcmFee += fee_tcm;
				originalTcmFee += parseFloat(this.fee.feeInfo.tcmFeeList[i].number) * parseFloat(this.fee.feeInfo.tcmFeeList[i].price);
				// fee中为实际支付的费用
				this.fee.feeInfo.tcmFeeList[i].originalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.tcmFeeList[i].number) * parseFloat(this.fee.feeInfo.tcmFeeList[i].price));
				// 费用结果
				var resultsInfo = {
					id: this.fee.feeInfo.tcmFeeList[i].id,
					fee: fee_tcm,
					discount: this.fee.feeInfo.tcmFeeList[i].tcmDiscount,
				}
				this.fee.resultsList.push(resultsInfo);
			}
		}
		fee += tcmFee;
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
				if(this.bookingInfo.status == '5' && this.discount_info.other.length > 0){
					for(var index in this.discount_info.other){
						if(this.fee.feeInfo.otherFeeList[i].id == this.discount_info.other[index].id){
							this.fee.feeInfo.otherFeeList[i].otherDiscount = this.discount_info.other[index].discount;
						}
					}
				}else{
					if(this.adminService.isFalse(this.fee.feeInfo.otherFeeList[i].otherDiscount)){
						this.fee.feeInfo.otherFeeList[i].otherDiscount = this.userInfo.member.other;
					}
				}
				this.fee.feeInfo.otherFeeList[i].otherDiscount_session = this.fee.feeInfo.otherFeeList[i].otherDiscount;
				var fee_other = parseFloat(this.fee.feeInfo.otherFeeList[i].number) * parseFloat(this.fee.feeInfo.otherFeeList[i].price) * parseFloat(this.fee.feeInfo.otherFeeList[i].otherDiscount) / 100;
				this.fee.feeInfo.otherFeeList[i].otherFee = this.adminService.toDecimal2(fee_other);
				otherFee += fee_other;
				originalOtherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].number) * parseFloat(this.fee.feeInfo.otherFeeList[i].price);
				// fee中为实际支付的费用
				this.fee.feeInfo.otherFeeList[i].originalFee = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherFeeList[i].number) * parseFloat(this.fee.feeInfo.otherFeeList[i].price));
				// 费用结果
				var resultsInfo = {
					id: this.fee.feeInfo.otherFeeList[i].id,
					fee: fee_other,
					discount: this.fee.feeInfo.otherFeeList[i].otherDiscount,
				}
				this.fee.resultsList.push(resultsInfo);
			}
		}
		fee += otherFee;
		originalCost += parseFloat(this.adminService.toDecimal2(originalOtherFee));
		this.fee.feeInfo.otherFee = this.adminService.toDecimal2(otherFee);
		this.fee.feeInfo.otherOriginalFee = this.adminService.toDecimal2(originalOtherFee);
		this.fee.feeInfo.otherDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherOriginalFee) - parseFloat(this.fee.feeInfo.otherFee));

		//判断余额是否为0
		if(parseFloat(this.userInfo.member.selectedMemberJson.balance) != 0){
			this.payInfo.memberBalance = true;
		}

		// 实收费用为应收费用-已收预约费用

		this.fee.originalCost = this.adminService.toDecimal2(originalCost);
		this.fee.fee = this.adminService.toDecimal2(fee);
		// 如果存在活动卡支付
		var _stillNeedFee = fee * 100;
		if(this.userInfo.selectedActcard.service.length > 0){
			for(var actService of this.userInfo.selectedActcard.service){
				_stillNeedFee -= actService.pay_money * 100;
			}
		}
		this.fee.stillNeedFee = this.adminService.toDecimal2(_stillNeedFee / 100);

		this.payInfo.stillNeedPay = this.fee.fee;
		this.loadingShow = false;
	}

	getFeeInfoFirst(userInfo, results) {
		if(results.feeinfo['医生服务费用'].length > 0){
			for(var i = 0; i < results.feeinfo['医生服务费用'].length; i++){
				var serviceDiscount = '';
				// 遍历会员科室折扣
				if(userInfo.member.services.length > 0){
					for(var j = 0; j < userInfo.member.services.length; j++){
						// 通过serviceId
						if(results.feeinfo['医生服务费用'][i].serviceId == userInfo.member.services[j].serviceId){
							serviceDiscount = userInfo.member.services[j].discount;
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
				if(userInfo.member.assists.length > 0){
					for(var j = 0; j < userInfo.member.assists.length; j++){
						// 通过assistId
						if(results.feeinfo['辅助项目费用'][i].projectId == userInfo.member.assists[j].assistId){
							assistDiscount = userInfo.member.assists[j].discount;
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
				tcmFeeList: results.feeinfo['中药药方费用'],
				tcmOriginalFee: '',
				tcmDiscount: '',
				tcmFee: '',
				bookingFee: results.feeinfo['预约金'] == null ? '0.00' : results.feeinfo['预约金'].fee,
			},
			originalCost: '',
			fee: '',
			stillNeedFee: '',
			resultsList: [],
			tranInfo: results.tranInfo,
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
				serviceFee += parseFloat(this.fee.feeInfo.serviceFeeList[i].number) * parseFloat(this.fee.feeInfo.serviceFeeList[i].price) * parseFloat(this.fee.feeInfo.serviceFeeList[i].serviceDiscount != '' ? this.fee.feeInfo.serviceFeeList[i].serviceDiscount : userInfo.member.service);
				originalServiceFee += parseFloat(this.fee.feeInfo.serviceFeeList[i].number) * parseFloat(this.fee.feeInfo.serviceFeeList[i].price);
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
				assistFee += parseFloat(this.fee.feeInfo.assistFeeList[i].number) * parseFloat(this.fee.feeInfo.assistFeeList[i].price) * parseFloat(this.fee.feeInfo.assistFeeList[i].assistDiscount != '' ? this.fee.feeInfo.assistFeeList[i].assistDiscount : userInfo.member.assist);
				originalAssistFee += parseFloat(this.fee.feeInfo.assistFeeList[i].number) * parseFloat(this.fee.feeInfo.assistFeeList[i].price);
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
				checkFee += parseFloat(this.fee.feeInfo.checkFeeList[i].number) * parseFloat(this.fee.feeInfo.checkFeeList[i].price) * parseFloat(userInfo.member.check);
				originalCheckFee += parseFloat(this.fee.feeInfo.checkFeeList[i].number) * parseFloat(this.fee.feeInfo.checkFeeList[i].price);
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
							medicalFee += parseFloat(this.fee.feeInfo.medicalFeeList[i].info[j].price) * Number(this.fee.feeInfo.medicalFeeList[i].info[j].num) * parseFloat(userInfo.member.prescript);
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
				otherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].number) * parseFloat(this.fee.feeInfo.otherFeeList[i].price) * parseFloat(userInfo.member.other);
				originalOtherFee += parseFloat(this.fee.feeInfo.otherFeeList[i].number) * parseFloat(this.fee.feeInfo.otherFeeList[i].price);
			}
		}
		fee += parseFloat(this.adminService.toDecimal2(otherFee));
		originalCost += parseFloat(this.adminService.toDecimal2(originalOtherFee));
		this.fee.feeInfo.otherFee = this.adminService.toDecimal2(otherFee);
		this.fee.feeInfo.otherOriginalFee = this.adminService.toDecimal2(originalOtherFee);
		this.fee.feeInfo.otherDiscount = this.adminService.toDecimal2(parseFloat(this.fee.feeInfo.otherOriginalFee) - parseFloat(this.fee.feeInfo.otherFee));

		//判断余额是否为0
		if(parseFloat(this.userInfo.member.selectedMemberJson.balance) != 0){
			this.payInfo.memberBalance = true;
		}

		// 实收费用为应收费用-已收预约费用

		this.fee.originalCost = this.adminService.toDecimal2(originalCost);
		this.fee.fee = this.adminService.toDecimal2(fee);

		this.payInfo.stillNeedPay = this.fee.fee;

		this.loadingShow = false;
	}

	// 修改默认折扣
	updateMember() {
		this.editMemberType = 'update';
	}

	cancelMember() {
		if(this.fee.feeInfo.serviceFeeList.length > 0){
			for(var service in this.fee.feeInfo.serviceFeeList){
				this.fee.feeInfo.serviceFeeList[service].serviceDiscount = this.fee.feeInfo.serviceFeeList[service].serviceDiscount_session;
			}
		}
		if(this.fee.feeInfo.assistFeeList.length > 0){
			for(var assist in this.fee.feeInfo.assistFeeList){
				this.fee.feeInfo.assistFeeList[assist].assistDiscount = this.fee.feeInfo.assistFeeList[assist].assistDiscount_session;
			}
		}
		if(this.fee.feeInfo.checkFeeList.length > 0){
			for(var check in this.fee.feeInfo.checkFeeList){
					this.fee.feeInfo.checkFeeList[check].checkDiscount = this.fee.feeInfo.checkFeeList[check].checkDiscount_session;
			}
		}
		if(this.fee.feeInfo.medicalFeeList.length > 0){
			for(var medical in this.fee.feeInfo.medicalFeeList){
				if(this.fee.feeInfo.medicalFeeList[medical].info.length > 0){
					for(var info in this.fee.feeInfo.medicalFeeList[medical].info){
						this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount = this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount_session;
					}
				}
			}
		}
		if(this.fee.feeInfo.otherFeeList.length > 0){
			for(var other in this.fee.feeInfo.otherFeeList){
				this.fee.feeInfo.otherFeeList[other].otherDiscount = this.fee.feeInfo.otherFeeList[other].otherDiscount_session;
			}
		}
		this.editMemberType = 'save';
	}

	changeDiscount(value, type) {
		if(parseFloat(value) <= 0 || parseFloat(value) > 100 || parseFloat(value) % 1 != 0){
			this._message.error(type + '折扣应为大于0，小于等于100的整数');
			return;
		}
	}

	saveMember() {
		var discount_session = JSON.stringify(this.fee.feeInfo);
		if(this.fee.feeInfo.serviceFeeList.length > 0){
			for(var service in this.fee.feeInfo.serviceFeeList){
				if(parseFloat(this.fee.feeInfo.serviceFeeList[service].serviceDiscount) <= 0 || parseFloat(this.fee.feeInfo.serviceFeeList[service].serviceDiscount) > 100 || parseFloat(this.fee.feeInfo.serviceFeeList[service].serviceDiscount) % 1 != 0){
					this._message.error(this.fee.feeInfo.serviceFeeList[service].serviceName + '折扣应为大于0，小于等于100的整数');
					this.fee.feeInfo = JSON.parse(discount_session);
					return;
				}else{
					this.fee.feeInfo.serviceFeeList[service].serviceDiscount_session = this.fee.feeInfo.serviceFeeList[service].serviceDiscount;
				}
			}
		}
		if(this.fee.feeInfo.assistFeeList.length > 0){
			for(var assist in this.fee.feeInfo.assistFeeList){
				if(parseFloat(this.fee.feeInfo.assistFeeList[assist].assistDiscount) <= 0 || parseFloat(this.fee.feeInfo.assistFeeList[assist].assistDiscount) > 100 || parseFloat(this.fee.feeInfo.assistFeeList[assist].assistDiscount) % 1 != 0){
					this._message.error(this.fee.feeInfo.assistFeeList[assist].projectName + '折扣应大于0，小于等于100的整数');
					this.fee.feeInfo = JSON.parse(discount_session);
					return;
				}else{
					this.fee.feeInfo.assistFeeList[assist].assistDiscount_session = this.fee.feeInfo.assistFeeList[assist].assistDiscount;
				}
			}
		}
		if(this.fee.feeInfo.checkFeeList.length > 0){
			for(var check in this.fee.feeInfo.checkFeeList){
				if(parseFloat(this.fee.feeInfo.checkFeeList[check].checkDiscount) <= 0 || parseFloat(this.fee.feeInfo.checkFeeList[check].checkDiscount) > 100 || parseFloat(this.fee.feeInfo.checkFeeList[check].checkDiscount) % 1 != 0){
					this._message.error(this.fee.feeInfo.checkFeeList[check].projectName + '折扣应大于0，小于等于100的整数');
					this.fee.feeInfo = JSON.parse(discount_session);
					return;
				}else{
					this.fee.feeInfo.checkFeeList[check].checkDiscount_session = this.fee.feeInfo.checkFeeList[check].checkDiscount;
				}
			}
		}
		if(this.fee.feeInfo.medicalFeeList.length > 0){
			for(var medical in this.fee.feeInfo.medicalFeeList){
				if(this.fee.feeInfo.medicalFeeList[medical].info.length > 0){
					for(var info in this.fee.feeInfo.medicalFeeList[medical].info){
						if(parseFloat(this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount) <= 0 || parseFloat(this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount) > 100 || parseFloat(this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount) % 1 != 0){
							this._message.error(this.fee.feeInfo.medicalFeeList[medical].info[info].pname + '折扣应大于0，小于等于100的整数');
							this.fee.feeInfo = JSON.parse(discount_session);
							return;
						}else{
							this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount_session = this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount;
						}
					}
				}
			}
		}
		if(this.fee.feeInfo.tcmFeeList.length > 0){
			for(var tcm in this.fee.feeInfo.tcmFeeList){
				if(parseFloat(this.fee.feeInfo.tcmFeeList[tcm].tcmDiscount) <= 0 || parseFloat(this.fee.feeInfo.tcmFeeList[tcm].tcmDiscount) > 100 || parseFloat(this.fee.feeInfo.tcmFeeList[tcm].tcmDiscount) % 1 != 0){
					this._message.error(this.fee.feeInfo.tcmFeeList[tcm].projectName + '折扣应大于0，小于等于100的整数');
					this.fee.feeInfo = JSON.parse(discount_session);
					return;
				}else{
					this.fee.feeInfo.tcmFeeList[tcm].tcmDiscount_session = this.fee.feeInfo.tcmFeeList[tcm].tcmDiscount;
				}
			}
		}
		if(this.fee.feeInfo.otherFeeList.length > 0){
			for(var other in this.fee.feeInfo.otherFeeList){
				if(parseFloat(this.fee.feeInfo.otherFeeList[other].otherDiscount) <= 0 || parseFloat(this.fee.feeInfo.otherFeeList[other].otherDiscount) > 100 || parseFloat(this.fee.feeInfo.otherFeeList[other].otherDiscount) % 1 != 0){
					this._message.error(this.fee.feeInfo.otherFeeList[other].projectName + '折扣应大于0，小于等于100的整数');
					this.fee.feeInfo = JSON.parse(discount_session);
					return;
				}else{
					this.fee.feeInfo.otherFeeList[other].otherDiscount_session = this.fee.feeInfo.otherFeeList[other].otherDiscount;
				}
			}
		}
		this.getFeeInfo();
		this.editMemberType = 'save';
	}

	getOtherUser() {
		this.adminService.searchuser(this.url).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					// 重构活动卡信息
					for(var i = 0; i < results.users.length; i++){
						if(results.users[i].actCards.length > 0){
							for(var indexActcard in results.users[i].actCards){
								// 判断活动卡是否可用
								if(this.bookingInfo.services.length > 0 && this.bookingInfo.services[0].serviceId == results.users[i].actCards[indexActcard].projectId){
									results.users[i].actCards[indexActcard].disabled = 0;
								}else{
									results.users[i].actCards[indexActcard].disabled = 1;
								}
								results.users[i].actCards[indexActcard].userId = results.users[i].id;
								results.users[i].actCards[indexActcard].userName = results.users[i].name;
								results.users[i].actCards[indexActcard].num = Number(results.users[i].actCards[indexActcard].num);
							}
						}
					}
				}
				this.selectedInfo.userList = results.users;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	selectedOtherUser(_value) {
		this.selectedInfo.user = _value;
	}

	// 选择活动卡
	selectActcard(actcard) {
		if(actcard.disabled == 0){
			if(!actcard.selected || actcard.selected == 0){
				if(this.userInfo.selectedActcard.service.length > 0){
					this._message.error('每个预约只可使用一张活动卡');
					return;
				}else{
					actcard.selected = 1;
					this.userInfo.selectedActcard.service.push(actcard);
				}
			}else{
				this.userInfo.selectedActcard.service.splice(actcard, 1);
				actcard.selected = 0;
			}
			this.initMemberAndFee(JSON.parse(sessionStorage.getItem('bookingFee')));
		}
	}

	// add选择支付方式
	changeAddPayway(payway, canSelected) {
		// 判断是否可以选择
		if(canSelected){
			if(this.payInfo.payway_second.way == payway.key) {
				this.payInfo.payway_second.way = '';
				this.payInfo.payway_second.text = '';
				this.payInfo.payway_second.money = '';
				for(var py of this.paywayList){
					py.use = true;
					this.userInfo.member.selectedMemberJson.use = true;
				}
			}else{
				this.payInfo.payway_second.way = payway.key;
				this.payInfo.payway_second.text = payway.value;
				for(var py of this.paywayList){
					if(py.key != this.payInfo.payway_second.way){
						py.use = false;
					}
				}
				if(payway.key.indexOf('member') == -1){
					this.userInfo.member.selectedMemberJson.use = false;
				}
			}
		}
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
						if(this.payInfo.payway.way.indexOf('member') == -1){
							this.userInfo.member.selectedMemberJson.use = false;
						}
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
	 * 活动卡支付，只能在第一种支付方式
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
				if(has.way.indexOf('member') != -1){
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
			this.userInfo.member.selectedMemberJson.use = true;
		}
		// 第一种方式，是否为会员
		if(this.payInfo.payway.way != 'activity'){
			if(this.payInfo.payway.way.indexOf('member') == -1 && this.payInfo.payway.way != 'guazhang' && this.payInfo.payway.way != ''){
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
	}

	// 实时更新stillNeedPay
	changeMoney(type) {
		var give_amount = parseFloat(this.adminService.isFalse(this.payInfo.give_amount) ? '0' : this.payInfo.give_amount) * 100;
		var first_monen = parseFloat(this.adminService.isFalse(this.payInfo.payway.money) ? '0' : this.payInfo.payway.money) * 100;
		var second_money = parseFloat(this.adminService.isFalse(this.payInfo.payway_second.money) ? '0' : this.payInfo.payway_second.money) * 100;
		var stillNeedPay = (parseFloat(this.fee.fee) * 100) - give_amount - first_monen - second_money;
		if(stillNeedPay / 100 < 0){
			this._message.error('金额输入错误，请重新输入');
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
		this.payInfo.stillNeedPay = this.adminService.toDecimal2((stillNeedPay / 100).toString());
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
		if(this.paymentType == '30'){
			// 如果折扣，为修改状态，默认执行取消操作
			if(this.editMemberType == 'update'){
				this.cancelMember();
			}
			if(this.userInfo.selectedActcard.service.length > 0){
				this.payInfo.payway = {
					way: this.userInfo.selectedActcard.service[0].pay_way,
					text: this.userInfo.selectedActcard.service[0].pay_text,
					money: this.userInfo.selectedActcard.service[0].pay_money,
				}
				this.changeMoney('');
			}else{
				this.payInfo.payway = {
					way: '',
					text: '',
					money: '',
				}
			}
			this.payInfo.payway_second = {
				way: '',
				text: '',
				money: '',
			};
			this.modalTab = true;
		}else if(this.paymentType == '40'){
			this.payInfo.payway_second = {
				way: '',
				text: '',
				money: '',
			};
			this.modalTabAddPay = true;
		}
	}

	getPrescript() {
		this.loadingShow = true;
		var urlOptions = '?username=' + this.adminService.getUser().username
			+ '&token=' + this.adminService.getUser().token
			+ '&clinic_id=' + this.adminService.getUser().clinicId
			+ '&booking_id=' + this.id + '&isout=1';
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.loadingShow = false;
				if(results.list.length > 0){
					var hasPrescript = false;
					for(var i = 0; i < results.list.length; i++){
						if(results.list[i].outCode != 0){
							hasPrescript = true;
						}
					}
					if(hasPrescript){
						this.prescriptTabShow = true;
					}else{
						// 支付
						this.pay();
					}
				}else{
					// 支付
					this.pay();
				}
			}
		}).catch((error) => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	closePrescriptTab() {
		this.prescriptTabShow = false;
	}

	goPrescript() {
		this.router.navigate(['./admin/prescript/list']);
	}

	closeAddPay() {
		this.modalTabAddPay = false;
		this.payInfo.payway_second = {
			way: '',
			text: '',
			money: '',
		};
		for(var py of this.paywayList){
			py.use = true;
		}
		this.payInfo.stillNeedPay = this.fee.fee;
	}

	print() {
		window.open('./admin/paymentPrint?id=' + this.id + '&layout=all');
	}

	getDiscountInfo() {
		var discount_info = {
			service: [],
			assist: [],
			check: [],
			medical: [],
			tcm: [],
			other: [],
		}
		if(this.fee.feeInfo.serviceFeeList.length > 0){
			for(var service in this.fee.feeInfo.serviceFeeList){
				discount_info.service.push({
					id: this.fee.feeInfo.serviceFeeList[service].id,
					discount: this.fee.feeInfo.serviceFeeList[service].serviceDiscount,
				});
			}
		}
		if(this.fee.feeInfo.assistFeeList.length > 0){
			for(var assist in this.fee.feeInfo.assistFeeList){
				discount_info.assist.push({
					id: this.fee.feeInfo.assistFeeList[assist].id,
					discount: this.fee.feeInfo.assistFeeList[assist].assistDiscount,
				});
			}
		}
		if(this.fee.feeInfo.checkFeeList.length > 0){
			for(var check in this.fee.feeInfo.checkFeeList){
				discount_info.check.push({
					id: this.fee.feeInfo.checkFeeList[check].id,
					discount: this.fee.feeInfo.checkFeeList[check].checkDiscount,
				});
			}
		}
		if(this.fee.feeInfo.medicalFeeList.length > 0){
			for(var medical in this.fee.feeInfo.medicalFeeList){
				if(this.fee.feeInfo.medicalFeeList[medical].info.length > 0){
					for(var info in this.fee.feeInfo.medicalFeeList[medical].info){
						discount_info.medical.push({
							id: this.fee.feeInfo.medicalFeeList[medical].id + '_' + info,
							discount: this.fee.feeInfo.medicalFeeList[medical].info[info].msDiscount,
						});
					}
				}
			}
		}
		if(this.fee.feeInfo.tcmFeeList.length > 0){
			for(var tcm in this.fee.feeInfo.tcmFeeList){
				discount_info.tcm.push({
					id: this.fee.feeInfo.tcmFeeList[tcm].id,
					discount: this.fee.feeInfo.tcmFeeList[tcm].tcmDiscount,
				});
			}
		}
		if(this.fee.feeInfo.otherFeeList.length > 0){
			for(var other in this.fee.feeInfo.otherFeeList){
				discount_info.other.push({
					id: this.fee.feeInfo.otherFeeList[other].id,
					discount: this.fee.feeInfo.otherFeeList[other].otherDiscount,
				});
			}
		}
		return discount_info;
	}

	confirmPay() {
		this.btnCanEdit = true;
		this.payInfo.remark = this.adminService.trim(this.payInfo.remark);
		if(parseFloat(this.fee.fee) < 0){
			this._message.error('订单错误，不可支付');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway.way != '' && this.payInfo.payway.money.toString() == ''){
			this._message.error(this.payInfo.payway.text + '金额不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway.way != '' && parseFloat(this.payInfo.payway.money) < 0){
			this._message.error(this.payInfo.payway.text + '金额应大于等于0');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway_second.way != '' && this.payInfo.payway_second.money == ''){
			this._message.error(this.payInfo.payway_second.text + '金额不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway_second.way != '' && parseFloat(this.payInfo.payway_second.money) <= 0){
			this._message.error(this.payInfo.payway_second.text + '金额应大于0');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway.way == '' && this.payInfo.payway_second.way == ''){
			this._message.error('支付方式不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount) && Number(this.payInfo.give_amount) <= 0){
			this._message.error('减免金额应大于0');
			this.btnCanEdit = false;
			return;
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount) && this.adminService.isFalse(this.payInfo.remark)){
			this._message.error('减免金额存在时，备注不可为空');
			this.btnCanEdit = false;
			return;
		}

		// 若第一种支付方式为会员余额支付，需判断是否大于实际余额
		if(this.payInfo.payway.way.indexOf('member') != -1 && parseFloat(this.payInfo.payway.money) > parseFloat(this.userInfo.member.userBalance)){
			this._message.error('会员余额支付金额超出实际会员余额');
			this.btnCanEdit = false;
			return;
		}

		// 验证金额是否一致
		var hasMoney = 0;
		if(this.payInfo.payway.way != ''){
			hasMoney += parseFloat(this.payInfo.payway.money) * 100;
		}
		if(this.payInfo.payway_second.way != ''){
			hasMoney += parseFloat(this.payInfo.payway_second.money) * 100;
		}
		if(!this.adminService.isFalse(this.payInfo.give_amount)){
			hasMoney += parseFloat(this.payInfo.give_amount) * 100;
		}
		if(hasMoney != parseFloat(this.fee.fee) * 100){
			this._message.error('支付金额与消费金额不一致');
			this.btnCanEdit = false;
			return;
		}

		// 构造折扣信息
		var discount_info = this.getDiscountInfo();

		this.modalTab = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			user_id: this.userInfo.selectedActcard.service.length > 0 ? this.userInfo.selectedActcard.service[0].userId : this.bookingInfo.creatorId,
			user_name: this.userInfo.selectedActcard.service.length > 0 ? this.userInfo.selectedActcard.service[0].userName : this.bookingInfo.creatorName,
			amount: this.payInfo.payway.money.toString(),
			pay_way: this.payInfo.payway.way.indexOf('member') != -1 ? 'member' : this.payInfo.payway.way,
			// 选择会员支付时，需要传会员id
			um_id: this.payInfo.payway.way.indexOf('member') != -1 ? (this.payInfo.payway.way.split('_')[1]) : null,
			need_amount: this.fee.originalCost,
			// pay_way: this.payInfo.payway,
			give_amount: this.adminService.isFalse(this.payInfo.give_amount) ? '0' : this.payInfo.give_amount,
			remark: this.payInfo.remark,
			second_way: this.payInfo.payway_second.way == '' ? null : this.payInfo.payway_second.way,
			second_amount: this.payInfo.payway_second.way == '' ? null : this.payInfo.payway_second.money,
			discount_info: JSON.stringify(discount_info),
			feelist: JSON.stringify(this.fee.resultsList),
			card_id: this.userInfo.selectedActcard.service.length > 0 ? this.userInfo.selectedActcard.service[0].cardId : null,
		}
		this.adminService.feepay(this.id, params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('支付完成');
				setTimeout(() => {
					this.router.navigate(['./admin/bookingCharge']);
				}, 2000);
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	confirmAddPay() {
		this.btnCanEdit = true;
		this.payInfo.remark = this.adminService.trim(this.payInfo.remark);
		if(parseFloat(this.fee.fee) < 0){
			this._message.error('订单错误，不可支付');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway_second.way == ''){
			this._message.error('未选择支付方式');
			this.btnCanEdit = false;
			return;
		}
		if(this.payInfo.payway_second.money.toString() == ''){
			this._message.error('支付金额不可为空');
			this.btnCanEdit = false;
			return;
		}

		// 余额支付，余额是否充足
		if(this.payInfo.payway_second.way.indexOf('member') != -1 && parseFloat(this.payInfo.payway_second.money) > parseFloat(this.userInfo.member.userBalance)){
			this._message.error('会员余额支付金额超出实际会员余额');
			this.btnCanEdit = false;
			return;
		}

		this.modalTabAddPay = false;
		var urlOptions = this.tranInfo.id + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&need_amount=' + this.fee.originalCost
			 + '&second_way=' + this.payInfo.payway_second.way
			 + '&second_amount=' + this.payInfo.payway_second.money;
		this.adminService.addtran(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.closeAddPay();
				this.btnCanEdit = false;
			}else{
				this._message.success('支付完成');
				setTimeout(() => {
					this.router.navigate(['./admin/bookingCharge']);
				}, 2000);
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.closeAddPay();
			this.btnCanEdit = false;
		});
	}
}
