import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../../admin.service';

@Component({
	selector: 'admin-doctor-booking-growthrecords',
	templateUrl: './docbooking-growthrecords.component.html',
})
export class DocbookingGrowthrecordsComponent implements OnInit{
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
		mobile: string,
		remark: string,
	};
	//成长记录
	growthrecordList: any[];
	hasGrowthrecordData: boolean;
	// 是否可编辑
	canEdit: boolean;
	// 药方
	prescriptList: any[];
	prescription: any[];
	// pageType 空为医生接诊， history为查看
	pageType: string;
	// 就诊记录
	historyList: any[];
	hasHistoryData: boolean;
	modalTab: boolean;

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

		this.loadingShow = true;

		this.id = '';
		this.doctorId = '';
		this.canEdit = true;

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
			mobile: '',
			remark: '',
		};

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
			this.doctorId = params['doctorId'];
			this.pageType = params.pageType;
		});

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
		//获取预约信息
		this.getBookingData();

		//成长记录
		this.hasGrowthrecordData = false;
		this.growthrecordList = [];
		var growthrecordUrl = this.url + '&booking_id=' + this.id;
		this.adminService.childgrowthrecords(growthrecordUrl).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].checkDate = results.list[i].checkDate ? this.adminService.dateFormat(results.list[i].checkDate) : results.list[i].checkDate;
						results.list[i].reviewDate = results.list[i].reviewDate ? this.adminService.dateFormat(results.list[i].reviewDate) : results.list[i].reviewDate;
					}
				}
				this.growthrecordList = results.list;
				this.hasGrowthrecordData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this.toastTab('服务器错误', 'error');
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
		}).catch(() => {
            this.toastTab('服务器错误', 'error');
        });

		// 获取药方
		this.prescriptList = [];
		this.prescription = [];
		this.getPrescriptData();

		this.historyList = [];
		this.hasHistoryData = false;
		this.modalTab = false;
	}

	// 历史记录
	showHistory() {
		this.modalTab = true;
		this.hasHistoryData = false;
		var urlOptions = this.url + '&child_id=' + this.booking.childId;
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

	close() {
		this.modalTab = false;
	}

	goHistory(history) {
		window.open('./admin/docbooking?id=' + history.bookingId + '&doctorId=' + history.services[0].userDoctorId + '&pageType=history');
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
					}
					var prescript = results.list[0];
					if(prescript.info.length > 0){
						for(var i = 0; i < prescript.info.length; i++){
							this.prescription.push({
								value: prescript.info[i].pname + ': ' + prescript.info[i].frequency
									 + '，一次' + prescript.info[i].oneNum + prescript.info[i].oneUnit
									 + '，' + prescript.info[i].usage
									 + '，需服用' + prescript.info[i].days + '天'
									 + '，共开' + prescript.info[i].num + prescript.info[i].unit + '。'
							});
						}
					}
				}
				this.prescriptList = results.list;
			}
		}).catch(() => {
            this.toastTab('服务器错误', 'error');
        });
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
				this.booking.totalFee = this.adminService.toDecimal2(total.toString());
			}
		}).catch(() => {
            this.toastTab('服务器错误', 'error');
        });
	}

	changeTab(_value, url) {
		sessionStorage.setItem('doctorBookingTab', _value);
		// pageType 空为医生接诊， history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
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
