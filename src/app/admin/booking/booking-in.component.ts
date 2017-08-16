import { Component, OnInit }                  from '@angular/core';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'app-booking-in',
	templateUrl: './booking-in.component.html'
})
export class BookingInComponent{
	bookinglist: any[];
	booking: {
		age: string;
		bookingDate: string;
		bookingId: string;
		childId: string;
		childName: string;
		creatorId: string;
		creatorName: string;
		refNo: string;
		serviceId: string;
		serviceName: string;
		time: string;
		type: string;
		typeText: string;
		userDoctorId: string;
		userDoctorName: string;
	};
	modalTab: boolean;
	buttonUse: boolean;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	
	constructor(public adminService: AdminService) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.buttonUse = false;

		this.modalTab = false;
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
			typeText: '',
			userDoctorId: '',
			userDoctorName: '',
		};

		this.getBooking();
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

	todayBooking() {
		this.modalTab = true;
	}

	close() {
		this.modalTab = false;
	}

	show(booking) {
		this.booking = booking;
		this.booking.typeText = this.booking.type == 'PT' ? '普通号' : '专家号';
		this.modalTab = false;
		this.buttonUse = true;
	}

	//登记
	bookingIn() {
		if(this.booking.refNo && this.booking.refNo != ''){
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
					this.buttonUse = false;
					this.getBooking();
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