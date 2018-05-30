import { Component, OnInit }                   from '@angular/core';
import { Router, ActivatedRoute }              from '@angular/router';

import { NzMessageService }                    from 'ng-zorro-antd';

import { AdminService }                        from '../../admin.service';

@Component({
	selector: 'admin-booking-followups',
	templateUrl: './booking-followups.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
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
		time: Date,
		account: string,
		remarks: string,
		results: string,
		finish: Date,
	};
	adminList: any[];
	childList: any[];
	// 不可连续点击
	btnCanEdit: boolean;
	actualOperator: {
		use: boolean,
		name: string,
	}

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
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

		if(this.editType == 'create'){
			this.info = {
				child: '',
				up_user: '',
				time: null,
				account: '',
				remarks: '',
				results: '',
				finish: null,
			}
		}else{
			var followups = JSON.parse(sessionStorage.getItem('followups'));
			this.info = {
				child: '',
				up_user: followups.upUserName,
				time: new Date(followups.time),
				account: followups.account,
				remarks: followups.remarks,
				results: followups.results,
				finish: followups.finish ? followups.finish : new Date,
			}
		}

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}

		this.adminList = [];

		// 获取小孩列表
		this.childList = [];
		if(this.from == 'bookingFollowupsList'){
			var urlOptions = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
			this.adminService.searchchild(urlOptions).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
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
			}).catch(() => {
				this._message.error('服务器错误');
            });
		}

		this.btnCanEdit = false;
	}

	_disabledEndTime = (endValue) => {
        if (!endValue || !new Date()) {
            return false;
        }
        return endValue.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
    };

	create() {
		if(this.from == 'docbooking' && this.actualOperator.use && this.adminService.isFalse(this.actualOperator.name)){
			this._message.error('请先选择实际操作人');
			return;
		}
		this.btnCanEdit = true;
		if(this.editType == 'create'){
			if(this.from == 'bookingFollowupsList' && this.info.child == ''){
				this._message.error('随访宝宝不可为空');
				this.btnCanEdit = false;
				return
			}
			if(!this.info.time){
				this._message.error('随访日期不可为空');
				this.btnCanEdit = false;
				return;
			}
			if(this.adminService.isFalse(this.info.account)){
				this._message.error('随访内容和原因不可为空');
				this.btnCanEdit = false;
				return;
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				booking_id: this.bookingId,
				time: this.adminService.getDayByDate(new Date(this.info.time)),
				account: this.info.account,
				remarks: this.info.remarks,
				child_id: this.from == 'bookingFollowupsList' ? this.info.child : this.childId,
			}
			this.adminService.userfollowup(params).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('随访创建成功');
					setTimeout(() => {
						if(this.from == 'bookingFollowupsList'){
							this.router.navigate(['./admin/bookingFollowups/list']);
						}else{
							this.router.navigate(['./admin/docbooking'], {queryParams: {id: this.bookingId, doctorId: this.doctorId}});
						}
					}, 2000);
				}
			}).catch(() => {
				this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}else{
			if(this.adminService.isFalse(this.info.account)){
				this._message.error('随访内容和原因不可为空');
				this.btnCanEdit = false;
				return;
			}
			if(this.adminService.isFalse(this.info.results)){
				this._message.error('随访结果不可为空');
				this.btnCanEdit = false;
				return;
			}
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				id: this.followupsId,
				results: this.info.results,
				finish: this.adminService.getDayByDate(new Date(this.info.finish)),
			}
			this.adminService.followupresult(this.followupsId, updateParams).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					this._message.success('随访修改成功');
					setTimeout(() => {
						this.router.navigate(['./admin/bookingFollowups/list']);
					}, 2000);
				}
			}).catch(() => {
				this._message.error('服务器错误');
				this.btnCanEdit = false;
            });
		}
	}
}
