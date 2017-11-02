import { Component, OnInit }                   from '@angular/core';
import { Router, ActivatedRoute }              from '@angular/router';

import { AdminService }                        from '../admin.service';

@Component({
	selector: 'admin-booking-followups',
	templateUrl: './booking-followups.component.html',
})
export class BookingFollowupsComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type: string,
	};
	bookingId: string;
	doctorId: string;
	childId: string;
	editType: string;
	followupsId: string;
	info: {
		up_user: string,
		time: string,
		account: string,
		remarks: string,
		results: string,
	};
	adminList: any[];
	selectSearchTitle: string;
	selectUser: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '新增随访',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.route.queryParams.subscribe((params) => {
			this.bookingId = params.id;
			this.doctorId = params.doctorId;
			this.childId = params.childId;
			this.editType = params.type;
			this.followupsId = params.followupsId;
		});

		if(this.editType == 'create'){
			this.info = {
				up_user: '',
				time: '',
				account: '',
				remarks: '',
				results: '',
			}
		}else{
			var followups = JSON.parse(sessionStorage.getItem('followups'));
			this.info = {
				up_user: followups.upUserName,
				time: followups.time,
				account: followups.account,
				remarks: followups.remarks,
				results: followups.results,
			}
		}


		this.adminList = [];
		this.selectSearchTitle = '请选择随访人员';
		this.selectUser = '';

		//查询随访列列表
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.adminlist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					for(var i = 0; i < results.adminlist.length; i++){
						results.adminlist[i].string = JSON.stringify(results.adminlist[i]);
						results.adminlist[i].key = JSON.stringify(results.adminlist[i]);
						results.adminlist[i].value = results.adminlist[i].realName;
					}
				}
				this.adminList = results.adminlist;
			}
		});
	}

	onVoted(_value) {
		this.selectUser = _value;
	}

	create(f) {
		if(this.editType == 'create'){
			// if(this.selectUser == ''){
			// 	this.toastTab('随访人员不可为空', 'error');
			// 	return;
			// }
			if(f.value.time == ''){
				this.toastTab('随访日期不可为空', 'error');
				return;
			}
			if(f.value.account == ''){
				this.toastTab('随访内容和原因不可为空', 'error');
				return;
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				booking_id: this.bookingId,
				// up_user_id: JSON.parse(this.selectUser).id,
				// up_user_name: JSON.parse(this.selectUser).realName,
				time: f.value.time,
				account: f.value.account,
				remarks: f.value.remarks,
				child_id: this.childId,
			}
			this.adminService.userfollowup(params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('随访创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.bookingId, doctorId: this.doctorId}});
					}, 2000);
				}
			});
		}else{
			if(f.value.results == ''){
				this.toastTab('随访结果不可为空', 'error');
				return;
			}
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				id: this.followupsId,
				results: f.value.results,
			}
			this.adminService.followupresult(this.followupsId, updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('随访修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/bookingFollowupsList']);
					}, 2000);
				}
			});
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
