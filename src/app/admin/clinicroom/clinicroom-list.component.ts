import { Component, OnInit }                 from '@angular/core';
import { Router }                            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'app-clinicroom-list',
	templateUrl: './clinicroom-list.component.html',
	styleUrls: ['./clinicroom-list.component.scss'],
})
export class ClinicroomListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type: string,
	}
	hasData: boolean;
	conditions: any[];
	doctorlist: any[];
	bookinglist: any[];
	selectedBooking: string;
	modalConfirmTab: boolean;
	confirmText: string;
	conditionId: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '诊室列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
		this.hasData = false;

		this.conditions = [];
		this.modalConfirmTab = false;
		this.confirmText = '';
		this.conditionId = '';

		this.getList();
	}

	getList() {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.clinicconditions(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.conditions = results.conditions;
				this.getDoctorAndBooking(results.doctorList, results.childList);
				this.hasData = true;
			}
		})
	}

	getDoctorAndBooking(doctorList, childList) {
		//查询专家
		var adminlistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					for(var i = 0; i < results.adminlist.length; i++){
						var use = true;
						//判断医生是否在诊
						if(doctorList.length > 0){
							for(var doctorId in doctorList){
								if(results.adminlist[i].id == doctorList[doctorId]){
									use = false;
								}
							}
						}
						results.adminlist[i].use = use;
						results.adminlist[i].string = JSON.stringify(results.adminlist[i]);
					}
				}
				this.doctorlist = results.adminlist;
			}
		})

		//查询今日预约
		var todayDate = this.adminService.getDayByDate(new Date());
		var nextDate = this.adminService.getDayByDate(new Date(new Date().getTime() + 24*60*60*1000));
		var searchbookingUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
 			 + '&clinic_id=' + this.adminService.getUser().clinicId
 			 + '&bdate_big=' + todayDate + '&bdate_less=' + nextDate;
		this.adminService.searchbooking(searchbookingUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					for(var i = 0; i < results.weekbooks.length; i++){
						var use = true;
						//判断医生是否在诊
						if(childList.length > 0){
							for(var doctorId in childList){
								if(results.weekbooks[i].childId == childList[doctorId]){
									use = false;
								}
							}
						}
						results.weekbooks[i].use = use;
						results.weekbooks[i].string = JSON.stringify(results.weekbooks[i]);
					}
				}
				this.bookinglist = results.weekbooks;
			}
		})
		
	}

	goCreate() {
		this.router.navigate(['./admin/clinicroom']);
	}

	goRecords() {
		this.router.navigate(['./admin/clinicroomRecords']);
	}

	doctorChange(doctor, _id) {
		var doctorInfo = JSON.parse(doctor);
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			doctor_id: doctorInfo.id,
			doctor_name: doctorInfo.realName,
		}
		this.adminService.allotroomdoctor(_id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('诊室分配专家成功', '');
				this.getList();
			}
		})
	}

	bookingChange(booking, doctorId, _id) {
		this.selectedBooking = booking;
		this.conditionId = _id;
		var bookingInfo = JSON.parse(booking);
		if(bookingInfo.services[0].userDoctorId != doctorId){
			//判断不匹配医生是否有该服务项目，若没有，不允许分配
			//获取当前预约服务
			// var service = booking.services[0].serviceId;
			// var hasService = false;
			// for(var i = 0; i < this.doctorlist.length; i++){
			// 	if(doctorId == this.doctorlist[i].id && this.doctorlist[i].serviceList.length > 0){
			// 		for(var j = 0; j < this.doctorlist[i].serviceList.length; j++){
			// 			if(service == this.doctorlist[i].serviceList[j].serviceId){
			// 				hasService = true;
			// 			}
			// 		}
			// 	}
			// }
			// if(hasService){
				this.confirmText = '该诊室医生与预约医生不匹配，是否继续分配？';
			// }else{
			// 	this.toastTab('该诊室医生与预约医生不匹配，并且该医生不存在' + booking.services[0].serviceName + '服务，不可分配。', 'error');
			// 	return;
			// }
		}else{
			this.confirmText = '确认为该诊室分配该用户';
		}
		this.modalConfirmTab = true;
	}

	confirm() {
		this.modalConfirmTab = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			booking_id: JSON.parse(this.selectedBooking).bookingId,
			user_id: JSON.parse(this.selectedBooking).creatorId,
			user_name: JSON.parse(this.selectedBooking).creatorName,
			child_id: JSON.parse(this.selectedBooking).childId,
			child_name: JSON.parse(this.selectedBooking).childName,
		}
		this.adminService.updatecondition(this.conditionId, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('诊室分配用户成功', '');
				this.getList();
			}
		})
	}

	closeConfirm() {
		this.selectedBooking = '';
		this.modalConfirmTab = false;
	}

	updateStatus(_id) {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
		}
		this.adminService.updateconditionstatus(_id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('诊室已可用', '');
				this.getList();
			}
		})
	}

	removeroomdoctor(_id) {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			id: _id,
		}
		this.adminService.removeroomdoctor(_id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('该诊室专家已移除', '');
				this.getList();
			}
		})
	}

	updateClinicroom(_id) {
		this.router.navigate(['./admin/clinicroom'], {queryParams: {id: _id}});
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