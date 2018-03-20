import { Component, OnInit }                        from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router';

import { AdminService }                             from '../../admin.service';

@Component({
	selector: 'app-booking-add-fee',
	templateUrl: 'booking-add-fee.component.html'
})
export class BookingAddFeeComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	doctorId: string;
	toast: {
		show: number,
		text: string,
		type: string,
	};
	bookingInfo: {
		booking_id: string,
		project_name: string,
		price: string,
		num: string,
		fee: string,
		remarks: string,
		feeId: string,
	};
	editType: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '其它费用',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.bookingInfo = {
			booking_id: '',
			project_name: '',
			price: '',
			num: '',
			fee: '',
			remarks: '',
			feeId: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.bookingInfo.booking_id = params['id'];
			this.bookingInfo.feeId = params['feeId'];
			this.doctorId = params['doctorId'];
		})

		if(this.bookingInfo.feeId){
			this.editType = 'update';
			var fee = JSON.parse(sessionStorage.getItem('fee'));
			this.bookingInfo.project_name = fee.projectName;
			this.bookingInfo.price = fee.price;
			this.bookingInfo.num = fee.number;
			this.bookingInfo.fee = fee.fee;
			this.bookingInfo.remarks = fee.remark;
		}else{
			this.editType = 'create';
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
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			booking_id: this.bookingInfo.booking_id,
			project_name: this.bookingInfo.project_name,
			price: this.bookingInfo.price,
			num: this.bookingInfo.num,
			fee: this.bookingInfo.fee,
			remarks: f.value.remarks,
			id: this.bookingInfo.feeId ? this.bookingInfo.feeId : null,
		}
		this.adminService.addfee(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				if(this.editType == 'create'){
					this.toastTab('费用添加成功', '');
				}else{
					this.toastTab('费用修改成功', '');
				}
				setTimeout(() => {
					this.router.navigate(['./admin/docbooking'], {queryParams: {id: this.bookingInfo.booking_id, doctorId: this.doctorId}});
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
