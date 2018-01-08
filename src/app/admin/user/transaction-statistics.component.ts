import { Component }                              from '@angular/core';

import { AdminService }                           from '../admin.service';
import { config }                                 from '../../config';

@Component({
	selector: 'admin-transaction-statistics',
	templateUrl: './transaction-statistics.component.html',
})
export class TransactionStatisticsComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	loadingShow: boolean;
	hasData: boolean;
	tranList: any[];
	total: {
		needAmount: string,
		giveAmount: string,
		paidUp: string,
		bookingFee: string,
		cash: string,
		online: string,
		balance: string,
		gua: string,
		total: string,
		discount: string,
	}
	url: string;
	doctorlist: any[];
	servicelist: any[];
	searchInfo: {
		doctor_id: string,
		service_id: string,
		user_name: string,
		b_time: string,
		b_time_text: string,
		b_time_num: number,
		l_time: string,
		l_time_text: string,
		l_time_num: number,
		b_amount: string,
		l_amount: string,
		type: string,
		pay_way: string,
	}
	commonList: any[];

	constructor(
		public adminService: AdminService,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '交易统计',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.loadingShow = true;

		this.hasData = false;
		this.tranList = [];
		this.total = {
			needAmount: '',
			giveAmount: '',
			paidUp: '',
			bookingFee: '',
			cash: '',
			online: '',
			balance: '',
			gua: '',
			total: '',
			discount: '',
		}

		var todayDate = this.adminService.getDayByDate(new Date());
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			user_name: '',
			b_time: todayDate,
			b_time_text: this.adminService.dateFormat(todayDate),
			b_time_num: new Date(todayDate).getTime(),
			l_time: todayDate,
			l_time_text: this.adminService.dateFormat(todayDate),
			l_time_num: new Date(todayDate).getTime(),
			b_amount: '',
			l_amount: '',
			type: '1,3',
			pay_way: '',
		}

		this.commonList = [
			{id: 1},
			{id: 2},
		]

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

	    this.getDoctorList();
		this.servicelist = [];
		this.getServiceList();

		this.search('');
	}

	changeType(_value) {
		this.searchInfo.type = _value;
		this.search('');
	}

	search(type) {
		var urlOptions = this.url;
		if(this.searchInfo.user_name != ''){
			urlOptions += '&user_name=' + this.searchInfo.user_name;
		}
		if(this.searchInfo.b_time != ''){
			urlOptions += '&b_time=' + this.searchInfo.b_time;
		}
		if(this.searchInfo.l_time != ''){
			urlOptions += '&l_time=' + this.searchInfo.l_time;
		}
		if(this.searchInfo.b_amount != ''){
			urlOptions += '&b_amount=' + this.searchInfo.b_amount;
		}
		if(this.searchInfo.l_amount != ''){
			urlOptions += '&l_amount=' + this.searchInfo.l_amount;
		}
		if(this.searchInfo.type != ''){
			if(this.searchInfo.type == '1,3'){
				urlOptions += '&typelist=' + this.searchInfo.type;
			}else{
				urlOptions += '&type=' + this.searchInfo.type;
			}
		}
		if(this.searchInfo.pay_way != ''){
			urlOptions += '&pay_way=' + this.searchInfo.pay_way;
		}
		if(this.searchInfo.service_id != ''){
			urlOptions += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.doctor_id != ''){
			urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
		}

		if(type == ''){
			this.getData(urlOptions);
		}else{
			window.location.href = config.baseHTTP + '/mebcrm/transtatisticsexport'+ urlOptions;
		}
	}

	getData(urlOptions) {
		this.adminService.transtatistics(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length>0){
					this.total = {
						needAmount: this.adminService.toDecimal2(results.total.needAmount),
						giveAmount: this.adminService.toDecimal2(results.total.giveAmount),
						paidUp: this.adminService.toDecimal2(results.total.paidUp),
						bookingFee: this.adminService.toDecimal2(results.total.bookingFee),
						cash: this.adminService.toDecimal2(results.total.cash),
						online: this.adminService.toDecimal2(results.total.online),
						balance: this.adminService.toDecimal2(results.total.balance),
						gua: this.adminService.toDecimal2(results.total.gua),
						total: this.adminService.toDecimal2(results.total.total),
						discount: this.adminService.toDecimal2(results.total.discount),
					}
					for(var i=0;i<results.list.length;i++){
						var numList = [
							'balance',
							'bookingFee',
							'cash',
							'discount',
							'giveAmount',
							'gua',
							'needAmount',
							'online',
							'paidUp',
							'total',
						]
						for(var j = 0; j < numList.length; j++){
							results.list[i][numList[j]] = this.adminService.toDecimal2(results.list[i][numList[j]]);
						}
					}
				}
				this.tranList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		});
	}

	// 选择时间
	changeDate(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&clinic_id='
			 + this.adminService.getUser().clinicId + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		})
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].color = this.adminService.colorList()[i % 10];
						results.servicelist[i].infoList = [];
					}
				}
				this.servicelist = results.servicelist;
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
