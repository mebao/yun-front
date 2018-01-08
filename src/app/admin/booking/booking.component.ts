import { Component, OnInit }                        from '@angular/core';
import { ActivatedRoute, Params, Router }           from '@angular/router';
import { Location }                                 from '@angular/common';

import { AdminService }                             from '../admin.service';

@Component({
	selector: 'app-create-booking',
	templateUrl : './booking.component.html',
	styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
	moduleAuthority: {
		// 用户管理
		see: boolean,
	}
	id: number;
	bookingInfo: {
		type: string,
		service: string,
		service_name: string,
		service_fee: string,
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
		status: string,
		referee: string,
	};
	booking: {
		age: string;
		bookingDate: string;
		bookingId: string;
		childId: string;
		childName: string;
		creatorId: string;
		creatorName: string;
		refNo: string;
		fees: any[];
		services: any[];
		time: string;
		type: string;
		userDoctorId: string;
		userDoctorName: string;
		mobile: string;
		remark: string,
		status: string,
		refereeId: string,
	};
	users: [{}];
	servicelist: [{}];
	doctorlist: [{}];
	showChildTab: boolean = false;
	childs: [{}];
	doctorDutys: any[];
	timelist: any[];
	editType: string;
	ptDutys: any[];
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	selectSearchTitle: string;
	selectSearchValue: string;
	childlist: any[];
	//从病人库直接预约
	listChild: {
		childId: string,
		childName: string,
	};
	// 已选中一些预约信息
	urlSelected: {
		serviceId: string,
		doctorId: string,
		date: string,
	}
	// 初始化字段，只有首次进入，方才有复制，
	initPage: {
		doctor: boolean,
		date: boolean,
		time: boolean,
	}
	// 不可连续点击
	canEdit: boolean;
	hasBookingList: any[];
	modalTabAgain: boolean;
	modalTabType: boolean;
	// 预约成功后的id
	successBookingId: string;
	// 显示加载中
	loadingShow: boolean;
	// 推荐人列表
	adminList: any[];

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '预约',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		// 获取用户是否含有用户管理权限
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
						// 查询用户管理下是否含有用户管理权限
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

		this.bookingInfo = {
			type: 'ZJ',
			service: '',
			service_name: '',
			service_fee: '',
			booking_date: '',
			bookingDate: '',
			timeInfo: '',
			user_doctor: '',
			creator: '',
			child: '',
			child_name: '',
			gender: '',
			birth_date: '',
			remark: '',
			booking_fee: '',
			status: '',
			referee: '',
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
			fees: [],
			services: [],
			time: '',
			type: '',
			userDoctorId: '',
			userDoctorName: '',
			mobile: '',
			remark: '',
			status: '',
			refereeId: '',
		};

		this.selectSearchTitle = '请选择宝宝';
		this.selectSearchValue = '';

		this.listChild = {
			childId: '',
			childName: '',
		}
		this.urlSelected = {
			serviceId: '',
			doctorId: '',
			date: '',
		}
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

		//修改
		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
			this.listChild = {
				childId: params.childId,
				childName: sessionStorage.getItem('childList-childName'),
			}
			this.urlSelected = {
				serviceId: params.serviceId,
				doctorId: params.doctorId,
				date: params.date,
			}
		});
		if(this.id){
			//修改
			this.editType = 'update';
			var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId
				 + '&id=' + this.id;
			this.adminService.searchbooking(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.booking = results.weekbooks[0];
					this.booking.bookingDate = this.adminService.dateFormatHasWord(this.booking.bookingDate);
					//获取宝宝和家长信息
					this.bookingInfo.creator = JSON.stringify({
						id: this.booking.creatorId,
						name: this.booking.creatorName,
						mobile: this.booking.mobile,
					});
					this.bookingInfo.child = JSON.stringify({
						childName: this.booking.childName,
						childId: this.booking.childId,
					});
					this.bookingInfo.child_name = this.booking.childName;
					this.bookingInfo.remark = this.booking.remark;
					this.bookingInfo.status = this.booking.status;
					if(this.booking.fees.length > 0){
						for(var i = 0; i < this.booking.fees.length; i++){
							if(this.booking.fees[i].type == 'booking'){
								this.bookingInfo.booking_fee = this.booking.fees[i].fee;
							}
						}
					}

					this.getData();
					//类型普通
					// if(this.bookingInfo.type == 'PT'){
					// 	this.typeChange('PT');
					// 	for(var i = 0; i < this.doctorDutys.length; i++){
					// 		if(this.booking.bookingDate == this.doctorDutys[i].dutyDate){
					// 			this.bookingInfo.booking_date = this.doctorDutys[i].string;
					// 			this.dateChange();
					// 		}
					// 	}
					// }
				}
			})
		}else{
			//创建
			//从病人库直接预约
			if(this.listChild.childId){
				this.bookingInfo.child = JSON.stringify(this.listChild);
				this.bookingInfo.child_name = this.listChild.childName;
				//获取家长信息
				this.onVoted(this.bookingInfo.child);
			}
			this.editType = 'create';
			this.getData();
		}

		this.initPage = {
			doctor: true,
			date: true,
			time: true,
		}

		this.hasBookingList = [];
		this.modalTabAgain = false;
		this.successBookingId = '';

		this.canEdit = false;
		this.modalTabType = false;
		this.loadingShow = false;
	}

	// 添加宝宝
	addChild() {
		this.router.navigate(['./admin/userList']);
	}

	getData() {
		// 获取推荐人信息
		var adminlistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					for(var key in results.adminlist){
						results.adminlist[key].string = JSON.stringify({
							id: results.adminlist[key].id,
							name: results.adminlist[key].realName,
						});
						if(this.booking.refereeId == results.adminlist[key].id){
							this.bookingInfo.referee = results.adminlist[key].string;
						}
					}
				}
				this.adminList = results.adminlist;
			}
		});
		
		//查询诊所科室
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].string = JSON.stringify(results.servicelist[i]);
						//修改
						if(this.editType == 'update' && this.booking.services[0].serviceId == results.servicelist[i].serviceId){
							this.bookingInfo.service = results.servicelist[i].string;
							if(this.bookingInfo.type == 'ZJ'){
								this.serviceChange(this.bookingInfo.service);
							}
						}
						// 预约时，已选定科室
						if(this.editType == 'create' && this.urlSelected.serviceId && this.urlSelected.serviceId != ''){
							if(this.urlSelected.serviceId == results.servicelist[i].serviceId){
								this.bookingInfo.service = results.servicelist[i].string;
								if(this.bookingInfo.type == 'ZJ'){
									this.serviceChange(this.bookingInfo.service);
								}
							}
						}
					}
				}
				this.servicelist = results.servicelist;
			}
		})

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
					results.child[i].value = results.child[i].childName + '(' + results.child[i].mobile + ')';
				}
				this.childlist = results.child;
			}
		});

		//普通预约dutys
		var dutys = [];
		var weekArray = this.adminService.getWeekByNumber(0);
		var todayTime = new Date().getTime() - 24*60*60*1000;
		for(var i = 0; i < weekArray.length; i++){
			var day = {
				dutyDate: weekArray[i],
				selectedList: [],
				string: '',
				timeList: [
					'08:00',
					'08:30',
					'09:00',
					'09:30',
					'10:00',
					'10:30',
					'11:00',
					'11:30',
					'12:00',
					'12:30',
					'13:00',
					'13:30',
					'14:00',
					'14:30',
					'15:00',
					'15:30',
					'16:00',
					'16:30',
					'17:00',
					'17:30',
				],
				weekDay: this.adminService.getWeekTitle(i),
				use: new Date(weekArray[i]).getTime() > todayTime ? true : false,
			}
			day.string = JSON.stringify(day);
			dutys.push(day);
		}
		this.ptDutys = dutys;
	}

	//切换预约类型
	// typeChange(type) {
	// 	if(type == 'PT'){
	// 		this.doctorDutys = this.ptDutys;
	// 	}else{
	// 		this.doctorDutys = [];
	// 		this.timelist = [];
	// 	}
	// }

	//切换科室
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
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.doctors.length > 0){
					for(var i = 0; i < results.doctors.length; i++){
						results.doctors[i].string = JSON.stringify(results.doctors[i]);
						// 是否首次进入
						if(this.initPage.doctor){
							//修改
							if(this.editType == 'update' && results.doctors[i].doctorId == this.booking.services[0].userDoctorId){
								this.bookingInfo.user_doctor = results.doctors[i].string;
								this.doctorChange('');
							}
							// 预约时，已选定医生
							if(this.editType == 'create' && this.urlSelected.doctorId && this.urlSelected.doctorId != ''){
								if(results.doctors[i].doctorId == this.urlSelected.doctorId){
									this.bookingInfo.user_doctor = results.doctors[i].string;
									this.doctorChange('changeBookingFee');
								}
							}
						}
					}
				}
				if(!this.initPage.doctor){
					this.bookingInfo.user_doctor = '';
					this.bookingInfo.booking_fee = '';
					this.bookingInfo.booking_date = '';
					this.timelist = [];
					this.bookingInfo.timeInfo = '';
				}
				this.initPage.doctor = false;
				this.doctorlist = results.doctors;
			}
		})
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
				// 是否首次进入
				if(this.initPage.date){
					//修改
					if(this.editType == 'update' && this.adminService.dateFormatHasWord(doctor.doctorDutys[i].dutyDate) == this.booking.bookingDate){
						this.bookingInfo.booking_date = doctor.doctorDutys[i].string;
						this.dateChange();
					}
					// 预约时，已选定医生
					if(this.editType == 'create' && this.urlSelected.date && this.urlSelected.date != ''){
						if(doctor.doctorDutys[i].dutyDate == this.urlSelected.date){
							this.bookingInfo.booking_date = doctor.doctorDutys[i].string;
							this.dateChange();
						}
					}
				}
			}
		}
		if(!this.initPage.date){
			this.bookingInfo.booking_date = '';
			this.timelist = [];
			this.bookingInfo.timeInfo = '';
		}
		this.initPage.date = false;
		this.doctorDutys = doctor.doctorDutys;
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
			if(this.adminService.getDayByDate(new Date) == date.dutyDate){
				var timeNum = Number(this.timelist[i].value.replace(':', ''));
				if(timeNum < todayTimeNum){
					this.timelist[i].type = 'overdue';
				}
			}
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
			if(this.editType == 'update'){
				//修改
				this.bookingInfo.timeInfo = this.booking.time;
			}
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
	onVoted(_value) {
		this.bookingInfo.child = _value;
		//根据宝宝信息查询家长信息
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&child_id=' + JSON.parse(_value).childId;
		this.adminService.searchuser(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				// for(var i =0; i < results.users.length; i++){
				// 	results.users[i].string = JSON.stringify(results.users[i]);
				// 	results.users[i].key = JSON.stringify(results.users[i]);
				// 	results.users[i].value = results.users[i].name;
				// 	if(this.editType == 'update' && results.users[i].id == this.booking.creatorId){
				// 		//修改
				// 		this.bookingInfo.creator = results.users[i].string;
				// 		this.creatorChange(this.bookingInfo.creator);
				// 	}
				// }
				if(results.users.length > 0){
					this.bookingInfo.creator = JSON.stringify(results.users[0]);
				}
			}
		});

	}
	// creatorChange(value) {
	// 	var creator = JSON.parse(value);
	// 	this.showChildTab = true;
	// 	if(creator.childs.length > 0){
	// 		for(var i = 0; i < creator.childs.length; i++){
	// 			creator.childs[i].string = JSON.stringify(creator.childs[i]);
	// 			if(this.editType == 'update' && creator.childs[i].childId == this.booking.childId){
	// 				//修改
	// 				this.bookingInfo.child = creator.childs[i].string;
	// 			}
	// 		}
	// 	}
	// 	this.childs = creator.childs;
	// }

	create(): void{
		this.canEdit = true;
		// if(f.value.type == ''){
		// 	this.toastTab('预约类型不可为空', 'error');
		// 	return;
		// }
		if(this.bookingInfo.creator == ''){
			this.toastTab('预约用户不可为空', 'error');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.child == ''){
			this.toastTab('宝宝不可为空', 'error');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.service == ''){
			this.toastTab('科室不可为空', 'error');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.type == 'ZJ' && this.bookingInfo.user_doctor == ''){
			this.toastTab('预约医生不可为空', 'error');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.booking_date == ''){
			this.toastTab('预约日期不可为空', 'error');
			this.canEdit = false;
			return;
		}
		if(this.bookingInfo.timeInfo == ''){
			this.toastTab('预约时间段不可为空', 'error');
			this.canEdit = false;
			return;
		}
		// if(this.childs.length == 0 && f.value.child_name == ''){
		// 	this.toastTab('宝宝姓名不可为空', 'error');
		// 	return;
		// }
		// if(this.childs.length == 0 && f.value.gender == ''){
		// 	this.toastTab('性别不可为空', 'error');
		// 	return;
		// }
		// if(this.childs.length == 0 && f.value.birth_date == ''){
		// 	this.toastTab('出生年月不可为空', 'error');
		// 	return;
		// }
		if(this.editType == 'create' || this.bookingInfo.status == '1'){
			if(this.adminService.isFalse(this.bookingInfo.booking_fee)){
				this.toastTab('预约金不可为空', 'error');
				this.canEdit = false;
				return;
			}
			if(parseFloat(this.bookingInfo.booking_fee) < 0 || parseFloat(this.bookingInfo.booking_fee) > parseFloat(JSON.parse(this.bookingInfo.user_doctor).fee)){
				this.toastTab('预约金应大于等于0，小于科室费', 'error');
				this.canEdit = false;
				return;
			}
			this.loadingShow = true;
			if(this.editType == 'create'){
				// 创建预约时，验证该患者是否已经预约
				var todayDate = this.adminService.getDayByDate(new Date());
				var url = '?username=' + this.adminService.getUser().username
					 + '&token=' + this.adminService.getUser().token
					 + '&clinic_id=' + this.adminService.getUser().clinicId
					 + '&child_id=' + JSON.parse(this.bookingInfo.child).childId
					 + '&creator_id=' + JSON.parse(this.bookingInfo.creator).id
					 + '&booking_date=' + todayDate;
				this.adminService.checkbooking(url).then((data) => {
					if(data.status == 'no'){
						this.loadingShow = false;
						this.toastTab(data.errorMsg, 'error');
						this.canEdit = false;
					}else{
						var results = JSON.parse(JSON.stringify(data.results));
						if(results.id != ''){
							this.loadingShow = false;
							this.modalTabAgain = true;
						}else{
							this.confirmBooking();
						}
					}
				});
			}else{
				this.confirmBooking();
			}
		}else{
			this.loadingShow = true;
			this.confirmBooking();
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

	confirmBooking() {
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			type: this.bookingInfo.type,
			clinic_id: this.adminService.getUser().clinicId,
			service_id: JSON.parse(this.bookingInfo.service).serviceId,
			user_doctor_id: this.bookingInfo.type == 'PT' ? null : JSON.parse(this.bookingInfo.user_doctor).doctorId,
			user_doctor_name: this.bookingInfo.type == 'PT' ? null : (this.editType == 'update' ? null : JSON.parse(this.bookingInfo.user_doctor).doctorName),
			booking_date: JSON.parse(this.bookingInfo.booking_date).dutyDate,
			time: this.bookingInfo.timeInfo,
			creator_id: JSON.parse(this.bookingInfo.creator).id,
			creator_name: JSON.parse(this.bookingInfo.creator).name,
			mobile: JSON.parse(this.bookingInfo.creator).mobile,
			child_name: JSON.parse(this.bookingInfo.child).childName,
			child_id: JSON.parse(this.bookingInfo.child).childId,
			// age: this.editType == 'update' ? JSON.parse(this.bookingInfo.child).age : (this.childs.length == 0 ? null : JSON.parse(f.value.child).age),
			// gender: this.childs.length == 0 ? f.value.gender : null,
			// birth_date: this.childs.length == 0 ? f.value.birth_date : null,
			remark: this.adminService.trim(this.bookingInfo.remark),
			booking_fee: (this.editType == 'create' || this.bookingInfo.status == '1') ? this.bookingInfo.booking_fee.toString() : null,
			referee_id: this.bookingInfo.referee == '' ? null : JSON.parse(this.bookingInfo.referee).id,
			referee_name: this.bookingInfo.referee == '' ? null : JSON.parse(this.bookingInfo.referee).name,
		}
		if(this.editType == 'update'){
			this.adminService.updatebooking(this.id, param).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this.toastTab(data.errorMsg, 'error');
					this.canEdit = false;
				}else{
					this.loadingShow = false;
					this.toastTab('修改成功', '');
					setTimeout(() => {
						this.location.back();
					}, 2000);
				}
			})
		}else{
			this.adminService.bookingcreate(param).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this.toastTab(data.errorMsg, 'error');
					this.canEdit = false;
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.successBookingId = results.bookingId;
					this.loadingShow = false;
					this.modalTabType = true;
				}
			})
		}
	}

	// 预约成功后，继续预约
	closeType() {
		this.route.queryParams.subscribe((params) => {
			var paramObj = {
				type: params.type,
				// id: params.id,
				// childId: params.childId,
				// serviceId: params.serviceId,
				// doctorId: params.doctorId,
				// date: params.date,
				from: 'booking',
			}
			this.router.navigate(['./admin/repage'], {queryParams: paramObj});
		});
	}

	confirmType() {
		this.router.navigate(['./admin/paymentBookingFee'], {queryParams: {id: this.successBookingId, type: 'booking'}});
	}

	cancalUpdate() {
		this.router.navigate(['./admin/bookingList']);
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
