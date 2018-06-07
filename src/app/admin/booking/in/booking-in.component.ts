import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';
import { Observable }                         from 'rxjs';

import { NzMessageService }                   from 'ng-zorro-antd';

import { DialogService }                      from '../../dialog.service';

import { AdminService }                       from '../../admin.service';

@Component({
	selector: 'app-booking-in',
	templateUrl: './booking-in.component.html',
	styleUrls: ['./booking-in.component.scss', '../../../../assets/css/ant-common.scss'],
})
export class BookingInComponent{
	topBar: {
		title: string,
		back: boolean,
		alert: {
			type: string,
			text: string,
		}
	};
	bookinglist: any[];
	modalTab: boolean;
	moduleAuthority: {
		// 用户管理
		see: boolean,
	}
	booking: {
		age: string,
		bookingDate: string,
		bookingId: string,
		childId: string,
		childName: string,
		creatorId: string,
		creatorName: string,
		refNo: string,
		fees: any[],
		services: any[],
		time: string,
		type: string,
		userDoctorId: string,
		userDoctorName: string,
		remark: string,
		bookingFee: string,
		refereeId: string,
	};
	bookingInfo: {
		type: string,
		service: string,
		service_name: string,
		service_fee: string,
		service_asq: boolean,
		booking_date: string,
		// 日期
		bookingDate: string,
		timeInfo: string,
		user_doctor: string,
		creator: string,
		child: string,
		child_name: string,
		gender: string,
		birth_date: string,
		remark: string,
		booking_fee: string,
		referee: string,
	};
	bookingInfoOld: any;
	servicelist: any[];
	doctorlist: any[];
	doctorDutys: {
		dutyDate: string,
		string: string,
		weekDay: string,
		timeList:any[],
		selectedList:any[],
	};
	timelist: any[];
	childlist: any[];
	selectSearchTitle: string;
	// 初始化字段，只有首次进入，方才有复制，
	initPage: {
		doctor: boolean,
		date: boolean,
		time: boolean,
	}
	// 不可连续点击
	canEdit: boolean;
	// 预约成功后的id
	successBookingId: string;
	// 预约成功后，
	modalTabType: boolean;
	// 再次预约
	modalTabAgain: boolean;
	bookingAgainText: string;
	// 加载中
	loadingShow: boolean;
	// 推荐人列表
	adminList: any[];
	intervalObj: any;

	constructor(
		private _message: NzMessageService,
		private dialogService: DialogService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '登记',
			back: false,
            alert: {
                type: 'warning',
                text: '登记的预约功能只能用作当天已经来到诊所的用户，预约成功后，状态为已登记。',
            }
		}
		this.bookinglist = [];
		this.doctorDutys = {
			dutyDate: '',
			string: '',
			weekDay: '',
			timeList:[],
			selectedList:[],
		};

		// 获取用户是否含有充值权限
		this.moduleAuthority = {
			see: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			this.moduleAuthority.see = true;
		}else{
			var userClinicRoles = JSON.parse(sessionStorage.getItem('userClinicRoles'));
			if(userClinicRoles.length > 0){
				for(var i = 0; i < userClinicRoles.length; i++){
					if(userClinicRoles[i].keyName == 'userList'){
						// 查询用户管理下是否含有充值权限
						if(userClinicRoles[i].infos.length > 0){
							for(var j = 0; j < userClinicRoles[i].infos.length; j++){
								if(userClinicRoles[i].infos[j].keyName == 'see'){
									this.moduleAuthority.see = true;
								}
							}
						}
					}
				}
			}
		}

		this.selectSearchTitle = '请选择宝宝';

		//查询宝宝列表
		var searchchildUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.searchchild(searchchildUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				for(var i =0; i < results.child.length; i++){
					results.child[i].string = JSON.stringify(results.child[i]);
					results.child[i].key = JSON.stringify(results.child[i]);
					results.child[i].value = results.child[i].childName;
				}
				this.childlist = results.child;
			}
		}).catch(() => {
            this._message.error('服务器错误');
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

		this.canEdit = false;

		this.successBookingId = '';
		this.modalTabType = false;
		this.modalTabAgain = false;
		this.bookingAgainText = '';
		this.loadingShow = false;
		sessionStorage.setItem('canDeactivate', 'bookingIn');
	}

	canDeactivate(): Observable<boolean> | boolean {
    	// Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    	if (JSON.stringify(this.bookingInfo) == JSON.stringify(this.bookingInfoOld)) {
      		return true;
    	}
    	// Otherwise ask the user with the dialog service and return its
    	// observable which resolves to true or false when the user decides
    	if(sessionStorage.getItem('canDeactivate') == 'bookingIn_canDeactivate'){
			return true;
		}else{
    		return this.dialogService.confirm('数据尚未保存，是否离开?');
		}
  	}

	// 添加宝宝
	addChild() {
		this.router.navigate(['./admin/userList']);
	}

	initData() {
		this.timelist = [
			// {key: 0, type: 'overdue', value: '08:00'},
			// {key: 1, type: 'overdue', value: '08:30'},
			// {key: 2, type: 'overdue', value: '09:00'},
			// {key: 3, type: 'overdue', value: '09:30'},
			// {key: 4, type: 'overdue', value: '10:00'},
			// {key: 5, type: 'overdue', value: '10:30'},
			// {key: 6, type: 'overdue', value: '11:00'},
			// {key: 7, type: 'overdue', value: '11:30'},
			// {key: 8, type: 'overdue', value: '12:00'},
			// {key: 9, type: 'overdue', value: '12:30'},
			// {key: 10, type: 'overdue', value: '13:00'},
			// {key: 11, type: 'overdue', value: '13:30'},
			// {key: 12, type: 'overdue', value: '14:00'},
			// {key: 13, type: 'overdue', value: '14:30'},
			// {key: 14, type: 'overdue', value: '15:00'},
			// {key: 15, type: 'overdue', value: '15:30'},
			// {key: 16, type: 'overdue', value: '16:00'},
			// {key: 17, type: 'overdue', value: '16:30'},
			// {key: 18, type: 'overdue', value: '17:00'},
			// {key: 19, type: 'overdue', value: '17:30'},
			// {key: 20, type: 'overdue', value: '18:00'},
			// {key: 21, type: 'overdue', value: '18:30'},
			// {key: 22, type: 'overdue', value: '19:00'},
			// {key: 23, type: 'overdue', value: '19:30'},
			// {key: 24, type: 'overdue', value: '20:00'},
			// {key: 25, type: 'overdue', value: '20:30'},
			// {key: 26, type: 'overdue', value: '21:00'},
			// {key: 27, type: 'overdue', value: '21:30'},
			// {key: 28, type: 'overdue', value: '22:00'},
			// {key: 29, type: 'overdue', value: '22:30'},
			// {key: 30, type: 'overdue', value: '23:00'},
			// {key: 31, type: 'overdue', value: '23:30'},
		];
		this.adminList = [];
		this.booking = {
			age: '',
			bookingDate: '',
			bookingId: '',
			childId: '',
			childName: '',
			creatorId: '',
			creatorName: '',
			refNo: '',
			fees: [],
			services: [],
			time: '',
			type: '',
			userDoctorId: '',
			userDoctorName: '',
			remark: '',
			bookingFee: '',
			refereeId: '',
		};

		this.bookingInfo = {
			type: 'ZJ',
			service: '',
			service_name: '',
			service_fee: '',
			service_asq: false,
			booking_date: '',
			bookingDate: '',
			timeInfo: '',
			user_doctor: '',
			creator: '',
			child: null,
			child_name: '',
			gender: '',
			birth_date: '',
			remark: '',
			booking_fee: '',
			referee: '',
		}
		this.bookingInfo.service = null;
		this.bookingInfo.user_doctor = null;
		this.bookingInfo.booking_date = null;
		this.bookingInfoOld = JSON.parse(JSON.stringify(this.bookingInfo));
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
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					for(var i = 0; i < results.weekbooks.length; i++){
						results.weekbooks[i].servicesLength = results.weekbooks[i].services.length;
					}
				}
				this.bookinglist = results.weekbooks;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	getData() {
		// 获取推荐人信息
		var adminlistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					for(var key in results.adminlist){
						results.adminlist[key].string = JSON.stringify({
							id: results.adminlist[key].id,
							name: results.adminlist[key].realName,
						});
					}
				}
				this.adminList = results.adminlist;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });

		//查询诊所科室
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].string = JSON.stringify(results.servicelist[i]);
					}
				}
				this.servicelist = results.servicelist;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
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
		this.bookingInfo.remark = this.booking.remark;
		// 获取预约金
		if(this.booking.fees.length > 0){
			for(var i = 0; i < this.booking.fees.length; i++){
				if(this.booking.fees[i].type == 'booking'){
					this.bookingInfo.booking_fee = this.booking.fees[i].fee;
				}
			}
		}
		this.modalTab = false;
		// 获取推荐人
		if(this.adminList.length > 0){
			for(var key in this.adminList){
				if(this.booking.refereeId == this.adminList[key].id){
					this.bookingInfo.referee = this.adminList[key].string;
				}
			}
		}

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

	// 切换科室
	serviceChange(service) {
		this.bookingInfo.service_name = JSON.parse(service).serviceName;
		this.bookingInfo.service_fee = JSON.parse(service).fee;
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&service_id=' + JSON.parse(service).serviceId;
		//根据科室查询医生可预约日期
		this.adminService.searchdoctorservice(urlOptions).then((data) =>　{
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
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
									this.doctorChange('');
								}
							}
						}
					}
				}
				if(!this.initPage.doctor){
					this.bookingInfo.user_doctor = (this.bookingInfo.user_doctor == null ? '' : null);
					this.bookingInfo.booking_fee = '';
					this.bookingInfo.booking_date = (this.bookingInfo.booking_date == null ? '' : null);
					this.timelist = [];
					this.bookingInfo.timeInfo = '';
				}
				this.initPage.doctor = false;
				this.doctorlist = results.doctors;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	//切换医生
	doctorChange(type) {
		var doctor = JSON.parse(this.bookingInfo.user_doctor);
		if(type == 'changeBookingFee'){
			this.bookingInfo.booking_fee = doctor.bookingFee;
		}
		if(doctor.doctorDutys.length > 0){
			for(var i = 0; i < doctor.doctorDutys.length; i++){
				doctor.doctorDutys[i].string = JSON.stringify(doctor.doctorDutys[i]);
				var nowDate = this.adminService.getDayByDate(new Date);
				if(doctor.doctorDutys[i].dutyDate == nowDate){
					this.doctorDutys = doctor.doctorDutys[i];
					if(this.bookingInfo.booking_date == null){
						this.bookingInfo.booking_date = '';
					}else{
						this.bookingInfo.booking_date = null
					}
				}
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
			this.bookingInfo.booking_date = (this.bookingInfo.booking_date == null ? '' : null);
			this.timelist = [];
			this.bookingInfo.timeInfo = '';
		}
		this.initPage.date = false;
	}

	//切换时间
	dateChange() {
		var date = JSON.parse(this.bookingInfo.booking_date);
		this.bookingInfo.bookingDate = date.dutyDate;
		var list = [];
		var todayTimeNum = Number((new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()) + '' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()));

		this.timelist = [];
		// 查询可预约日期
		if(date.timeList.length > 0){
			for(var i = 0; i < date.timeList.length; i++){
				var item = {
					key: i,
					type: 'can',
					value: date.timeList[i],
				}
				this.timelist.push(item);
			}
		}

		for(var i = 0; i < this.timelist.length; i++){
			// 判断时间段是否已经被预约
			if(date.selectedList.length > 0){
				for(var j = 0; j < date.selectedList.length; j++){
					if(this.timelist[i].value == date.selectedList[j]){
						this.timelist[i].type = 'already';
					}
				}
			}
			//如果是当天日期，判断时间是否已经过去
			// if(this.adminService.getDayByDate(new Date) == date.dutyDate){
			// 	var timeNum = Number(this.timelist[i].value.replace(':', ''));
			// 	if(timeNum < todayTimeNum){
			// 		this.timelist[i].type = 'overdue';
			// 	}
			// }
		}

		// for(var i = 0; i < this.timelist.length; i++){
		// 	// 初始化
		// 	this.timelist[i].type = 'overdue';
		// 	// 查询可预约日期
		// 	if(date.timeList.length > 0){
		// 		for(var j = 0; j < date.timeList.length; j++){
		// 			if(this.timelist[i].value == date.timeList[j]){
		// 				this.timelist[i].type = 'can';
		// 			}
		// 		}
		// 	}
		// 	// 判断时间段是否已经被预约
		// 	if(date.selectedList.length > 0){
		// 		for(var j = 0; j < date.selectedList.length; j++){
		// 			if(this.timelist[i].value == date.selectedList[j]){
		// 				this.timelist[i].type = 'already';
		// 			}
		// 		}
		// 	}
		// 	//如果是当天日期，判断时间是否已经过去
		// 	if(this.adminService.getDayByDate(new Date) == date.dutyDate){
		// 		var timeNum = Number(this.timelist[i].value.replace(':', ''));
		// 		if(timeNum < todayTimeNum){
		// 			this.timelist[i].type = 'overdue';
		// 		}
		// 	}
		// }
		// 是否首次进入
		if(this.initPage.time){
			this.bookingInfo.timeInfo = this.booking.time;
		}else{
			this.bookingInfo.timeInfo = '';
		}
		this.initPage.time = false;
	}

	// 选择时间
	selectTime(time, selectedTime) {
		if(time.type == 'can' || selectedTime){
			this.bookingInfo.timeInfo = time.value;
		}
	}

	//切换宝宝
	getUserInfo(_value) {
		this.bookingInfo.child = _value;
		this.bookingInfo.child_name = JSON.parse(_value).childName;
		//根据宝宝信息查询家长信息
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&child_id=' + JSON.parse(_value).childId;
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					this.bookingInfo.creator = JSON.stringify(results.users[0]);
				}
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });

	}

	//登记
	editIn() {
		this.canEdit = true;
		if(this.booking.refNo == '' && this.bookingInfo.child == ''){
			this._message.error('宝宝不可为空');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.service == ''){
			this._message.error('科室不可为空');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.type == 'ZJ' && this.bookingInfo.user_doctor == ''){
			this._message.error('预约医生不可为空');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.booking_date == ''){
			this._message.error('预约日期不可为空');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.timeInfo == ''){
			this._message.error('预约时间段不可为空');
			this.canEdit = false;
			return;
		}
		// 判断是新预约还是登记已经预约信息
		if(this.booking.refNo == ''){
			// 创建预约，预约金为0
			this.bookingInfo.booking_fee = '0';
			// if(this.adminService.isFalse(this.bookingInfo.booking_fee)){
			// 	this._message.error('预约金不可为空');
			// 	this.canEdit = false;
			// 	return;
			// }
			// if(parseFloat(this.bookingInfo.booking_fee) < 0 || parseFloat(this.bookingInfo.booking_fee) > parseFloat(JSON.parse(this.bookingInfo.service).fee)){
			// 	this._message.error('预约金应大于等于0，小于科室费');
			// 	return;
			// }
			this.loadingShow = true;
			// 创建预约时，验证该患者是否已经预约
			var todayDate = this.adminService.getDayByDate(new Date());
			var url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId
				 + '&child_id=' + JSON.parse(this.bookingInfo.child).childId
				 + '&creator_id=' + JSON.parse(this.bookingInfo.creator).id
				 + '&booking_date=' + JSON.parse(this.bookingInfo.booking_date).dutyDate;
			this.adminService.checkbooking(url).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this._message.error(data.errorMsg);
					this.canEdit = false;
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.id != ''){
						this.loadingShow = false;
						this.bookingAgainText = JSON.parse(this.bookingInfo.child).childName + ' ' + this.adminService.dateFormat(JSON.parse(this.bookingInfo.booking_date).dutyDate) + ' 已存在预约，是否继续预约？';
						this.modalTabAgain = true;
					}else{
						this.confirmBooking();
					}
				}
			}).catch(() => {
				this.loadingShow = false;
                this._message.error('服务器错误');
				this.canEdit = false;
            });
		}else{
			this.loadingShow = true;
			//修改预约并登记
			this.updateBooking();
		}
	}

	closeAgain() {
		this.canEdit = false;
		this.modalTabAgain = false;
	}

	confirmAgain() {
		this.modalTabAgain = false;
		this.confirmBooking();
	}

	// 预约
	confirmBooking() {
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			type: this.bookingInfo.type,
			clinic_id: this.adminService.getUser().clinicId,
			service_id: JSON.parse(this.bookingInfo.service).serviceId,
			user_doctor_id: JSON.parse(this.bookingInfo.user_doctor).doctorId,
			user_doctor_name: JSON.parse(this.bookingInfo.user_doctor).doctorName,
			booking_date: JSON.parse(this.bookingInfo.booking_date).dutyDate,
			time: this.bookingInfo.timeInfo,
			creator_id: JSON.parse(this.bookingInfo.creator).id,
			creator_name: JSON.parse(this.bookingInfo.creator).name,
			mobile: JSON.parse(this.bookingInfo.creator).mobile,
			child_name: JSON.parse(this.bookingInfo.child).childName,
			child_id: JSON.parse(this.bookingInfo.child).childId,
			remark: this.adminService.trim(this.bookingInfo.remark),
			booking_fee: this.bookingInfo.booking_fee.toString(),
			referee_id: this.bookingInfo.referee == '' ? null : JSON.parse(this.bookingInfo.referee).id,
			referee_name: this.bookingInfo.referee == '' ? null : JSON.parse(this.bookingInfo.referee).name,
			has_asq: this.bookingInfo.service_asq ? '1' : null,
		}
		this.adminService.bookingcreate(param).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
				this.canEdit = false;
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.successBookingId = results.bookingId;
				// this.loadingShow = false;
				// this.modalTabType = true;
				this.bookingIn(results.bookingId);
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
			this.canEdit = false;
        });
	}

	// 继续预约
	closeType() {
		this.router.navigate(['./admin/repage'], {queryParams: {from: 'bookingIn'}});
	}

	// 去支付
	confirmType() {
		this.router.navigate(['./admin/paymentBookingFee'], {queryParams: {id: this.successBookingId, type: 'bookingIn'}});
	}

	updateBooking() {
		var updateParam = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			type: this.bookingInfo.type,
			clinic_id: this.adminService.getUser().clinicId,
			service_id: JSON.parse(this.bookingInfo.service).serviceId,
			user_doctor_id: JSON.parse(this.bookingInfo.user_doctor).doctorId,
			user_doctor_name: JSON.parse(this.bookingInfo.user_doctor).doctorName,
			booking_date: JSON.parse(this.bookingInfo.booking_date).dutyDate,
			time: this.bookingInfo.timeInfo,
			remark: this.adminService.trim(this.bookingInfo.remark),
		}
		this.adminService.updatebooking(this.booking.bookingId, updateParam).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
				this.canEdit = false;
			}else{
				this.bookingIn(this.booking.bookingId);
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
			this.canEdit = false;
        });
	}

	bookingIn(bookingId) {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			status: 3,
		}
		this.adminService.updatebookstatus(bookingId ,params).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
				this.canEdit = false;
			}else{
				this.loadingShow = false;
				this._message.success('登记成功');
				this.getBooking();
				//登记成功后，清空选中预约信息
				this.initData();
				this.canEdit = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
			this.canEdit = false;
        });
	}
}
