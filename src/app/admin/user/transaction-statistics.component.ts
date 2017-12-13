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
	total: any;
	discount: string;
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
		this.discount = '';

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
		var discount = 0;
		this.adminService.transtatistics(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.tranList = results.list;
				this.hasData = true;
				this.total = results.total;
				this.total.needAmount = this.adminService.toDecimal2(Number(this.total.needAmount));
				this.total.giveAmount = this.adminService.toDecimal2(Number(this.total.giveAmount));
				this.total.bookingFee = this.adminService.toDecimal2(Number(this.total.bookingFee));
				this.total.paidUp = this.adminService.toDecimal2(Number(this.total.paidUp));
				this.total.cash = this.adminService.toDecimal2(Number(this.total.cash));
				this.total.online = this.adminService.toDecimal2(Number(this.total.online));
				this.total.balance = this.adminService.toDecimal2(Number(this.total.balance));
				this.total.gua = this.adminService.toDecimal2(Number(this.total.gua));
				this.total.total = this.adminService.toDecimal2(Number(this.total.total));
				this.loadingShow = false;
				if(this.tranList.length>0){
					for(var i=0;i<this.tranList.length;i++){
						this.tranList[i].cash = 0//现金
						this.tranList[i].online = 0;//线上
						this.tranList[i].balance = 0;//余额
						this.tranList[i].gua = 0;//挂账
						this.tranList[i].paidUp = 0;//实收
						this.tranList[i].total = 0;//总收入
						this.tranList[i].discount = 0;//折扣
						if(this.tranList[i].payWay=='money'){
							this.tranList[i].cash+=parseFloat(this.tranList[i].amount);
						}
						if(this.tranList[i].secondWay=='money'){
							this.tranList[i].cash+=parseFloat(this.tranList[i].secondAmount);
						}
						if(this.tranList[i].payWay=='ali' || this.tranList[i].payWay=='wechat' || this.tranList[i].payWay=='wc_zhuan' || this.tranList[i].payWay=='card'){
							this.tranList[i].online+=parseFloat(this.tranList[i].amount);
						}
						if(this.tranList[i].payWay=='ali' || this.tranList[i].payWay=='wechat' || this.tranList[i].payWay=='wc_zhuan' || this.tranList[i].payWay=='card'){
							this.tranList[i].online+=parseFloat(this.tranList[i].secondAmount);
						}
						if(this.tranList[i].payWay=='member'){
							this.tranList[i].balance+=parseFloat(this.tranList[i].amount);
						}
						if(this.tranList[i].secondWay=='member'){
							this.tranList[i].balance+=parseFloat(this.tranList[i].secondAmount);
						}
						if(this.tranList[i].payWay=='guazhang'){
							this.tranList[i].gua+=parseFloat(this.tranList[i].amount);
						}
						if(this.tranList[i].secondWay=='guazhang'){
							this.tranList[i].gua+=parseFloat(this.tranList[i].secondAmount);
						}
						this.tranList[i].cash = this.adminService.toDecimal2(Number(this.tranList[i].cash));
						this.tranList[i].online = this.adminService.toDecimal2(Number(this.tranList[i].online));
						this.tranList[i].balance = this.adminService.toDecimal2(Number(this.tranList[i].balance));
						this.tranList[i].gua = this.adminService.toDecimal2(Number(this.tranList[i].gua));
						this.tranList[i].paidUp = this.adminService.toDecimal2(Number(parseFloat(this.tranList[i].cash) + parseFloat(this.tranList[i].online)));
						this.tranList[i].bookingFee = this.tranList[i].bookingFee == '' ? this.adminService.toDecimal2(0) : this.adminService.toDecimal2(this.tranList[i].bookingFee);
						this.tranList[i].giveAmount = this.tranList[i].giveAmount == null || this.tranList[i].giveAmount == '' ? this.adminService.toDecimal2(0) : this.adminService.toDecimal2(this.tranList[i].giveAmount);
						this.tranList[i].total = this.adminService.toDecimal2(Number(parseFloat(this.tranList[i].paidUp) + parseFloat(this.tranList[i].bookingFee) + parseFloat(this.tranList[i].gua) + parseFloat(this.tranList[i].balance)));
						if(this.tranList[i].type == 2 || this.tranList[i].type == 3){
							this.tranList[i].discount = 0;
						}else{
							this.tranList[i].discount = this.adminService.toDecimal2(parseFloat(this.tranList[i].needAmount) - parseFloat(this.tranList[i].total) - parseFloat(this.tranList[i].giveAmount));
							discount += (Number(parseFloat(this.tranList[i].needAmount)*100) - Number(parseFloat(this.tranList[i].total)*100) - Number(parseFloat(this.tranList[i].giveAmount)*100))/100;
						}
					}
				}
				this.discount = this.adminService.toDecimal2(discount);
				console.log(this.tranList);
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
