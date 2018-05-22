import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';
import { DomSanitizer }                       from '@angular/platform-browser';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-doctor-booking',
	templateUrl: './docbooking.component.html',
	styleUrls: ['./docbooking.component.scss'],
})
export class DocbookingComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
		back_url: string,
	};
	// modal-img
	modalImg: {
		url: string,
		showImg: number,
	}
	loadingShow: boolean;
	url: string;
	id: string;
	doctorId: string;
	doctorInfo: {
		avatarUrl: string,
		id: string,
		mobile: string,
		realName: string,
		username: string,
		doctorProfile: {
			atitleText: string,
			ctitleText: string,
			description: string,
			gender: string,
		}
	};
	//添加费用
	addFeeInfo: {
		booking_id: string,
		project_name: string,
		price: string,
		number: string,
		fee: string,
		remarks: string,
		feeId: string,
		editProjectId: string,
		editType: string,
	};
	//添加检查单
	addCheckInfo: {
		booking_id: string,
		check_id: string,
		check_name: string,
		check: string,
		editType: string,
	};
	checklist: any[];
	hasCheckData: boolean;
	checkDataList: any[];
	selectedCheckTab: string;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	//开方
	hasPrescriptData: boolean;
	prescriptList: any[];
	booking: {
		actCards: any[],
		age: string,
		birthDate: string,
		bookingAge: string,
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
		mobile: string,
		remark: string,
		genderText: string,
	};
	canEdit: boolean;
	selectedTab: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
		type: string,
	}
	//随访
	hasFollowupsData: boolean;
	followupsList: any[];
	// pageType 空为医生接诊，history为查看
	pageType: string;
	// 辅助治疗
	assistProjects: any[];
	assistList: any[];
	hasAssistData: boolean;
	addAssistInfo: {
		editType: string,
		editProjectId: string,
		project: string,
		price: string,
		number: string,
		fee: string,
		remarks: string,
	};
	// 不可连续点击
	btnCanEdit: boolean;
	// 就诊记录
	historyHealthRList: any[];
	historyHealthR: any[];
	historyHealthRBookingFirst: any[];
	historyHealthRBookingLast: any[];
	selectedHistoryHealthRTab: string;
	historyList: any[];
	hasHistoryData: boolean;
	modalTab: boolean;
	// 实际操作人
	actualOperator: {
		use: boolean,
		name: string,
	}
	adminList: any[];
	operator: string;
	searchInfo: {
		doctor_id: string;
		service_id: string;
		bdate_less: string,
		bdate_less_num: number,
		bdate_less_text: string,
		bdate_big: string,
		bdate_big_num: number,
		bdate_big_text: string,
	};
	doctorlist: any[];
	servicelist: [{}];
	// 中药处方
	hasDocTcmData: boolean;
	docTcmList: any[];

	constructor(
		private adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
		private sanitizer: DomSanitizer,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '接诊',
			back: true,
			back_url: './admin/bookingReceive',
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.loadingShow = true;

		// modal-img
		this.modalImg = {
			url: '',
			showImg: 0,
		}

		this.id = '';
		this.doctorId = '';
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
			type: '',
		}

		this.booking = {
			actCards: [],
			age: '',
			birthDate: '',
			bookingAge: '',
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
			mobile: '',
			remark: '',
			genderText: '',
		};
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			bdate_less: '',
			bdate_less_num: 0,
			bdate_less_text: '',
			bdate_big: '',
			bdate_big_num: 0,
			bdate_big_text: '',
		}
		//判断sessionStorage中是否已经缓存
		if(sessionStorage.getItem('doctorBookingTab')){
			this.selectedTab = sessionStorage.getItem('doctorBookingTab');
		}else{
			this.selectedTab = '3';
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
			this.doctorId = params['doctorId'];
			this.pageType = params.pageType;
		});

		//添加费用
		this.addFeeInfo = {
			booking_id: this.id,
			project_name: '',
			price: '',
			number: '',
			fee: '',
			remarks: '',
			feeId: '',
			editProjectId: '',
			editType: '',
		}

		//添加检查
		this.addCheckInfo = {
			booking_id: '',
			check_id: '',
			check_name: '',
			check: '',
			editType: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
		//获取预约信息
		this.getBookingData();

		//获取检查信息
		this.hasCheckData = false;
		this.checkDataList = [];
		this.selectedCheckTab = '';
		this.getCheckData();

		//获取开方信息
		this.hasPrescriptData = false;
		this.prescriptList = [];
		this.getPrescriptData();

		//随访
		this.hasFollowupsData = false;
		this.followupsList = [];
		var userfollowupsUrl = this.url + '&booking_id=' + this.id;
		this.adminService.userfollowups(userfollowupsUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.followupsList = results.list;
				this.hasFollowupsData = true;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});

		// 辅助治疗
		this.assistProjects = [];
		var assistUrl = this.url + '&status=1';
		this.adminService.searchassist(assistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.assistProjects = results.list;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
		// 预约辅助治疗
		this.hasAssistData = false;
		this.assistList = [];
		this.addAssistInfo = {
			editType: '',
			editProjectId: '',
			project: '',
			price: '',
			number: '',
			fee: '',
			remarks: '',
		}
		this.getBookingAssistData();

		// 中药处方
		this.hasDocTcmData = false;
		this.docTcmList = [];
		this.getDocTcmList();

		this.doctorInfo = {
			avatarUrl: '',
			id: '',
			mobile: '',
			realName: '',
			username: '',
			doctorProfile: {
				atitleText: '',
				ctitleText: '',
				description: '',
				gender: '',
			}
		};

		//获取医生信息
		var urlDoctor = this.url + '&id=' + this.doctorId;
		this.adminService.adminlist(urlDoctor).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					this.doctorInfo = results.adminlist[0];
				}
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});

		//查询诊所检查项
		this.checklist = [];
		var checkUrl = this.url;
		this.adminService.checkprojects(checkUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.checklist = results.list;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}
		this.adminList = [];
		this.operator = this.adminService.isFalse(this.actualOperator.name) ? '' : this.actualOperator.name;
		if(this.actualOperator.use){
			// 获取护士列表
			var adminlistUrl = this.url + '&role=3';
			this.adminService.adminlist(adminlistUrl).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.adminlist.length > 0){
						for(var i = 0; i < results.adminlist.length; i++){
							var admin = {
								key: JSON.stringify({
									id: results.adminlist[i].id,
									realName: results.adminlist[i].realName,
								}),
								value: results.adminlist[i].realName,
							}
							this.adminList.push(admin);
						}
					}
				}
			}).catch(() => {
				this.toastTab('服务器错误', 'error');
			});
		}

		this.btnCanEdit = false;

		this.historyList = [];
		this.hasHistoryData = false;
		this.modalTab = false;

		this.historyHealthRList = [];
		this.historyHealthR = [];
		this.historyHealthRBookingFirst = [];
		this.historyHealthRBookingLast = [];
		this.selectedHistoryHealthRTab = '1';

		this.getDoctorList();
		this.getServiceList();
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&clinic_id='
			 + this.adminService.getUser().clinicId + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.servicelist = results.servicelist;
				this.servicelist.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择科室'});
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	getHistoryHealthRList() {
		var urlOptions = this.url + '&child_id=' + this.booking.childId + '&latestEarliest=1';
		this.adminService.searchhealthrecord(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].bookingDate = this.adminService.dateFormat(results.list[i].bookingDate);
					}
					this.historyHealthR.push(results.list[0]);
				}
				this.historyHealthRList = results.list;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	// 搜索历史记录
	searhShowHistory(urlOptions) {
		this.modalTab = true;
		this.hasHistoryData = false;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.historyList = results.weekbooks;
				this.hasHistoryData = true;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	//查询
	showHistory() {
		//列表
		var urlOptionsList = this.url + '&child_id=' + this.booking.childId + '&statuslist=1,2,3,4,5,11';;
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptionsList += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptionsList += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.bdate_less && this.searchInfo.bdate_less != ''){
			urlOptionsList += '&bdate_less=' + this.searchInfo.bdate_less;
		}
		if(this.searchInfo.bdate_big && this.searchInfo.bdate_big != ''){
			urlOptionsList += '&bdate_big=' + this.searchInfo.bdate_big;
		}
		this.searhShowHistory(urlOptionsList);
	}

	close() {
		this.modalTab = false;
	}

	goHistory(history) {
		window.open('./admin/docbooking?id=' + history.bookingId + '&doctorId=' + history.services[0].userDoctorId + '&pageType=history');
	}

	// 选择实际操作人
	selectOperator() {
		if(this.operator == ''){
			this.toastTab('请先选择实际操作人', 'error');
			return;
		}
		sessionStorage.setItem('actualOperator', this.operator);
	}

	// 成长记录
	goSection(url) {
		// pageType 空为医生， history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
	}

	getBookingData() {
		//获取预约信息
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					if((new Date().getTime() - 24*60*60*1000) > new Date(results.weekbooks[0].bookingDate).getTime()){
						this.canEdit = false;
					}else{
						this.canEdit = true;
					}
					if(results.weekbooks[0].services.length > 0){
						for(var i = 0; i < results.weekbooks[0].services.length; i++){
							if(!this.adminService.isFalse(results.weekbooks[0].services[i].begin)){
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.replace('-', '年');
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.replace('-', '月');
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.replace(' ', '日 ');
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.slice(0, results.weekbooks[0].services[i].begin.indexOf(' '));
							}
							if(!this.adminService.isFalse(results.weekbooks[0].services[i].end)){
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace('-', '年');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace('-', '月');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace(' ', '日 ');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.slice(0, results.weekbooks[0].services[i].end.indexOf(' '));
							}
						}
					}
					// fees中fee为折扣费用，需计算实际费用
					if(results.weekbooks[0].fees.length > 0){
						for(var index in results.weekbooks[0].fees){
							if(results.weekbooks[0].fees[index].number != null){
								results.weekbooks[0].fees[index].originFee = this.adminService.toDecimal2(parseFloat(results.weekbooks[0].fees[index].number) * parseFloat(results.weekbooks[0].fees[index].price));
							}else{
								results.weekbooks[0].fees[index].originFee = results.weekbooks[0].fees[index].fee;
							}
						}
					}
					this.booking = results.weekbooks[0];
					var fees = results.weekbooks[0].fees;
					var total = 0;
					if(fees.length > 0){
						for(var i = 0; i < fees.length; i++){
							if(fees[i].type != 'booking'){
								total += Number(fees[i].fee);
							}
						}
					}
					this.booking.totalFee = this.adminService.toDecimal2(total.toString());

					//中等值身高体重
					var childcontrastUrl = '?child_id=' + this.booking.childId;
					this.adminService.childcontrast(childcontrastUrl).then((data) => {
						if(data.status == 'no'){
							this.loadingShow = false;
							this.toastTab(data.errorMsg, 'error');
						}else{
							sessionStorage.setItem('childcontrast', JSON.stringify(data.results));
							this.loadingShow = false;
						}
					}).catch(() => {
						this.loadingShow = false;
						this.toastTab('服务器错误', 'error');
					});

					// 获取小孩儿保记录
					this.getHistoryHealthRList();
				}
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	// 检查
	changeCheckTab(_value) {
		this.selectedCheckTab = _value;
	}

	// 放大图片
	enlargeImg(ele, type, values) {
		if(type == 'image'){
			this.modalImg = {
				url: ele.src,
				showImg: this.modalImg.showImg == 0 ? 1 : 0,
			}
		}else{
			window.open(values);
		}
	}

	// 选择日期
	changeDate(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
		this.searchInfo[key + '_text'] = this.adminService.dateFormat(JSON.parse(_value).value);
	}

	getCheckData() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&today=1';
		this.adminService.usercheckprojectinfo(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					this.selectedCheckTab = results.list[0].id;
					for(var i = 0; i < results.list.length; i++){
						if(!this.adminService.isFalse(results.list[i].remark)){
							results.list[i].remark = this.sanitizer.bypassSecurityTrustHtml(results.list[i].remark.replace(/;/g, '<br/>'));
						}
					}
				}
				this.checkDataList = results.list;
				this.hasCheckData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this.toastTab('服务器错误', 'error');
		});
	}

	getPrescriptData() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&isout=1&today=1';
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].infoLength = results.list[i].info.length;
						if(results.list[i].info.length > 0){
							for(var j = 0; j < results.list[i].info.length; j++){
								results.list[i].info[j].msExplain = '单次：' + results.list[i].info[j].oneNum + results.list[i].info[j].oneUnit + '，' + results.list[i].info[j].frequency + '，' + results.list[i].info[j].usage + '，共' + results.list[i].info[j].days + '天';
							}
						}
					}
				}
				this.prescriptList = results.list;
				this.hasPrescriptData = true;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	//开方
	prescript() {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId}});
	}

	//追加科室
	addService() {
		this.router.navigate(['./admin/bookingAddService'], {queryParams: {id: this.id, doctorId: this.doctorId}});
	}

	//取消追加费用
	removeFee() {
		//清空费用信息
		this.addFeeInfo.project_name = '';
		this.addFeeInfo.price = '';
		this.addFeeInfo.number = '';
		this.addFeeInfo.fee = '';
		this.addFeeInfo.remarks = '';
		this.addFeeInfo.feeId = '';
		this.addFeeInfo.editType = '';
	}

	// 单价或者数量变化
	changeFee() {
		var price = false;
		if(!this.adminService.isFalse(this.addFeeInfo.price)){
			if(Number(this.addFeeInfo.price) < 0){
				this.toastTab('单价费用应大于等于0', 'error');
			}
			price = true;
		}
		var number = false;
		if(!this.adminService.isFalse(this.addFeeInfo.number)){
			if(Number(this.addFeeInfo.number) <= 0 || Number(this.addFeeInfo.number) % 1 != 0){
				this.toastTab('单价数量应为大于0的整数', 'error');
			}
			number = true;
		}
		if(price && number){
			this.addFeeInfo.fee = (parseFloat(this.addFeeInfo.price) * Number(this.addFeeInfo.number)).toString();
		}
	}

	//追加费用
	addfee() {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.addFeeInfo.editType = 'create';
	}

	//修改费用
	updateFee(fee) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.addFeeInfo.project_name = fee.projectName;
		this.addFeeInfo.price = fee.price;
		this.addFeeInfo.number = fee.number;
		this.addFeeInfo.fee = fee.fee;
		this.addFeeInfo.remarks = fee.remark;
		this.addFeeInfo.feeId = fee.feeId;
		this.addFeeInfo.editProjectId = fee.projectId;
		this.addFeeInfo.editType = 'update';
	}

	editFee(f) {
		this.btnCanEdit = true;
		this.addFeeInfo.project_name = this.adminService.trim(this.addFeeInfo.project_name);
		this.addFeeInfo.remarks = this.adminService.trim(this.addFeeInfo.remarks);
		if(this.addFeeInfo.project_name == ''){
			this.toastTab('消费项目名不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.addFeeInfo.price)){
			this.toastTab('消费项目单价不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.addFeeInfo.price) < 0){
			this.toastTab('消费项目单价应大于等于0', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.addFeeInfo.number)){
			this.toastTab('消费项目数量不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(Number(this.addFeeInfo.number) <= 0 || Number(this.addFeeInfo.number) % 1 != 0){
			this.toastTab('消费项目数量应为大于0的整数', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.addFeeInfo.fee)){
			this.toastTab('消费项目单价不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.addFeeInfo.fee) < 0){
			this.toastTab('消费项目单价应大于等于0', 'error');
			this.btnCanEdit = false;
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			booking_id: this.addFeeInfo.booking_id,
			project_name: this.addFeeInfo.project_name,
			price: this.addFeeInfo.price,
			number: this.addFeeInfo.number,
			fee: this.addFeeInfo.fee,
			remarks: this.addFeeInfo.remarks,
			id: this.addFeeInfo.feeId ? this.addFeeInfo.feeId : null,
		}
		this.adminService.addfee(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				this.getBookingData();
				//清空费用信息
				this.addFeeInfo.project_name = '';
				this.addFeeInfo.price = '';
				this.addFeeInfo.number = '';
				this.addFeeInfo.fee = '';
				this.addFeeInfo.remarks = '';
				this.addFeeInfo.feeId = '';
				this.addFeeInfo.editType = '';
				if(this.addFeeInfo.editType == 'create'){
					this.toastTab('费用添加成功', '');
				}else{
					this.toastTab('费用修改成功', '');
				}
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
			this.btnCanEdit = false;
		});
	}

	addCheck() {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.addCheckInfo.editType = 'create';
	}

	// 删除检查
	deleteCheck(check) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.selector = {
			id: check.id,
			text: '确认删除该检查',
			type: 'check',
		}
		this.modalConfirmTab = true;
	}

	removeCheck() {
		//取消检查单操作
		this.addCheckInfo = {
			booking_id: '',
			check_id: '',
			check_name: '',
			check: '',
			editType: '',
		}
	}

	editCheck(f) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.btnCanEdit = true;
		if(f.value.check == ''){
			this.toastTab('检查不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			booking_id: this.id,
			check_id: JSON.parse(f.value.check).project_id,
			check_name: JSON.parse(f.value.check).name,
		}
		this.adminService.usercheckproject(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				this.toastTab('检查创建成功', '');
				this.getCheckData();
				//清空检查信息
				this.addCheckInfo = {
					booking_id: '',
					check_id: '',
					check_name: '',
					check: '',
					editType: '',
				}
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
			this.btnCanEdit = false;
		});
	}

	// 辅助治疗
	getBookingAssistData() {
		var assistUrl = this.url + '&booking_id=' + this.id;
		this.adminService.bookingassist(assistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.assistList = results.list;
				this.hasAssistData = true;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}
	addAssist() {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.addAssistInfo.editType = 'add';
		this.addAssistInfo.editProjectId = '';
		this.addAssistInfo.project = '';
		this.addAssistInfo.price = '';
		this.addAssistInfo.number = '';
		this.addAssistInfo.fee = '';
		this.addAssistInfo.remarks = '';
	}

	removeAssist() {
		this.addAssistInfo.editType = '';
		this.addAssistInfo.editProjectId = '';
		this.addAssistInfo.project = '';
		this.addAssistInfo.price = '';
		this.addAssistInfo.number = '';
		this.addAssistInfo.fee = '';
		this.addAssistInfo.remarks = '';
	}

	changeAssist() {
		if(!this.adminService.isFalse(this.addAssistInfo.project)){
			this.addAssistInfo.price = JSON.parse(this.addAssistInfo.project).price;
			this.changeAssistNumber();
		}
	}

	changeAssistNumber() {
		if(!this.adminService.isFalse(this.addAssistInfo.number) && (Number(this.addAssistInfo.number) <= 0 || Number(this.addAssistInfo.number) % 1 != 0)){
			this.toastTab('数量应为大于0的整数', 'error');
			return;
		}
		if(!this.adminService.isFalse(this.addAssistInfo.price)){
			this.addAssistInfo.fee = this.adminService.toDecimal2(Number(this.addAssistInfo.number) * parseFloat(this.addAssistInfo.price));
		}
	}

	updateAddAssist(assist) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.addAssistInfo.editType = 'update';
		this.addAssistInfo.editProjectId = assist.id;
		this.addAssistInfo.project = assist.assistName;
		this.addAssistInfo.price = assist.price;
		this.addAssistInfo.number = assist.number;
		this.addAssistInfo.fee = assist.fee;
		this.addAssistInfo.remarks = assist.remarks;
	}

	editAssist() {
		this.btnCanEdit = true;
		if(this.addAssistInfo.editType == 'add'){
			if(this.adminService.isFalse(this.addAssistInfo.project)){
				this.toastTab('辅助治疗不可为空', 'error');
				this.btnCanEdit = false;
				return;
			}
		}else{
			if(this.assistProjects.length > 0){
				for(var i = 0; i < this.assistProjects.length; i++){
					if(this.assistProjects[i].name == this.addAssistInfo.project){
						this.addAssistInfo.project = this.assistProjects[i].string;
					}
				}
			}
		}
		if(this.adminService.isFalse(this.addAssistInfo.number)){
			this.toastTab('数量不可为空', 'error');
			this.btnCanEdit = false;
			return;
		}
		if(Number(this.addAssistInfo.number) <= 0 || Number(this.addAssistInfo.number) % 1 != 0){
			this.toastTab('数量应为大于0的整数', 'error');
			this.btnCanEdit = false;
			return;
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			booking_id: this.id,
			child_id: this.booking.childId,
			assist_id: JSON.parse(this.addAssistInfo.project).id,
			num: this.addAssistInfo.number,
			remarks: this.adminService.trim(this.addAssistInfo.remarks),
			id: this.addAssistInfo.editType == 'update' ? this.addAssistInfo.editProjectId : null,
		}

		this.adminService.addassist(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
				this.btnCanEdit = false;
			}else{
				if(this.addAssistInfo.editType == 'update'){
					this.toastTab('辅助治疗修改成功', '');
				}else{
					this.toastTab('辅助治疗添加成功', '');
				}
				this.removeAssist();
				this.getBookingAssistData();
				this.getBookingData();
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
			this.btnCanEdit = false;
		});
	}

	//删除辅助治疗
	deleteAssist(_id) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.selector = {
			id: _id,
			text: '确认删除该辅助治疗',
			type: 'assist',
		}
		this.modalConfirmTab = true;
	}

	// 中药处方
	getDocTcmList() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&isout=1';
		this.adminService.searchtcmprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.docTcmList = results.list;
				this.hasDocTcmData = true;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	// 开中药处方
	tcmPrescript() {
		sessionStorage.setItem('docBookingDocName', this.booking.services.length > 0 ? this.booking.services[0].userDoctorName : '');
		this.router.navigate(['./admin/doctorTcmPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, creatorId: this.booking.creatorId, childId: this.booking.childId}});
	}

	// 修改中药处方
	updateDocTcm(docTcm) {
		sessionStorage.setItem('docBookingDocName', this.booking.services.length > 0 ? this.booking.services[0].userDoctorName : '');
		this.router.navigate(['./admin/doctorTcmPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, creatorId: this.booking.creatorId, childId: this.booking.childId, tcmPreId: docTcm.id}});
	}

	//修改药方
	updatePrescript(info) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id, type: 'update'}});
	}

	//删除药方
	deletePrescript(_id) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.selector = {
			id: _id,
			text: '确认删除该药方',
			type: 'prescript',
		}
		this.modalConfirmTab = true;
	}

	// 出药后，可继续加药
	continueAdd(info) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id, type: 'continueAdd'}});
	}

	//退药
	backdrug(info) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id, type: 'back'}});
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.modalConfirmTab = false;
		if(this.selector.type == 'prescript'){
			// 删除药方
			var urlOptions = this.selector.id + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token;
			this.adminService.deleteprescript(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('药方删除成功', '');
					this.getPrescriptData();
				}
			}).catch(() => {
				this.toastTab('服务器错误', 'error');
			});
		}else if(this.selector.type == 'check'){
			// 删除检查
			var deleteCheckUrl = this.selector.id + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token;
			this.adminService.deleteusercheck(deleteCheckUrl).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('检查删除成功', '');
					this.getCheckData();
					//清空检查信息
					this.addCheckInfo = {
						booking_id: '',
						check_id: '',
						check_name: '',
						check: '',
						editType: '',
					}
				}
			}).catch(() => {
				this.toastTab('服务器错误', 'error');
			});
		}else if(this.selector.type == 'assist'){
			// 删除辅助治疗
			var deleteAssistUrl = this.selector.id + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&booking_id=' + this.id;
			this.adminService.deleteassist(deleteAssistUrl).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('辅助治疗删除成功', '');
					this.getBookingAssistData();
					//清空辅助治疗信息
					this.removeAssist();
					this.getBookingData();
				}
			}).catch(() => {
				this.toastTab('服务器错误', 'error');
			});
		}
	}

	changeTab(_value) {
		this.selectedTab = _value;
		sessionStorage.setItem('doctorBookingTab', _value);
	}

	changeHistoryHealthRTab(_value) {
		this.historyHealthR = [];
		if(_value == '1'){
			if(this.historyHealthRList.length > 0){
				this.historyHealthR.push(this.historyHealthRList[0]);
			}
		}else{
			if(this.historyHealthRList.length > 0){
				this.historyHealthR.push(this.historyHealthRList[this.historyHealthRList.length - 1]);
			}
		}
		this.selectedHistoryHealthRTab = _value;
	}

	//新增随访
	addFollowups() {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		this.router.navigate(['./admin/bookingFollowups'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create', from: 'docbooking'}});
	}

	//新增成长记录
	addGrowthrecord() {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		this.router.navigate(['./admin/bookingGrowthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
	}

	//修改成长记录
	updateGrowthrecord(growthrecord) {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('growthrecord', JSON.stringify(growthrecord));
		this.router.navigate(['./admin/bookingGrowthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'update'}});
	}

	//新增病例
	addCasehistory() {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		this.router.navigate(['./admin/bookingCasehistory'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
	}

	//修改病例
	updateCasehistory(casehistory) {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('casehistory', JSON.stringify(casehistory));
		this.router.navigate(['./admin/bookingCasehistory'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'update'}});
	}

	// 新增儿保记录
	addHealthrecord() {
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
	}

	// 修改儿保记录
	updateHealthrecord(healthrecord) {
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('healthrecord', JSON.stringify(healthrecord));
		this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctor: this.doctorId, childId: this.booking.childId, type: 'update'}});
	}

	showFile(file) {
		if(file.mimeType == 'image'){
			this.modalImg.url = file.fileUrl;
			this.modalImg.showImg = 1;
		}else{
			window.open(file.fileUrl);
		}
	}

	closeImg() {
		this.modalImg.showImg = 0;
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
