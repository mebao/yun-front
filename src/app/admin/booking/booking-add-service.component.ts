import { Component, OnInit }                      from '@angular/core';
import { ActivatedRoute, Router }                 from '@angular/router';

import { AdminService }                           from '../admin.service';

@Component({
	selector: 'app-booking-add-service',
	templateUrl: './booking-add-service.component.html'
})
export class BookingAddServiceComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	doctorId: string;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	bookingInfo: {
		booking_id: string,
		service: string,
		user_doctor: string,
		service_date: string,
		fee: string,
		time: string,
	}
	servicelist: any[];
	doctorlist: any[];
	doctorDutys: any[];
	timelist: any[];

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '追加服务',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.bookingInfo = {
			booking_id: '',
			service: '',
			user_doctor: '',
			service_date: '',
			fee: '',
			time: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.bookingInfo.booking_id = params['id'];
			this.doctorId = params['doctorId'];
		});

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

	//切换服务
	serviceChange() {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&service_id=' + JSON.parse(this.bookingInfo.service).serviceId;
		//根据服务查询医生可预约日期
		this.adminService.searchdoctorservice(urlOptions).then((data) =>　{
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.doctors.length > 0){
					for(var i = 0; i < results.doctors.length; i++){
						results.doctors[i].string = JSON.stringify(results.doctors[i]);
					}
				}
				this.doctorlist = results.doctors;
			}
		})
	}

	//切换医生
	doctorChange() {
		var doctor = JSON.parse(this.bookingInfo.user_doctor);
		this.bookingInfo.fee = doctor.fee;
		if(doctor.doctorDutys.length > 0){
			for(var i = 0; i < doctor.doctorDutys.length; i++){
				doctor.doctorDutys[i].string = JSON.stringify(doctor.doctorDutys[i]);
			}
		}
		this.doctorDutys = doctor.doctorDutys;
	}

	//切换日期
	dateChange() {
		var date = JSON.parse(this.bookingInfo.service_date);
		var list = [];
		if(date.timeList.length > 0){
			for(var i = 0; i < date.timeList.length; i++){
				var time = date.timeList[i];
				var use = true;
				//判断时间段是否已经被预约
				if(date.selectedList.length > 0){
					for(var j = 0; j < date.selectedList.length; j++){
						if(date.selectedList[j] == time){
							use = false;
						}
					}
				}
				var timeJson = {key: i, value: date.timeList[i], use: use};
				list.push(timeJson);
			}
		}
		this.timelist = list;
	}

	create(f) {
		if(f.value.service == ''){
			this.toastTab('追加服务不可为空', 'error');
			return;
		}
		if(f.value.user_doctor == ''){
			this.toastTab('预约医生不可为空', 'error');
			return;
		}
		if(f.value.fee == ''){
			this.toastTab('费用不可为空', 'error');
			return;
		}
		if(f.value.service_date == ''){
			this.toastTab('服务日期不可为空', 'error');
			return;
		}
		if(f.value.time == ''){
			this.toastTab('服务时间不可为空', 'error');
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			booking_id: this.bookingInfo.booking_id,
			user_doctor_id: JSON.parse(f.value.user_doctor).doctorId,
			user_doctor_name: JSON.parse(f.value.user_doctor).doctorName,
			service_id: JSON.parse(f.value.service).serviceId,
			service_name: JSON.parse(f.value.service).serviceName,
			fee: f.value.fee,
			service_date: JSON.parse(f.value.service_date).dutyDate,
			time: f.value.time,
		}
		this.adminService.addservice(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('追加服务成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.bookingInfo.booking_id, doctorId: this.doctorId}});
				}, 2000);
			}
		})
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