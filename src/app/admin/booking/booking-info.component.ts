import { Component, OnInit }                from '@angular/core';
import { Router, ActivatedRoute }           from '@angular/router';

import { AdminService }                     from '../admin.service';

@Component({
	selector: 'app-booking-info',
	templateUrl: './booking-info.component.html',
})
export class BookingInfoComponent{
	id: string;
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
	};
	canEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type:  '',
		};

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
		};

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
		})

		var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId
				 + '&id=' + this.id;
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
				this.booking.totalFee = total.toString();
			}
		})
	}

	updateFee(fee) {
		sessionStorage.setItem('fee', JSON.stringify(fee));
		this.router.navigate(['./admin/bookingAddFee'], {queryParams: {id: this.booking.bookingId, feeId: fee.feeId}});
	}

	updateBooking() {
		this.router.navigate(['./admin/booking'], {queryParams: {id: this.id}});
	}

	prescript() {
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id}});
	}


	//追加服务
	addService() {
		this.router.navigate(['./admin/bookingAddService'], {queryParams: {id: this.id}});
	}

	//追加费用
	addfee() {
		this.router.navigate(['./admin/bookingAddFee'], {queryParams: {id: this.id}});
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