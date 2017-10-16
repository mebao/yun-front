import { Component, OnInit }                  from '@angular/core';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'app-booking-in',
	templateUrl: './booking-in.component.html',
	styleUrls: ['./booking-in.component.scss'],
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
	childlist: any[];
	selectSearchTitle: string;
	// 初始化字段，只有首次进入，方才有复制，
	initPage: {
		doctor: boolean,
		date: boolean,
		time: boolean,
	}

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

		this.selectSearchTitle = '请选择宝宝';

		//查询宝宝列表
		var searchchildUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
		this.adminService.searchchild(searchchildUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				for(var i =0; i < results.child.length; i++){
					results.child[i].string = JSON.stringify(results.child[i]);
					results.child[i].key = JSON.stringify(results.child[i]);
					results.child[i].value = results.child[i].childName;
				}
				this.childlist = results.child;
			}
		});
		this.initPage = {
			doctor: true,
			date: true,
			time: true,
		}

		this.modalTab = false;

		this.initData();

		this.getBooking();

		this.getData();
	}

	initData() {
		this.timelist = [
			{key: 0, type: 'overdue', value: '08:00'},
			{key: 1, type: 'overdue', value: '08:30'},
			{key: 2, type: 'overdue', value: '09:00'},
			{key: 3, type: 'overdue', value: '09:30'},
			{key: 4, type: 'overdue', value: '10:00'},
			{key: 5, type: 'overdue', value: '10:30'},
			{key: 6, type: 'overdue', value: '11:00'},
			{key: 7, type: 'overdue', value: '11:30'},
			{key: 8, type: 'overdue', value: '12:00'},
			{key: 9, type: 'overdue', value: '12:30'},
			{key: 10, type: 'overdue', value: '13:00'},
			{key: 11, type: 'overdue', value: '13:30'},
			{key: 12, type: 'overdue', value: '14:00'},
			{key: 13, type: 'overdue', value: '14:30'},
			{key: 14, type: 'overdue', value: '15:00'},
			{key: 15, type: 'overdue', value: '15:30'},
			{key: 16, type: 'overdue', value: '16:00'},
			{key: 17, type: 'overdue', value: '16:30'},
			{key: 18, type: 'overdue', value: '17:00'},
			{key: 19, type: 'overdue', value: '17:30'},
			{key: 20, type: 'overdue', value: '18:00'},
			{key: 21, type: 'overdue', value: '18:30'},
			{key: 22, type: 'overdue', value: '19:00'},
			{key: 23, type: 'overdue', value: '19:30'},
			{key: 24, type: 'overdue', value: '20:00'},
			{key: 25, type: 'overdue', value: '20:30'},
			{key: 26, type: 'overdue', value: '21:00'},
			{key: 27, type: 'overdue', value: '21:30'},
			{key: 28, type: 'overdue', value: '22:00'},
			{key: 29, type: 'overdue', value: '22:30'},
			{key: 30, type: 'overdue', value: '23:00'},
			{key: 31, type: 'overdue', value: '23:30'},
		];

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
			 + '&status=2' + '&bdate_big=' + todayDate + '&bdate_less=' + todayDate;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					for(var i = 0; i < results.weekbooks.length; i++){
						results.weekbooks[i].servicesLength = results.weekbooks[i].services.length;
					}
				}
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
		// 重新选定
		this.initPage = {
			doctor: true,
			date: true,
			time: true,
		}

		booking.bookingDate = this.adminService.dateFormatHasWord(booking.bookingDate);
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
						// 是否首次进入
						if(this.initPage.doctor){
							//判断是新增预约还是已经预约的订单
							if(this.booking.refNo && this.booking.refNo != ''){
								if(results.doctors[i].doctorId == this.booking.services[0].userDoctorId){
									//修改
									this.bookingInfo.user_doctor = results.doctors[i].string;
									this.doctorChange();
								}
							}
						}
					}
				}
				if(!this.initPage.doctor){
					this.bookingInfo.user_doctor = '';
					this.bookingInfo.booking_date = '';
					this.bookingInfo.timeInfo = '';
				}
				this.initPage.doctor = false;
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
				// 是否首次进入
				if(this.initPage.date){
					if(doctor.doctorDutys[i].dutyDate == this.booking.bookingDate){
						this.bookingInfo.booking_date = doctor.doctorDutys[i].string;
						this.dateChange();
					}
				}
			}
		}
		if(!this.initPage.date){
			this.bookingInfo.booking_date = '';
			this.bookingInfo.timeInfo = '';
		}
		this.initPage.date = false;
		this.doctorDutys = doctor.doctorDutys;
	}

	//切换时间
	dateChange() {
		var date = JSON.parse(this.bookingInfo.booking_date);
		var list = [];
		var todayTimeNum = Number((new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()) + '' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()));
		for(var i = 0; i < this.timelist.length; i++){
			// 初始化
			this.timelist[i].type = 'overdue';
			// 查询可预约日期
			if(date.timeList.length > 0){
				for(var j = 0; j < date.timeList.length; j++){
					if(this.timelist[i].value == date.timeList[j]){
						this.timelist[i].type = 'can';
					}
				}
			}
			// 判断时间段是否已经被预约
			if(date.selectedList.length > 0){
				for(var j = 0; j < date.selectedList.length; j++){
					if(this.timelist[i].value == date.selectedList[j]){
						this.timelist[i].type = 'already';
					}
				}
			}
			//如果是当天日期，判断时间是否已经过去
			if(this.adminService.getDayByDate(new Date) == date.dutyDate){
				var timeNum = Number(this.timelist[i].value.replace(':', ''));
				if(timeNum < todayTimeNum){
					this.timelist[i].type = 'overdue';
				}
			}
		}
		// 是否首次进入
		if(this.initPage.time){
			this.bookingInfo.timeInfo = this.booking.time;
		}else{
			this.bookingInfo.timeInfo = '';
		}
		this.initPage.time = false;
	}

	// 选择时间
	selectTime(time) {
		if(time.type == 'can'){
			this.bookingInfo.timeInfo = time.value;
		}
	}

	//切换宝宝
	onVoted(_value) {
		this.bookingInfo.child = _value;
		this.bookingInfo.child_name = JSON.parse(_value).childName;
		//根据宝宝信息查询家长信息
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&child_id=' + JSON.parse(_value).childId;
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					this.bookingInfo.creator = JSON.stringify(results.users[0]);
				}
			}
		});

	}

	//登记
	editIn(f) {
		if(f.value.service == ''){
			this.toastTab('科室不可为空', 'error');
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
		if(this.bookingInfo.timeInfo == ''){
			this.toastTab('预约时间段不可为空', 'error');
			return;
		}
		if(this.booking.refNo == '' && this.bookingInfo.child == ''){
			this.toastTab('宝宝不可为空', 'error');
			return;
		}
		//判断是新预约还是登记已经预约信息
		if(this.booking.refNo == ''){
			//创建预约
			var param = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				type: this.bookingInfo.type,
				clinic_id: this.adminService.getUser().clinicId,
				service_id: JSON.parse(f.value.service).serviceId,
				user_doctor_id: JSON.parse(f.value.user_doctor).doctorId,
				user_doctor_name: JSON.parse(f.value.user_doctor).doctorName,
				booking_date: JSON.parse(f.value.booking_date).dutyDate,
				time: this.bookingInfo.timeInfo,
				creator_id: JSON.parse(this.bookingInfo.creator).id,
				creator_name: JSON.parse(this.bookingInfo.creator).name,
				mobile: JSON.parse(this.bookingInfo.creator).mobile,
				child_name: JSON.parse(this.bookingInfo.child).childName,
				child_id: JSON.parse(this.bookingInfo.child).childId,
			}
			this.adminService.bookingcreate(param).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.booking.bookingId = results.bookingId;
					//构造宝宝数据，用以清空宝宝组件
					this.booking.refNo = 'clear';
					this.booking.childName = JSON.parse(this.bookingInfo.child).childName;
					this.bookingIn();
				}
			})
		}else{
			//修改预约并登记
			this.updateBooking(f);
		}
	}

	updateBooking(f) {
		var updateParam = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			type: this.bookingInfo.type,
			clinic_id: this.adminService.getUser().clinicId,
			service_id: JSON.parse(f.value.service).serviceId,
			user_doctor_id: JSON.parse(f.value.user_doctor).doctorId,
			user_doctor_name: JSON.parse(f.value.user_doctor).doctorName,
			booking_date: JSON.parse(f.value.booking_date).dutyDate,
			time: this.bookingInfo.timeInfo,
		}
		this.adminService.updatebooking(this.booking.bookingId, updateParam).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.bookingIn();
			}
		});
	}

	bookingIn() {
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
