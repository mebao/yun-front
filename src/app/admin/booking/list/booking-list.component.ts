import { Component, OnInit, ViewChild, ElementRef }           from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';

import { AdminService }                from '../../admin.service';

import { ToastService }                from '../../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }      from '../../../common/nll-toast/toast-model';

import { ENgxPrintComponent }          from "e-ngx-print";

@Component({
	selector: 'app-booking-list',
	templateUrl: './booking-list.component.html'
})
export class BookingListComponent implements OnInit{
	//@ViewChild('print1') printComponent1: ENgxPrintComponent;
	topBar: {
		title: string,
		back: boolean,
	};
	//权限
	moduleAuthority: {
		see: boolean,
		info: boolean,
		add: boolean,
		update: boolean,
	}
	loadingShow: boolean;
	selectedTab: number;
	url: string;
	doctorlist: any[];
	servicelist: any[];
	searchInfo: {
		doctor_id: string;
		service_id: string;
		mobile: string,
		child_id: string,
		creator_name: string,
		cdate_less: string,
		cdate_less_num: number,
		cdate_big: string,
		cdate_big_num: number,
		bdate_less: string,
		bdate_less_num: number,
		bdate_less_text: string,
		bdate_big: string,
		bdate_big_num: number,
		bdate_big_text: string,
		statuslist: string,
	}
	bookinglist: any[];
	weeklist: any[];
	weektitle: any[];
	timelist: any[];
	weekNum: number;
	showBookinglist: any[];
	use: boolean;
	modalTab: boolean;
	modalConfirmTab: boolean;
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
		statusText: string,
		totalFee: string,
		remark: string,
		yyj: any,
		// 退还部分预约金
		backFee: string,
		backRemark: string,
		refereeId: string,
		refereeName: string,
		// 用于处理支付全额
		tranInfo: {
			id: string,
			amount: string,
			wayText: string,
		}
	};
	hasData: boolean;
	// 家长
	userList: any[];
	// 宝宝
	childList: any[];
	// 详情
	modalTabInfo: boolean;
	selectorBooking: {
		text: string,
		bookingId: string,
		cancel_cause: string,
		type: string,
	}
	// 退还部分预约金
	modalBackBookingFee: boolean;
    // 禁止支付按钮连续提交
    btnCanEdit: boolean;
	printStyle: string;

	constructor(
		public adminService: AdminService,
		public router: Router,
        private toastService: ToastService,
		private elRef: ElementRef,
	) {
		this.printStyle =
	        `
			body{
				margin:0px;
				font-size:16px;
				font-family:"黑体";
				color:#333;
			}
	        .img{
	            height:20px;
				margin-top: 10px;
	        }
			#print_div{
				width:400px;
				line-height:1.8em;
				page-break-before: always;

			}
			.container{
				padding:10px 20px;
			}
			.flex{
				display:flex;
			}
			.flex-1{
				flex:1;
			}
			.font-bold{
				color:#000;
			}
	        `;
	}

	ngOnInit(): void {
		this.topBar = {
			title: '预约列表',
			back: false,
		}

		//权限
		this.moduleAuthority = {
			see: false,
			info: false,
			add: false,
			update: false,
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

		this.hasData = false;
		this.bookinglist = [];
		this.showBookinglist = [];
		this.weeklist = [];

		var todayDate = this.adminService.getDayByDate(new Date());
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			mobile: '',
			child_id: '',
			creator_name: '',
			cdate_less: '',
			cdate_less_num: 0,
			cdate_big: '',
			cdate_big_num: 0,
			bdate_less: todayDate,
			bdate_less_num: new Date(todayDate).getTime(),
			bdate_less_text: this.adminService.dateFormat(todayDate),
			bdate_big: todayDate,
			bdate_big_num: new Date(todayDate).getTime(),
			bdate_big_text: this.adminService.dateFormat(todayDate),
			statuslist: '',
		}

		this.use = true;
		this.modalTabInfo = false;
		this.initBooking();

		this.weekNum = 0;
		this.modalTab = false;
		this.modalConfirmTab = false;
		//timelist
		this.timelist = [
			{key: '08:00'},
			{key: '08:20'},
			{key: '08:30'},
			{key: '08:40'},
			{key: '09:00'},
			{key: '09:20'},
			{key: '09:30'},
			{key: '09:40'},
			{key: '10:00'},
			{key: '10:20'},
			{key: '10:30'},
			{key: '10:40'},
			{key: '11:00'},
			{key: '11:20'},
			{key: '11:30'},
			{key: '11:40'},
			{key: '12:00'},
			{key: '12:20'},
			{key: '12:30'},
			{key: '12:40'},
			{key: '13:00'},
			{key: '13:20'},
			{key: '13:30'},
			{key: '13:40'},
			{key: '14:00'},
			{key: '14:20'},
			{key: '14:30'},
			{key: '14:40'},
			{key: '15:00'},
			{key: '15:20'},
			{key: '15:30'},
			{key: '15:40'},
			{key: '16:00'},
			{key: '16:20'},
			{key: '16:30'},
			{key: '16:40'},
			{key: '17:00'},
			{key: '17:20'},
			{key: '17:30'},
			{key: '17:40'},
			{key: '18:00'},
			{key: '18:20'},
			{key: '18:30'},
			{key: '18:40'},
			{key: '19:00'},
			{key: '19:20'},
			{key: '19:30'},
			{key: '19:40'},
			{key: '20:00'},
			{key: '20:20'},
			{key: '20:30'},
			{key: '20:40'},
			{key: '21:00'},
			{key: '21:20'},
			{key: '21:30'},
			{key: '21:40'},
			{key: '22:00'},
			{key: '22:20'},
			{key: '22:30'},
			{key: '22:40'},
			{key: '23:00'},
			{key: '23:20'},
			{key: '23:30'},
			{key: '23:40'},
		];
		this.selectedTab = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.getDoctorList();
		this.servicelist = [];
		this.getServiceList();

		// 获取家长信息
		this.userList = [];
		// this.adminService.searchuser(this.url).then((data) => {
		// 	if(data.status == 'no'){
		// 		const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
		// 		this.toastService.toast(toastCfg);
		// 	}else{
		// 		var results = JSON.parse(JSON.stringify(data.results));
		// 		if(results.users.length > 0){
		// 			for(var i = 0; i < results.users.length; i++){
		// 				results.users[i].string = JSON.stringify(results.users[i]);
		// 				results.users[i].key = JSON.stringify(results.users[i]);
		// 				results.users[i].value = results.users[i].name + '(' + results.users[i].mobile + ')';
		// 			}
		// 		}
		// 		this.userList = results.users;
		// 	}
		// }).catch((err) => {
		// 	const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
		// 	this.toastService.toast(toastCfg);
		// });

		// 宝宝
		this.childList = [];
		this.adminService.searchchild(this.url).then((data) => {
			if(data.status == 'no'){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.child.length > 0){
					for(var i = 0; i < results.child.length; i++){
						results.child[i].string = JSON.stringify(results.child[i]);
						results.child[i].key = JSON.stringify(results.child[i]);
						results.child[i].value = results.child[i].childName;
					}
				}
				this.childList = results.child;
			}
		}).catch((err) => {
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});

		this.selectorBooking = {
			text: '',
			bookingId: '',
			cancel_cause: '',
			type: '',
		}

		this.modalBackBookingFee = false;
		this.btnCanEdit = false;
	}

	printComplete() {

	}

	// customPrint(print: string) {
	//     this.printComponent1.print();
	// }

	initBooking() {
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
			statusText: '',
			totalFee: '',
			remark: '',
			yyj: {},
			backFee: '',
			backRemark: '',
			refereeId: '',
			refereeName: '',
			tranInfo: {
				id: '',
				amount: '',
				wayText: '',
			}
		};
	}

	// 选择日期
	changeDate(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		}).catch((err) => {
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	//科室列表
	getServiceList() {
		this.adminService.servicelist(this.url).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
		        const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
		        this.toastService.toast(toastCfg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].color = this.adminService.colorList()[i % 15];
						results.servicelist[i].infoList = [];
					}
				}
				this.servicelist = results.servicelist;

				// 根据科室获取科室颜色
				// //week列表
				// this.getList(this.url + '&weekindex=0', 'week');
				// //booking列表
				// this.getList(this.url, 'list');
				this.search();
			}
		}).catch((err) => {
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	//预约列表
	getList(urlOptions, type) {
		this.loadingShow = true;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
		        const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
		        this.toastService.toast(toastCfg);
			}else{
				var todayTime = new Date(this.adminService.getDayByDate(new Date())).getTime();
				if(type == 'week'){
					var weekbooks = JSON.parse(JSON.stringify(data.results)).weekbooks;
					// 时间格式变更
					if(weekbooks.length > 0){
						for(var k = 0; k < weekbooks.length; k++){
							if(weekbooks[k].services.length > 0){
								if(weekbooks[k].services[0].begin){
									weekbooks[k].services[0].begin = weekbooks[k].services[0].begin.replace('-', '年');
									weekbooks[k].services[0].begin = weekbooks[k].services[0].begin.replace('-', '月');
									weekbooks[k].services[0].begin = weekbooks[k].services[0].begin.replace(' ', '日 ');
								}
								if(weekbooks[k].services[0].end){
									weekbooks[k].services[0].end = weekbooks[k].services[0].end.replace('-', '年');
									weekbooks[k].services[0].end = weekbooks[k].services[0].end.replace('-', '月');
									weekbooks[k].services[0].end = weekbooks[k].services[0].end.replace(' ', '日 ');
								}
							}
						}
					}

					var weekArray = this.adminService.getWeekByNumber(this.weekNum);
					//weeklist
					var weeklist = new Array();
					//weektitle
					var weektitle = new Array();
					for(var i = 0; i < 7; i++){
						var title = {
							date: this.adminService.dateFormat(weekArray[i]),
							title: this.adminService.getWeekTitle(i)
						}
						weektitle.push(title);
						var week = {
							date: this.adminService.dateFormat(weekArray[i]),
							use: true,
							timeList: [
								{key: '08:00', value: []},
								{key: '08:20', value: []},
								{key: '08:30', value: []},
								{key: '08:40', value: []},
								{key: '09:00', value: []},
								{key: '09:20', value: []},
								{key: '09:30', value: []},
								{key: '09:40', value: []},
								{key: '10:00', value: []},
								{key: '10:20', value: []},
								{key: '10:30', value: []},
								{key: '10:40', value: []},
								{key: '11:00', value: []},
								{key: '11:20', value: []},
								{key: '11:30', value: []},
								{key: '11:40', value: []},
								{key: '12:00', value: []},
								{key: '12:20', value: []},
								{key: '12:30', value: []},
								{key: '12:40', value: []},
								{key: '13:00', value: []},
								{key: '13:20', value: []},
								{key: '13:30', value: []},
								{key: '13:40', value: []},
								{key: '14:00', value: []},
								{key: '14:20', value: []},
								{key: '14:30', value: []},
								{key: '14:40', value: []},
								{key: '15:00', value: []},
								{key: '15:20', value: []},
								{key: '15:30', value: []},
								{key: '15:40', value: []},
								{key: '16:00', value: []},
								{key: '16:20', value: []},
								{key: '16:30', value: []},
								{key: '16:40', value: []},
								{key: '17:00', value: []},
								{key: '17:20', value: []},
								{key: '17:30', value: []},
								{key: '17:40', value: []},
								{key: '18:00', value: []},
								{key: '18:20', value: []},
								{key: '18:30', value: []},
								{key: '18:40', value: []},
								{key: '19:00', value: []},
								{key: '19:20', value: []},
								{key: '19:30', value: []},
								{key: '19:40', value: []},
								{key: '20:00', value: []},
								{key: '20:20', value: []},
								{key: '20:30', value: []},
								{key: '20:40', value: []},
								{key: '21:00', value: []},
								{key: '21:20', value: []},
								{key: '21:30', value: []},
								{key: '21:40', value: []},
								{key: '22:00', value: []},
								{key: '22:20', value: []},
								{key: '22:30', value: []},
								{key: '22:40', value: []},
								{key: '23:00', value: []},
								{key: '23:20', value: []},
								{key: '23:30', value: []},
								{key: '23:40', value: []},
							]
						}
						for(var j = 0; j < week.timeList.length; j++){
							// 科室列表
							var serviceListData = JSON.parse(JSON.stringify(this.servicelist));

							//遍历返回结果，将预约信息添加进timeList
							for(var k = 0; k < weekbooks.length; k++){
								if(this.adminService.dateFormat(weekArray[i]) == weekbooks[k].bookingDate && week.timeList[j].key == weekbooks[k].time){
									// weekbooks[k].servicesLength = weekbooks[k].services.length;
									// week.timeList[j].value.push(weekbooks[k]);
									// 添加科室列表
									if(serviceListData.length > 0){
										for(var m = 0; m < serviceListData.length; m++){
											if(serviceListData[m].serviceId == weekbooks[k].services[0].serviceId){
												serviceListData[m].infoList.push(weekbooks[k]);
											}
										}
									}
								}
							}

							week.timeList[j].value = serviceListData;
						}
						//日期若未过去，则不可修改，只可查看
						if((new Date(weekArray[i]).getTime()) < todayTime){
							week.use = false;
						}else{
							week.use = true;
						}
						weeklist.push(week);
					}
					this.weektitle = weektitle;
					this.weeklist = weeklist;
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.weekbooks.length > 0){
						for(var i = 0; i < results.weekbooks.length; i++){
							// 时间格式变更
							if(results.weekbooks[i].services.length > 0){
								if(results.weekbooks[i].services[0].begin){
									results.weekbooks[i].services[0].begin = results.weekbooks[i].services[0].begin.replace('-', '年');
									results.weekbooks[i].services[0].begin = results.weekbooks[i].services[0].begin.replace('-', '月');
									results.weekbooks[i].services[0].begin = results.weekbooks[i].services[0].begin.replace(' ', '日 ');
								}
								if(results.weekbooks[i].services[0].end){
									results.weekbooks[i].services[0].end = results.weekbooks[i].services[0].end.replace('-', '年');
									results.weekbooks[i].services[0].end = results.weekbooks[i].services[0].end.replace('-', '月');
									results.weekbooks[i].services[0].end = results.weekbooks[i].services[0].end.replace(' ', '日 ');
								}
							}

							if((new Date(this.adminService.dateFormatHasWord(results.weekbooks[i].bookingDate)).getTime()) < todayTime){
								results.weekbooks[i].use = false;
							}else{
								results.weekbooks[i].use = true;
							}
							for(var j = 0; j < results.weekbooks[i].members.length; j++){
								if(results.weekbooks[i].members[j].memberName == '推拿会员卡'){
									results.weekbooks[i].tuina = Math.floor(results.weekbooks[i].members[j].balance/100);
								}
							}
						}
					}
					this.bookinglist = results.weekbooks;
				}
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch((err) => {
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	//上一周
	prec() {
		this.weekNum--;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=' + this.weekNum;
		this.getList(urlOptions, 'week');
	}

	//本周
	now() {
		this.weekNum = 0;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=0';
		this.getList(urlOptions, 'week');
	}

	//下一周
	next() {
		this.weekNum++;
		var urlOptions = this.getUrlOptios();
		urlOptions += '&weekindex=' + this.weekNum;
		this.getList(urlOptions, 'week');
	}

	// selectUser(_value) {
	// 	if(_value != ''){
	// 		this.searchInfo.mobile = JSON.parse(_value).mobile;
	// 	}else{
	// 		this.searchInfo.mobile = '';
	// 	}
	// }

	selectChild(_value) {
		if(_value != ''){
			this.searchInfo.child_id = JSON.parse(_value).childId;
		}else{
			this.searchInfo.child_id = '';
		}
	}

	//查询
	search() {
		//日历
		var urlOptions = this.getUrlOptios();
		this.getList(urlOptions + '&weekindex=' + this.weekNum, 'week');
		//列表
		var urlOptionsList = this.getUrlOptios();
		if(this.searchInfo.cdate_less && this.searchInfo.cdate_less != ''){
			urlOptionsList += '&cdate_less=' + this.searchInfo.cdate_less;
		}
		if(this.searchInfo.cdate_big && this.searchInfo.cdate_big != ''){
			urlOptionsList += '&cdate_big=' + this.searchInfo.cdate_big;
		}
		if(this.searchInfo.bdate_less && this.searchInfo.bdate_less != ''){
			urlOptionsList += '&bdate_less=' + this.searchInfo.bdate_less;
		}
		if(this.searchInfo.bdate_big && this.searchInfo.bdate_big != ''){
			urlOptionsList += '&bdate_big=' + this.searchInfo.bdate_big;
		}
		this.getList(urlOptionsList, 'list');
	}

	//查询今天
	// today() {
	// 	var urlOptions = this.getUrlOptios();
	// 	urlOptions += '&today=1';
	// 	this.getList(urlOptions, 'list');
	// }

	//切换
	checkTab(value) {
		this.selectedTab = value;
	}

	//查看
	info(_booking){
		// this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: _id}});
		this.booking = _booking;
		this.modalTab = false;
		this.modalTabInfo = true;
	}

	closeInfo() {
		this.modalTabInfo = false;
		if(this.selectedTab == 0){
			this.modalTab = true;
		}
	}

	updateBooking() {
		this.router.navigate(['./admin/booking'], {queryParams: {id: this.booking.bookingId, type: 'update'}});
	}

	// 支付预约金
	paymentBookingFee(booking) {
		this.router.navigate(['./admin/paymentBookingFee'], {queryParams: {id: booking.bookingId, type: 'bookingList'}});
	}

	// 退还部分预约金
	backBookingFee(booking) {
		this.booking = booking;
		this.modalBackBookingFee = true;
	}

	closeBack() {
		this.modalBackBookingFee = false;
		this.initBooking();
	}

	changeBackFee() {
		if(parseFloat(this.booking.backFee) < 0){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可小于0', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			return;
		}
		if(parseFloat(this.booking.backFee) > parseFloat(this.booking.yyj.amount)){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可大于已付金额', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			return;
		}
	}

	confirmBack() {
		this.btnCanEdit = true;
		if(this.adminService.isFalse(this.booking.backFee)){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可为空', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.booking.backFee) < 0){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可小于0', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.booking.backFee) > parseFloat(this.booking.tranInfo.id ? this.booking.tranInfo.amount : this.booking.yyj.amount)){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '退还金额不可大于已付金额', 3000);
			this.toastService.toast(toastCfg);
			this.booking.backFee = '';
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.booking.backRemark) || this.booking.backRemark == ''){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '失约原因不可为空', 3000);
			this.toastService.toast(toastCfg);
			this.btnCanEdit = false;
			return;
		}
		this.loadingShow = true;
		var urlOptions = this.booking.bookingId + this.url
			 + '&refund_fee=' + this.booking.backFee + '&remark=' + this.booking.backRemark;
		this.adminService.bookingrefund(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.btnCanEdit = false;
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				this.modalBackBookingFee = false;
				this.modalTab = false;
				this.loadingShow = false;
				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '金额退还成功', 3000);
				this.toastService.toast(toastCfg);
				this.btnCanEdit = false;
				this.initBooking();
				this.search();
			}
		}).catch((err) => {
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
			this.toastService.toast(toastCfg);
		});
	}

	getUrlOptios() {
		var urlOptions = this.url;
		if(this.searchInfo.statuslist && this.searchInfo.statuslist != ''){
			urlOptions += '&statuslist=' + this.searchInfo.statuslist;
		}
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptions += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.mobile && this.searchInfo.mobile != ''){
			urlOptions += '&mobile=' + this.searchInfo.mobile;
		}
		if(this.searchInfo.child_id && this.searchInfo.child_id != ''){
			urlOptions += '&child_id=' + this.searchInfo.child_id;
		}
		if(this.searchInfo.creator_name && this.searchInfo.creator_name != ''){
			urlOptions += '&creator_name=' + this.searchInfo.creator_name;
		}
		return urlOptions;
	}

	create() {
		this.router.navigate(['./admin/booking'], {queryParams: {type: 'create'}});
	}

	show(value, use) {
		if(value.length > 0){
			for(var i = 0; i < value.length; i++){
				for(var j = 0; j < value[i].members.length; j++){
					if(value[i].members[j].memberName == '推拿会员卡'){
						if(value[i].members[j].canUse == '1'){
							value[i].tuina = Math.floor(value[i].members[j].balance/100);
						}
					}
				}
			}
			this.showBookinglist = value;
			this.use = use;
			this.modalTab = true;
		}
	}

	close() {
		this.modalTab = false;
	}

	cancel(booking, _type) {
		this.modalTab = false;
		this.selectorBooking = {
			bookingId: booking.bookingId,
			text: '确认取消该预约',
			cancel_cause: '',
			type: _type,
		}
		this.modalConfirmTab = true;
	}

	// 取消预约
	closeConfirm() {
		this.modalConfirmTab = false;
	}

	// 确认取消
	confirm(){
		if(this.adminService.trim(this.selectorBooking.cancel_cause) == ''){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '取消原因不可为空', 3000);
			this.toastService.toast(toastCfg);
			return false;
		}
		this.modalConfirmTab = false;
		if(this.selectorBooking.type == 'booking'){
			// 取消预约
			var urlOptions = this.selectorBooking.bookingId + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token + '&cancel_cause=' + this.selectorBooking.cancel_cause;
			this.adminService.bookingcancelled(urlOptions).then((data) => {
				if(data.status == 'no'){
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
				}else{
					const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '预约单取消成功', 3000);
					this.toastService.toast(toastCfg);
					this.search();
				}
			}).catch((err) => {
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
				this.toastService.toast(toastCfg);
			});
		}else{
			// 取消登记
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				status: '2',
				cancel_cause: this.selectorBooking.cancel_cause,
			}
			this.adminService.updatebookstatus(this.selectorBooking.bookingId, params).then((data) => {
				if(data.status == 'no'){
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
				}else{
					const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '取消登记成功', 3000);
					this.toastService.toast(toastCfg);
					this.search();
				}
			}).catch(() => {
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '服务器错误', 3000);
				this.toastService.toast(toastCfg);
			});
		}
	}
}
