import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../admin.service';
import { DoctorService }                      from '../doctor/doctor.service';

@Component({
	selector: 'admin-doctor-booking-healthrecord',
	templateUrl: './doctor-booking-healthrecord.component.html'
})
export class DoctorBookingHealthrecordComponent implements OnInit{
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
	canEdit: boolean;
	// 儿保记录
	healthrecordList: any[];
	hasHealthrecordData: boolean;
	// 儿保记录模板
	recordtempletList: any[];
	selectedTemplet: string;
	// pageType 空为医生接诊, history为查看
	pageType: string;

	constructor(
		private adminService: AdminService,
		private doctorService: DoctorService,
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

		// 儿保记录
		this.healthrecordList = [];
		this.hasHealthrecordData = false;

		var healthrecordUrl = this.url + '&booking_id=' + this.id;
		this.adminService.searchhealthrecord(healthrecordUrl).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].reviewDate = results.list[i].reviewDate ? this.adminService.dateFormat(results.list[i].reviewDate) : results.list[i].reviewDate;
					}
				}
				this.healthrecordList = results.list;
				this.hasHealthrecordData = true;
				this.loadingShow = false;
			}
		});

		// 儿保记录模板
		this.recordtempletList = [];
		this.selectedTemplet = '';
		var searchrecordtempletUrl = this.url + '&doctor_id=' + this.doctorId
			 + '&status=1';
		this.doctorService.searchrecordtemplet(searchrecordtempletUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.recordtempletList = results.list;
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
				});
			}
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

	// 新增儿保记录
	addHealthrecord() {
		if(this.selectedTemplet == ''){
			this.toastTab('请先选择模板', 'error');
			return;
		}
		sessionStorage.setItem('doctorBookingRecordTemplet', this.selectedTemplet);
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
	}

	// 修改儿保记录
	updateHealthrecord(healthrecord) {
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('healthrecord', JSON.stringify(healthrecord));
		this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctor: this.doctorId, childId: this.booking.childId, type: 'update'}});
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
