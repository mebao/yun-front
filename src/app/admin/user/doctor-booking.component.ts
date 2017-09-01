import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-doctor-booking',
	templateUrl: './doctor-booking.component.html',
	styleUrls: ['./doctor-booking.component.scss'],
})
export class DoctorBookingComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
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
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	//开方
	hasPrescriptData: boolean;
	prescriptList: any[];
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
	};
	canEdit: boolean;
	selectedTab: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
	}
	//随访
	hasFollowupsData: boolean;
	followupsList: any[];
	//成长记录
	growthrecordList: any[];
	hasGrowthrecordData: boolean;
	//病例
	casehistoryList: any[];
	hasCasehistoryData: boolean;

	constructor(
		private adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '接诊',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.id = '';
		this.doctorId = '';
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
		}

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
		};
		//判断sessionStorage中是否已经缓存
		if(sessionStorage.getItem('doctorBookingTab')){
			this.selectedTab = sessionStorage.getItem('doctorBookingTab');
		}else{
			this.selectedTab = '3';
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
			this.doctorId = params['doctorId'];
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
		this.getCheckData();

		//获取开方信息
		this.hasPrescriptData = false;
		this.prescriptList = [];
		this.getPrescriptData();

		//随访
		this.hasFollowupsData = false;
		this.followupsList = [];
		this.adminService.userfollowups(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.followupsList = results.list;
				this.hasFollowupsData = true;
			}
		});

		//成长记录
		this.hasGrowthrecordData = false;
		this.growthrecordList = [];
		var growthrecordUrl = this.url + '&booking_id=' + this.id;
		this.adminService.childgrowthrecords(growthrecordUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.growthrecordList = results.list;
				this.hasGrowthrecordData = true;
			}
		});

		//病例
		this.casehistoryList = [];
		this.hasCasehistoryData = false;
		var casehistoryUrl = this.url + '&booking_id=' + this.id;
		this.adminService.searchcasehistory(casehistoryUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.casehistoryList = results.list;
				this.hasCasehistoryData = true;
			}
		});

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
		})
	}

	getBookingData() {
		//获取预约信息
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if((new Date().getTime() - 24*60*60*1000) > new Date(results.weekbooks[0].bookingDate).getTime()){
					this.canEdit = false;
				}else{
					this.canEdit = true;
				}
				this.booking = results.weekbooks[0];
				var fees = results.weekbooks[0].fees;
				var total = 0;
				if(fees.length > 0){
					for(var i = 0; i < fees.length; i++){
						total += Number(fees[i].fee);
					}
				}
				this.booking.totalFee = total.toString();
			}
		});
	}

	getCheckData() {
		var urlOptions = this.url + '&booking_id=' + this.id;
		this.adminService.usercheckprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.checkDataList = results.list;
				this.hasCheckData = true;
			}
		});
	}

	getPrescriptData() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&isout=1&today=1';
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.prescriptList = results.list;
				this.hasPrescriptData = true;
			}
		});
	}

	//开方
	prescript() {
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId}});
	}

	//追加服务
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

	//追加费用
	addfee() {
		this.addFeeInfo.editType = 'create';
	}

	//修改费用
	updateFee(fee) {
		this.addFeeInfo.project_name = fee.projectName;
		this.addFeeInfo.price = fee.price;
		this.addFeeInfo.number = fee.number;
		this.addFeeInfo.fee = fee.fee;
		this.addFeeInfo.remarks = fee.remark;
		this.addFeeInfo.feeId = fee.feeId;
		this.addFeeInfo.editType = 'update';
	}

	editFee(f) {
		if(f.value.project_name == ''){
			this.toastTab('消费项目名不可为空', 'error');
			return;
		}
		if(f.value.fee == ''){
			this.toastTab('费用不可为空', 'error');
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
			remarks: f.value.remarks,
			id: this.addFeeInfo.feeId ? this.addFeeInfo.feeId : null,
		}
		this.adminService.addfee(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
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
			}
		})
	}

	addCheck() {
		this.addCheckInfo.editType = 'create';
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
		if(f.value.check == ''){
			this.toastTab('检查不可为空', 'error');
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			booking_id: this.id,
			check_id: JSON.parse(f.value.check).id,
			check_name: JSON.parse(f.value.check).name,
		}
		this.adminService.usercheckproject(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
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
			}
		})
	}

	//修改药方
	updatePrescript(info) {
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id}});
	}

	//删除药方
	deletePrescript(_id) {
		this.selector = {
			id: _id,
			text: '确认删除该药方',
		}
		this.modalConfirmTab = true;
	}

	//退药
	backdrug(info) {
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id, type: 'back'}});
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		var urlOptions = this.selector.id + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;
		this.adminService.deleteprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('药方删除成功', '');
				this.modalConfirmTab = false;
				this.getPrescriptData();
			}
		})
	}

	changeTab(_value) {
		this.selectedTab = _value;
		sessionStorage.setItem('doctorBookingTab', _value);
	}
	
	//新增随访
	addFollowups() {
		this.router.navigate(['./admin/bookingFollowups'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
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