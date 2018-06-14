import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

@Component({
	selector: 'admin-booking-receive',
	templateUrl: './booking-receive.component.html',
	styleUrls: ['./booking-receive.component.scss', '../../../../assets/css/ant-common.scss'],
})
export class BookingReceiveComponent {
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		receive: boolean,
		receiveAll: boolean,
		phyexam: boolean,
	}
	loadingShow: boolean;
	url: string;
	doctorlist: any[];
	servicelist: any[];
	childList: any[];
	searchInfo: {
		typeFrom: string,
		doctor_id: string;
		service_id: string;
		mobile: string,
		creator_name: string,
		child_id: string,
	}
	cdate_less = null;
	cdate_big = null;
	bdate_less = null;
	bdate_big = null;
	bookinglist: any[];
	hasData: boolean;
	// 预约体检套餐
	phyexamList: any[];
	modalTab: boolean;
	selectedInfo: {
		booking: any,
		phyexam: any,
	}

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		public router: Router,
		private route: ActivatedRoute,
	) { }

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
			phyexam: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if (this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9') {
			for (var key in this.moduleAuthority) {
				this.moduleAuthority[key] = true;
			}
		} else {
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for (var i = 0; i < authority.infos.length; i++) {
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.hasData = false;
		this.loadingShow = false;
		this.phyexamList = [];
		this.modalTab = false;
		this.selectedInfo = {
			booking: {},
			phyexam: {},
		}

		this.url = '?username=' + this.adminService.getUser().username
			+ '&token=' + this.adminService.getUser().token
			+ '&clinic_id=' + this.adminService.getUser().clinicId;

		this.doctorlist = [];
		this.servicelist = [];
		this.childList = [];
		this.getDoctorList();
		this.getServiceList();
		this.getChildList();

		this.searchInfo = {
			typeFrom: '',
			doctor_id: '',
			service_id: '',
			mobile: '',
			creator_name: '',
			child_id: '',
		}
		this.cdate_less = null;
		this.cdate_big = null;
		this.bdate_less = new Date();
		this.bdate_big = new Date();

		// 获取页面来源
		this.route.queryParams.subscribe((params) => {
			if(params.child_id){
				this.searchInfo.typeFrom = 'message';
				this.searchInfo.child_id = params.child_id;
			}
		});
		if(this.searchInfo.typeFrom == 'message'){
			this.bdate_less = null;
			this.bdate_big = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
		}

		var sessionSearch = JSON.parse(sessionStorage.getItem('search-bookingReceive'));
		if (sessionSearch) {
			this.searchInfo = {
				typeFrom: '',
				doctor_id: sessionSearch.doctor_id,
				service_id: sessionSearch.service_id,
				mobile: sessionSearch.mobile,
				creator_name: sessionSearch.creator_name,
				child_id: sessionSearch.child_id,
			}
			this.cdate_less = sessionSearch.cdate_less ? new Date(sessionSearch.cdate_less) : null;
			this.cdate_big = sessionSearch.cdate_big ? new Date(sessionSearch.cdate_big) : null;
			this.bdate_less = sessionSearch.bdate_less ? new Date(sessionSearch.bdate_less) : null;
			this.bdate_big = sessionSearch.bdate_big ? new Date(sessionSearch.bdate_big) : null;
		}

		this.search();
	}

	//医生列表
	getDoctorList() {
		var adminlistUrl = this.url + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if (data.status == 'no') {
				this._message.error(data.errorMsg);
			} else {
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
		this.adminService.servicelist(this.url + '&status=1').then((data) => {
			if (data.status == 'no') {
				this._message.error(data.errorMsg);
			} else {
				var results = JSON.parse(JSON.stringify(data.results));
				this.servicelist = results.servicelist;
				// this.servicelist.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择科室'});
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	// 宝宝列表
	getChildList() {
		this.adminService.searchchild(this.url).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.childList = results.child;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	//预约列表
	getList(urlOptions) {
		this.adminService.searchbooking(urlOptions).then((data) => {
			if (data.status == 'no') {
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			} else {
				var results = JSON.parse(JSON.stringify(data.results));
				if (results.weekbooks.length > 0) {
					for (var i = 0; i < results.weekbooks.length; i++) {
						var allFee = 0;
						if (results.weekbooks[i].fees.length > 0) {
							for (var j = 0; j < results.weekbooks[i].fees.length; j++) {
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
			child_id: this.searchInfo.child_id,
			cdate_less: this.cdate_less,
			cdate_big: this.cdate_big,
			bdate_less: this.bdate_less,
			bdate_big: this.bdate_big,
		}));
		//列表
		var urlOptionsList = this.getUrlOptios();
		//接诊个人和接诊所有
		if (this.moduleAuthority.receive && !this.moduleAuthority.receiveAll) {
			urlOptionsList += '&mybooking=1';
		}
		if (this.cdate_less) {
			urlOptionsList += '&cdate_less=' + this.adminService.getDayByDate(new Date(this.cdate_less));
		}
		if (this.cdate_big) {
			urlOptionsList += '&cdate_big=' + this.adminService.getDayByDate(new Date(this.cdate_big));
		}
		if (this.bdate_less) {
			urlOptionsList += '&bdate_less=' + this.adminService.getDayByDate(new Date(this.bdate_less));
		}
		if (this.bdate_big) {
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
	info(booking, service) {
		//可编辑日期
		if (service.serviceName == '小儿全科' || service.serviceName == '小儿推拿') {
			this.router.navigate(['./admin/docbooking/casehistory'], { queryParams: { id: booking.bookingId, doctorId: service.userDoctorId } });
		} else if (service.serviceName == '儿童保健' || service.serviceName == '小儿专科') {
			this.router.navigate(['./admin/docbooking/healthrecord'], { queryParams: { id: booking.bookingId, doctorId: service.userDoctorId } });
		} else {
			//重置详情选中模块
			sessionStorage.setItem('doctorBookingTab', '0');
			this.router.navigate(['./admin/docbooking'], { queryParams: { id: booking.bookingId, doctorId: service.userDoctorId } });
		}
	}

	getUrlOptios() {
		var urlOptions = this.url + '&statuslist=4,5,11';
		if (this.searchInfo.doctor_id && this.searchInfo.doctor_id != '') {
			urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if (this.searchInfo.service_id && this.searchInfo.service_id != '') {
			urlOptions += '&service_id=' + this.searchInfo.service_id;
		}
		if (this.searchInfo.mobile && this.searchInfo.mobile != '') {
			urlOptions += '&mobile=' + this.searchInfo.mobile;
		}
		if (this.searchInfo.creator_name && this.searchInfo.creator_name != '') {
			urlOptions += '&creator_name=' + this.searchInfo.creator_name;
		}
		if (this.searchInfo.child_id && this.searchInfo.child_id != '') {
			urlOptions += '&child_id=' + this.searchInfo.child_id;
		}
		return urlOptions;
	}

	//付款
	payment(booking) {
		sessionStorage.setItem('bookingInfo', JSON.stringify(booking));
		this.router.navigate(['./admin/bookingPayment'], { queryParams: { id: booking.bookingId } });
	}

	phyexam(booking, service) {
		this.loadingShow = true;
		var urlOptions = this.url + '&service_id=' + service.serviceId;
		this.adminService.searchphypage(urlOptions).then((data) => {
			if (data.status == 'no') {
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			} else {
				var results = JSON.parse(JSON.stringify(data.results));
				this.loadingShow = false;
				this.phyexamList = results.list;
				this.selectedInfo = {
					booking: booking,
					phyexam: '',
				}
				this.modalTab = true;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	close() {
		this.phyexamList = [];
		this.modalTab = false;
	}

	confirm() {
		if (this.selectedInfo.phyexam == '') {
			this._message.error('体检套餐未选择');
			return;
		}

		this.loadingShow = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			booking_id: this.selectedInfo.booking.bookingId,
			child_id: this.selectedInfo.booking.childId,
			service_id: this.selectedInfo.phyexam['serviceId'],
			package_id: this.selectedInfo.phyexam['id'],
			package_name: this.selectedInfo.phyexam['name'],
			first_price: this.selectedInfo.phyexam['firstPrice'],
			price: this.selectedInfo.phyexam['price'],
		}
		this.adminService.bookingphypack(params).then((data) => {
			if (data.status == 'no') {
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			} else {
				var results = JSON.parse(JSON.stringify(data.results));
				this.loadingShow = false;
				this.modalTab = false;
				this._message.success('体检套餐添加成功');
				this.search();
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}
}
