import { Component }                          from '@angular/core';
import { Router }                             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../../admin.service';

@Component({
	selector: 'admin-booking-receive',
	templateUrl: './booking-receive.component.html',
	styleUrls: ['./booking-receive.component.scss', '../../../../assets/css/ant-common.scss'],
})
export class BookingReceiveComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		receive: boolean,
		receiveAll: boolean,
	}
	loadingShow: boolean;
	url: string;
	doctorlist: any[];
	servicelist: [{}];
	searchInfo: {
		doctor_id: string;
		service_id: string;
		mobile: string,
		creator_name: string,
		child_name: string,
	}
	cdate_less = null;
	cdate_big = null;
	bdate_less = null;
	bdate_big = null;
	bookinglist: any[];
	hasData: boolean;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		public router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '接诊列表',
			back: false,
		}

		//权限
		this.moduleAuthority = {
			see: false,
			receive: false,
			receiveAll: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.hasData = false;
		this.loadingShow = false;

		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			mobile: '',
			creator_name: '',
			child_name: '',
		}
		this.cdate_less = null;
		this.cdate_big = null;
		this.bdate_less = new Date();
		this.bdate_big = new Date();
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-bookingReceive'));
        if(sessionSearch){
			this.searchInfo = {
	            doctor_id: sessionSearch.doctor_id,
	            service_id: sessionSearch.service_id,
	            mobile: sessionSearch.mobile,
	            creator_name: sessionSearch.creator_name,
	            child_name: sessionSearch.child_name,
            }
            this.cdate_less = sessionSearch.cdate_less ? new Date(sessionSearch.cdate_less) : null;
            this.cdate_big = sessionSearch.cdate_big ? new Date(sessionSearch.cdate_big) : null;
            this.bdate_less = sessionSearch.bdate_less ? new Date(sessionSearch.bdate_less) : null;
            this.bdate_big = sessionSearch.bdate_big ? new Date(sessionSearch.bdate_big) : null;
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		this.search();
		this.getDoctorList();
		this.getServiceList();
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&clinic_id='
			 + this.adminService.getUser().clinicId + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				// this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.servicelist = results.servicelist;
				// this.servicelist.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择科室'});
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	//预约列表
	getList(urlOptions) {
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					for(var i = 0; i < results.weekbooks.length; i++){
						var allFee = 0;
						if(results.weekbooks[i].fees.length > 0){
							for(var j = 0; j < results.weekbooks[i].fees.length; j++){
								allFee += Number(results.weekbooks[i].fees[j].fee);
							}
						}
						results.weekbooks[i].allFee = parseFloat(allFee.toString());
					}
				}
				this.bookinglist = results.weekbooks;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	//查询
	search() {
		this.loadingShow = true;
		// 记录搜索条件
		sessionStorage.setItem('search-bookingReceive', JSON.stringify({
            doctor_id: this.searchInfo.doctor_id,
            service_id: this.searchInfo.service_id,
            mobile: this.searchInfo.mobile,
            creator_name: this.searchInfo.creator_name,
            child_name: this.searchInfo.child_name,
            cdate_less: this.cdate_less,
            cdate_big: this.cdate_big,
            bdate_less: this.bdate_less,
            bdate_big: this.bdate_big,
        }));
		//列表
		var urlOptionsList = this.getUrlOptios();
		//接诊个人和接诊所有
		if(this.moduleAuthority.receive && !this.moduleAuthority.receiveAll){
			urlOptionsList += '&mybooking=1';
		}
		if(this.cdate_less){
			urlOptionsList += '&cdate_less=' + this.adminService.getDayByDate(new Date(this.cdate_less));
		}
		if(this.cdate_big){
			urlOptionsList += '&cdate_big=' + this.adminService.getDayByDate(new Date(this.cdate_big));
		}
		if(this.bdate_less){
			urlOptionsList += '&bdate_less=' + this.adminService.getDayByDate(new Date(this.bdate_less));
		}
		if(this.bdate_big){
			urlOptionsList += '&bdate_big=' + this.adminService.getDayByDate(new Date(this.bdate_big));
		}
		this.getList(urlOptionsList);
	}

    _disabledCdateLess = (endValue) => {
        if (!endValue || !this.cdate_big) {
            return false;
        }
        return endValue.getTime() < this.cdate_big.getTime();
    };

    _disabledCdateBig = (startValue) => {
        if (!startValue || !this.cdate_less) {
            return false;
        }
        return startValue.getTime() > this.cdate_less.getTime();
    };

    _disabledBdateLess = (endValue) => {
        if (!endValue || !this.bdate_big) {
            return false;
        }
        return endValue.getTime() < this.bdate_big.getTime();
    };

    _disabledBdateBig = (startValue) => {
        if (!startValue || !this.bdate_less) {
            return false;
        }
        return startValue.getTime() > this.bdate_less.getTime();
    };

	//查看
	info(booking, service){
		//可编辑日期
		if(service.serviceName == '小儿全科' || service.serviceName == '小儿推拿'){
		 	this.router.navigate(['./admin/docbooking/casehistory'], {queryParams: {id: booking.bookingId, doctorId: service.userDoctorId}});
		 }else if(service.serviceName == '儿童保健' || service.serviceName == '小儿专科'){
		 	this.router.navigate(['./admin/docbooking/healthrecord'], {queryParams: {id: booking.bookingId, doctorId: service.userDoctorId}});
		 }else{
	 		//重置详情选中模块
	 		sessionStorage.setItem('doctorBookingTab', '3');
			this.router.navigate(['./admin/docbooking'], {queryParams: {id: booking.bookingId, doctorId: service.userDoctorId}});
		 }
	}

	getUrlOptios() {
		var urlOptions = this.url;
		urlOptions += '&clinic_id=' + this.adminService.getUser().clinicId + '&statuslist=4,5,11';
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptions += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.mobile && this.searchInfo.mobile != ''){
			urlOptions += '&mobile=' + this.searchInfo.mobile;
		}
		if(this.searchInfo.creator_name && this.searchInfo.creator_name != ''){
			urlOptions += '&creator_name=' + this.searchInfo.creator_name;
		}
		if(this.searchInfo.child_name && this.searchInfo.child_name != ''){
			urlOptions += '&child_name=' + this.searchInfo.child_name;
		}
		return urlOptions;
	}

	//付款
	payment(booking) {
		sessionStorage.setItem('bookingInfo', JSON.stringify(booking));
		this.router.navigate(['./admin/bookingPayment'], {queryParams: {id: booking.bookingId}});
	}
}
