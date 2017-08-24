import { Component, OnInit }                  from '@angular/core';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'app-booking-in',
	templateUrl: './booking-in.component.html'
})
export class BookingInComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	bookinglist: any[];
	modalTab: boolean;
	toast: {
		show: number,
		text: string,
		type:  string,
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
		services: any[],
		time: string,
		type: string,
		userDoctorId: string,
		userDoctorName: string,
	};
	bookingInfo: {
		type: string,
		service: string,
		booking_date: string,
		timeInfo: string,
		user_doctor: string,
		creator: string,
		child: string,
		child_name: string,
		gender: string,
		birth_date: string,
	};
	servicelist: any[];
	doctorlist: any[];
	doctorDutys: any[];
	timelist: any[];
	
	constructor(public adminService: AdminService) {}

	ngOnInit(): void {
		this.topBar = {
			title: '登记',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.modalTab = false;

		this.initData();

		this.getBooking();

		this.getData();
	}

	initData() {
		this.booking = {
			age: '',
			bookingDate: '',
			bookingId: '',
			childId: '',
			childName: '',
			creatorId: '',
			creatorName: '',
			refNo: '',
			services: [],
			time: '',
			type: '',
			userDoctorId: '',
			userDoctorName: '',
		};

		this.bookingInfo = {
			type: 'ZJ',
			service: '',
			booking_date: '',
			timeInfo: '',
			user_doctor: '',
			creator: '',
			child: '',
			child_name: '',
			gender: '',
			birth_date: '',
		}
	}

	getBooking() {
		var todayDate = this.adminService.getDayByDate(new Date());
		var nextDate = this.adminService.getDayByDate(new Date(new Date().getTime() + 24*60*60*1000));
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&status=2' + '&bdate_big=' + todayDate + '&bdate_less=' + nextDate;;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.bookinglist = results.weekbooks;
			}
		});
	}

	getData() {
		//查询诊所服务
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.clinicservices(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].string = JSON.stringify(results.servicelist[i]);
					}
				}
				this.servicelist = results.servicelist;
			}
		})
	}


	todayBooking() {
		this.modalTab = true;
	}

	close() {
		this.modalTab = false;
	}

	show(booking) {
		this.booking = booking;
		this.modalTab = false;
		//根据选择的预约，初始化页面
		if(this.servicelist.length > 0){
			for(var i = 0; i < this.servicelist.length; i++){
				if(this.booking.services[0].serviceId == this.servicelist[i].serviceId){
					this.bookingInfo.service = this.servicelist[i].string;
					this.serviceChange(this.bookingInfo.service);
				}
			}
		}
	}

	// 切换服务
	serviceChange(service) {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&service_id=' + JSON.parse(service).serviceId;
		//根据服务查询医生可预约日期
		this.adminService.searchdoctorservice(urlOptions).then((data) =>　{
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.doctors.length > 0){
					for(var i = 0; i < results.doctors.length; i++){
						results.doctors[i].string = JSON.stringify(results.doctors[i]);
						if(results.doctors[i].doctorId == this.booking.services[0].userDoctorId){
							//修改
							this.bookingInfo.user_doctor = results.doctors[i].string;
							this.doctorChange();
						}
					}
				}
				this.doctorlist = results.doctors;
			}
		})
	}

	//切换医生
	doctorChange() {
		var doctor = JSON.parse(this.bookingInfo.user_doctor);
		if(doctor.doctorDutys.length > 0){
			for(var i = 0; i < doctor.doctorDutys.length; i++){
				doctor.doctorDutys[i].string = JSON.stringify(doctor.doctorDutys[i]);
				if(doctor.doctorDutys[i].dutyDate == this.booking.bookingDate){
					this.bookingInfo.booking_date = doctor.doctorDutys[i].string;
					this.dateChange();
				}
			}
		}
		this.doctorDutys = doctor.doctorDutys;
	}

	//切换时间
	dateChange() {
		var date = JSON.parse(this.bookingInfo.booking_date);
		var list = [];
		var todayTimeNum = Number(new Date().getHours() + '' + new Date().getMinutes());
		if(date.timeList.length > 0){
			for(var i = 0; i < date.timeList.length; i++){
				var time = date.timeList[i];
				var use = true;
				var type = '';
				//判断时间段是否已经被预约
				if(date.selectedList.length > 0){
					for(var j = 0; j < date.selectedList.length; j++){
						if(date.selectedList[j] == time){
							use = false;
							type = '已预约';
						}
					}
				}
				//如果是当天日期，判断时间是否已经过去
				if(this.adminService.getDayByDate(new Date) == date.dutyDate){
					var timeNum = Number(time.replace(':', ''));
					if(timeNum < todayTimeNum){
						use = false;
						type = '已过期';
					}
				}
				var timeJson = {key: i, value: date.timeList[i], use: use, type: type};
				list.push(timeJson);
			}
		}
		this.timelist = list;
		this.bookingInfo.timeInfo = this.booking.time;
	}

	//登记
	bookingIn(f) {
		if(this.booking.refNo && this.booking.refNo != ''){
			if(f.value.service == ''){
				this.toastTab('服务不可为空', 'error');
				return;
			}
			if(f.value.type == 'ZJ' && f.value.user_doctor == ''){
				this.toastTab('预约医生不可为空', 'error');
				return;
			}
			if(f.value.booking_date == ''){
				this.toastTab('预约日期不可为空', 'error');
				return;
			}
			if(f.value.time == ''){
				this.toastTab('预约时间段不可为空', 'error');
				return;
			}
			var updateParam = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				type: this.bookingInfo.type,
				clinic_id: this.adminService.getUser().clinicId,
				service_id: JSON.parse(f.value.service).serviceId,
				user_doctor_id: JSON.parse(f.value.user_doctor).doctorId,
				user_doctor_name: JSON.parse(f.value.user_doctor).doctorName,
				booking_date: JSON.parse(f.value.booking_date).dutyDate,
				time: f.value.time,
			}
			this.adminService.updatebooking(this.booking.bookingId, updateParam).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var params = {
						username: this.adminService.getUser().username,
						token: this.adminService.getUser().token,
						status: 3,
					}
					this.adminService.updatebookstatus(this.booking.bookingId ,params).then((data) => {
						if(data.status == 'no'){
							this.toastTab(data.errorMsg, 'error');
						}else{
							this.toastTab('登记成功', '');
							this.getBooking();
							//登记成功后，清空选中预约信息
							this.initData();
						}
					});
				}
			});
		}else{
			this.toastTab('请选择预约单', 'warning');
		}
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