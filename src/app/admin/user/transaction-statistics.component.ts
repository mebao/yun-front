import { Component }                              from '@angular/core';

import { AdminService }                           from '../admin.service';

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
		b_time_num: number,
		l_time: string,
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
			title: '交易记录',
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
			cash: '',
			online: '',
			balance: '',
			gua: '',
			total: '',
			discount: '',
		}

		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			user_name: '',
			b_time: '',
			b_time_num: 0,
			l_time: '',
			l_time_num: 0,
			b_amount: '',
			l_amount: '',
			type: '',
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

		this.search();
	}

	search() {
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
			urlOptions += '&type=' + this.searchInfo.type;
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
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.transtatistics(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.tranList = results.list;
				this.total = {
					needAmount: results.total.needAmount,
					giveAmount: results.total.giveAmount,
					paidUp: results.total.paidUp,
					cash: results.total.cash,
					online: results.total.online,
					balance: results.total.balance,
					gua: results.total.gua,
					total: results.total.total,
					discount: results.total.discount,
				}
				var discountTotal = 0;
				if(this.tranList.length>0){
					for(var i=0;i<this.tranList.length;i++){
						this.tranList[i].total = this.adminService.toDecimal2(this.tranList[i].total);
						this.tranList[i].discount = this.adminService.toDecimal2(this.tranList[i].discount);
						this.tranList[i].needAmount = this.adminService.toDecimal2(this.tranList[i].needAmount);
						// 计算总折扣
						discountTotal += parseFloat(this.tranList[i].discount) * 100;
						if(this.tranList[i].bookinginfos.length > 0){
							for(var j = 0; j < this.tranList[i].bookinginfos.length; j++){
								this.tranList[i].bookinginfos[j].needAmount = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].needAmount);
								this.tranList[i].bookinginfos[j].discount = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].discount);
								this.tranList[i].bookinginfos[j].giveAmount = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].giveAmount);
								this.tranList[i].bookinginfos[j].paidUp = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].paidUp);
								this.tranList[i].bookinginfos[j].cash = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].cash);
								this.tranList[i].bookinginfos[j].online = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].online);
								this.tranList[i].bookinginfos[j].balance = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].balance);
								this.tranList[i].bookinginfos[j].gua = this.adminService.toDecimal2(this.tranList[i].bookinginfos[j].gua);
							}
						}
					}
				}
				this.total.discount = this.adminService.toDecimal2(discountTotal / 100);
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
		this.adminService.clinicservices(urlOptions).then((data) => {
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
