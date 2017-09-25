import { Component, OnInit }                        from '@angular/core';
import { ActivatedRoute, Params, Router }           from '@angular/router';

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
	id: number;
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
	booking: {
		age: string;
		bookingDate: string;
		bookingId: string;
		childId: string;
		childName: string;
		creatorId: string;
		creatorName: string;
		refNo: string;
		services: any[];
		time: string;
		type: string;
		userDoctorId: string;
		userDoctorName: string;
		mobile: string;
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

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
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

		this.selectSearchTitle = '请选择小孩';

		this.listChild = {
			childId: '',
			childName: '',
		}
		this.urlSelected = {
			serviceId: '',
			doctorId: '',
			date: '',
		}
		this.timelist = [];

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
					//获取小孩和家长信息
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
						//修改
						if(this.editType == 'update' && this.booking.services[0].serviceId == results.servicelist[i].serviceId){
							this.bookingInfo.service = results.servicelist[i].string;
							if(this.bookingInfo.type == 'ZJ'){
								this.serviceChange(this.bookingInfo.service);
							}
						}
						// 预约时，已选定服务
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

		//查询小孩列表
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

	//切换服务
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
						//修改
						if(this.editType == 'update' && results.doctors[i].doctorId == this.booking.services[0].userDoctorId){
							this.bookingInfo.user_doctor = results.doctors[i].string;
							this.doctorChange();
						}
						// 预约时，已选定医生
						if(this.editType == 'create' && this.urlSelected.doctorId && this.urlSelected.doctorId != ''){
							if(results.doctors[i].doctorId == this.urlSelected.doctorId){
								this.bookingInfo.user_doctor = results.doctors[i].string;
								this.doctorChange();
							}
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
				//修改
				if(this.editType == 'update' && doctor.doctorDutys[i].dutyDate == this.booking.bookingDate){
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
		this.doctorDutys = doctor.doctorDutys;
	}

	//切换时间
	dateChange() {
		var date = JSON.parse(this.bookingInfo.booking_date);
		var list = [];
		var todayTimeNum = Number(new Date().getHours() + '' + new Date().getMinutes());
		if(date.timeList.length > 0){
			//给时间排序
			date.timeList.sort(function(a,b){return Number(a.replace(':', '')) - Number(b.replace(':', ''))});
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
		if(this.editType == 'update'){
			//修改
			this.bookingInfo.timeInfo = this.booking.time;
		}
	}

	// 选择时间
	selectTime(time) {
		if(time.use){
			this.bookingInfo.timeInfo = time.value;
		}
	}

	//切换小孩
	onVoted(_value) {
		this.bookingInfo.child = _value;
		//根据小孩信息查询家长信息
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

	create(f): void{
		// if(f.value.type == ''){
		// 	this.toastTab('预约类型不可为空', 'error');
		// 	return;
		// }
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
		if(this.bookingInfo.timeInfo == ''){
			this.toastTab('预约时间段不可为空', 'error');
			return;
		}
		if(this.bookingInfo.creator == ''){
			this.toastTab('预约用户不可为空', 'error');
			return;
		}
		if(this.bookingInfo.child == ''){
			this.toastTab('小孩不可为空', 'error');
			return;
		}
		// if(this.childs.length == 0 && f.value.child_name == ''){
		// 	this.toastTab('小孩姓名不可为空', 'error');
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
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			type: this.bookingInfo.type,
			clinic_id: this.adminService.getUser().clinicId,
			service_id: JSON.parse(f.value.service).serviceId,
			user_doctor_id: f.value.type == 'PT' ? null : JSON.parse(f.value.user_doctor).doctorId,
			user_doctor_name: f.value.type == 'PT' ? null : (this.editType == 'update' ? null : JSON.parse(f.value.user_doctor).doctorName),
			booking_date: JSON.parse(f.value.booking_date).dutyDate,
			time: this.bookingInfo.timeInfo,
			creator_id: JSON.parse(this.bookingInfo.creator).id,
			creator_name: JSON.parse(this.bookingInfo.creator).name,
			mobile: JSON.parse(this.bookingInfo.creator).mobile,
			child_name: JSON.parse(this.bookingInfo.child).childName,
			child_id: JSON.parse(this.bookingInfo.child).childId,
			// age: this.editType == 'update' ? JSON.parse(this.bookingInfo.child).age : (this.childs.length == 0 ? null : JSON.parse(f.value.child).age),
			// gender: this.childs.length == 0 ? f.value.gender : null,
			// birth_date: this.childs.length == 0 ? f.value.birth_date : null,
		}
		if(this.editType == 'update'){
			this.adminService.updatebooking(this.id, param).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/bookingList']);
					}, 2000);
				}
			})
		}else{
			this.adminService.bookingcreate(param).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('预约成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/bookingList']);
					}, 2000);
				}
			})
		}
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

interface Time{
	key: string;
	value: string;
	use: boolean;
}
