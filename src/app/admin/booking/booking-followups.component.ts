import { Component, OnInit }                   from '@angular/core';
import { Router, ActivatedRoute }              from '@angular/router';

import { AdminService }                        from '../admin.service';
import { ToastService }                        from '../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }              from '../../common/nll-toast/toast-model';

@Component({
	selector: 'admin-booking-followups',
	templateUrl: './booking-followups.component.html',
})
export class BookingFollowupsComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	bookingId: string;
	doctorId: string;
	childId: string;
	editType: string;
	followupsId: string;
	from: string;
	info: {
		child: string,
		up_user: string,
		time: string,
		timeText: string,
		timeNum: number,
		account: string,
		remarks: string,
		results: string,
		finish: string,
		finishText: string,
		finishNum: number,
	};
	adminList: any[];
	childList: any[];
	selectSearchTitle: string;
	selectUser: string;
	// 不可连续点击
	btnCanEdit: boolean;
	actualOperator: {
		use: boolean,
		name: string,
	}

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
		private toastService: ToastService,
	) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.bookingId = params.id;
			this.doctorId = params.doctorId;
			this.childId = params.childId;
			this.editType = params.type;
			this.followupsId = params.followupsId;
			this.from = params.from;
		});

		this.topBar = {
			title: this.editType == 'create' ? '新增随访' : '随访',
			back: true,
		}

		var todayDate = this.adminService.getDayByDate(new Date());
		if(this.editType == 'create'){
			this.info = {
				child: '',
				up_user: '',
				time: '',
				timeText: '请选择随访日期',
				timeNum: new Date(todayDate).getTime(),
				account: '',
				remarks: '',
				results: '',
				finish: '',
				finishText: '',
				finishNum: 0,
			}
		}else{
			var followups = JSON.parse(sessionStorage.getItem('followups'));
			this.info = {
				child: '',
				up_user: followups.upUserName,
				time: followups.time,
				timeText: this.adminService.dateFormat(followups.time),
				timeNum: new Date().getTime(),
				account: followups.account,
				remarks: followups.remarks,
				results: followups.results,
				finish: followups.finish ? followups.finish : todayDate,
				finishText: followups.finish ? this.adminService.dateFormat(followups.finish) : this.adminService.dateFormat(todayDate),
				finishNum: new Date(todayDate).getTime(),
			}
		}

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '新心',
			name: sessionStorage.getItem('actualOperator'),
		}

		this.adminList = [];
		this.selectSearchTitle = '请选择随访人员';
		this.selectUser = '';

		//查询随访列列表
		// var urlOptions = '?username=' + this.adminService.getUser().username
		// 	 + '&token=' + this.adminService.getUser().token
		// 	 + '&clinic_id=' + this.adminService.getUser().clinicId;
		// this.adminService.adminlist(urlOptions).then((data) => {
		// 	if(data.status == 'no'){
		// 		const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
		// 		this.toastService.toast(toastCfg);
		// 	}else{
		// 		var results = JSON.parse(JSON.stringify(data.results));
		// 		if(results.adminlist.length > 0){
		// 			for(var i = 0; i < results.adminlist.length; i++){
		// 				results.adminlist[i].string = JSON.stringify(results.adminlist[i]);
		// 				results.adminlist[i].key = JSON.stringify(results.adminlist[i]);
		// 				results.adminlist[i].value = results.adminlist[i].realName;
		// 			}
		// 		}
		// 		this.adminList = results.adminlist;
		// 	}
		// });

		// 获取小孩列表
		this.childList = [];
		if(this.from == 'bookingFollowupsList'){
			var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
			this.adminService.searchchild(urlOptions).then((data) => {
				if(data.status == 'no'){
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.child.length > 0){
						for(var i = 0; i < results.child.length; i++){
							results.child[i].key = JSON.stringify({
								childId: results.child[i].childId,
								childName: results.child[i].childName,
							});
							results.child[i].value = results.child[i].childName;
						}
					}
					this.childList = results.child;
				}
			});
		}

		this.btnCanEdit = false;
	}

	onVoted(_value) {
		this.selectUser = _value;
	}

	getChild(_value) {
		this.info.child = _value;
	}

	// 选择日期
	changeDate(_value, type){
		this.info[type] = JSON.parse(_value).value;
	}

	create(f) {
		if(this.from == 'docbooking' && this.actualOperator.use && this.adminService.isFalse(this.actualOperator.name)){
			const toastCfg = new ToastConfig(ToastType.ERROR, '', '请先选择实际操作人', 3000);
			this.toastService.toast(toastCfg);
			return;
		}
		this.btnCanEdit = true;
		f.value.account = this.adminService.trim(f.value.account);
		f.value.remarks = this.adminService.trim(f.value.remarks);
		f.value.results = this.adminService.trim(f.value.results);
		if(this.editType == 'create'){
			// if(this.selectUser == ''){
			//  const toastCfg = new ToastConfig(ToastType.ERROR, '', '随访人员不可为空', 3000);
			//  this.toastService.toast(toastCfg);
			// 	return;
			// }
			if(this.from == 'bookingFollowupsList' && this.info.child == ''){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '随访宝宝不可为空', 3000);
				this.toastService.toast(toastCfg);
				this.btnCanEdit = false;
				return
			}
			if(this.info.time == ''){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '随访日期不可为空', 3000);
				this.toastService.toast(toastCfg);
				this.btnCanEdit = false;
				return;
			}
			if(this.adminService.isFalse(this.info.account)){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '随访内容和原因不可为空', 3000);
				this.toastService.toast(toastCfg);
				this.btnCanEdit = false;
				return;
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				booking_id: this.bookingId,
				// up_user_id: JSON.parse(this.selectUser).id,
				// up_user_name: JSON.parse(this.selectUser).realName,
				time: this.info.time,
				account: f.value.account,
				remarks: f.value.remarks,
				child_id: this.from == 'bookingFollowupsList' ? JSON.parse(this.info.child).childId : this.childId,
			}
			this.adminService.userfollowup(params).then((data) => {
				if(data.status == 'no'){
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
					this.btnCanEdit = false;
				}else{
					const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '随访创建成功', 3000);
					this.toastService.toast(toastCfg);
					setTimeout(() => {
						if(this.from == 'bookingFollowupsList'){
							this.router.navigate(['./admin/bookingFollowupsList']);
						}else{
							this.router.navigate(['./admin/docbooking'], {queryParams: {id: this.bookingId, doctorId: this.doctorId}});
						}
					}, 2000);
				}
			});
		}else{
			if(this.adminService.isFalse(this.info.account)){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '随访内容和原因不可为空', 3000);
				this.toastService.toast(toastCfg);
				this.btnCanEdit = false;
				return;
			}
			if(this.adminService.isFalse(this.info.results)){
				const toastCfg = new ToastConfig(ToastType.ERROR, '', '随访结果不可为空', 3000);
				this.toastService.toast(toastCfg);
				this.btnCanEdit = false;
				return;
			}
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				id: this.followupsId,
				results: f.value.results,
				finish: this.info.finish,
			}
			this.adminService.followupresult(this.followupsId, updateParams).then((data) => {
				if(data.status == 'no'){
					const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
					this.toastService.toast(toastCfg);
					this.btnCanEdit = false;
				}else{
					const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '随访修改成功', 3000);
					this.toastService.toast(toastCfg);
					setTimeout(() => {
						this.router.navigate(['./admin/bookingFollowupsList']);
					}, 2000);
				}
			});
		}
	}
}
