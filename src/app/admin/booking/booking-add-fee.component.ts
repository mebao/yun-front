import { Component, OnInit }                        from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router';

import { AdminService }                             from '../admin.service';

@Component({
	selector: 'app-booking-add-fee',
	templateUrl: 'booking-add-fee.component.html'
})
export class BookingAddFeeComponent{
	toast: {
		show: number,
		text: string,
		type: string,
	};
	bookingInfo: {
		booking_id: string,
		project_name: string,
		fee: string,
		remarks: string,
		feeId: string,
	};
	buttonText: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.bookingInfo = {
			booking_id: '',
			project_name: '',
			fee: '',
			remarks: '',
			feeId: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.bookingInfo.booking_id = params['id'];
			this.bookingInfo.feeId = params['feeId'];
		})

		if(this.bookingInfo.feeId){
			this.buttonText = '修改';
			var fee = JSON.parse(sessionStorage.getItem('fee'));
			this.bookingInfo.project_name = fee.projectName;
			this.bookingInfo.fee = fee.fee;
			this.bookingInfo.remarks = fee.remark;
		}else{
			this.buttonText = '提交';
		}
	}

	create(f) {
		if(f.value.project_name == ''){
			this.toastTab('消费项目名不可为空', 'error');
			return;
		}
		if(f.value.fee == ''){
			this.toastTab('费用不可为空', 'error');
			return;
		}
		if(f.value.remarks == ''){
			this.toastTab('备注说明不可为空', 'error');
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			booking_id: this.bookingInfo.booking_id,
			project_name: f.value.project_name,
			fee: f.value.fee,
			remarks: f.value.remarks,
			id: this.bookingInfo.feeId ? this.bookingInfo.feeId : null,
		}
		this.adminService.addfee(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('费用添加成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: this.bookingInfo.booking_id}});
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