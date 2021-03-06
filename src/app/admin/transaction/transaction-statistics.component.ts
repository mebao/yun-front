import { Component }                              from '@angular/core';

import { NzMessageService }                       from 'ng-zorro-antd';

import { AdminService }                           from '../admin.service';
import { config }                                 from '../../config';

@Component({
	selector: 'admin-transaction-statistics',
	templateUrl: './transaction-statistics.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class TransactionStatisticsComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	hasData: boolean;
	tranList: any[];
	total: {
		act: string,
		cash: string,
		needAmount: string,
		giveAmount: string,
		paidUp: string,
		bookingFee: string,
		money: string,
		online: string,
		balance: string,
		gua: string,
		total: string,
		truepay: string,
		discount: string,
	}
	url: string;
	doctorlist: any[];
	servicelist: any[];
	searchInfo: {
		doctor_id: string,
		service_id: string,
		user_name: string,
		b_amount: string,
		l_amount: string,
		type: string,
        pay_way: string,
        date_big: Date,
        date_less: Date,
	}
	commonList: any[];
	modalInfoTab: boolean = false;
	selector: {
		bookingDate: string,
		doctorName: string,
		serviceName: string,
		refereeName: string,
		remark: string,
	}

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '交易统计',
			back: false,
		}

		this.loadingShow = false;

		this.hasData = false;
		this.tranList = [];
		this.total = {
			act: '',
			cash: '',
			needAmount: '',
			giveAmount: '',
			paidUp: '',
			bookingFee: '',
			money: '',
			online: '',
			balance: '',
			gua: '',
			total: '',
			truepay: '',
			discount: '',
		}

		var todayDate = this.adminService.getDayByDate(new Date());
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			user_name: '',
			b_amount: '',
			l_amount: '',
			type: '1,3,7',
			pay_way: '',
            date_big: new Date(),
            date_less: new Date(),
		}
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-transactionStatistics'));
        if(sessionSearch){
			this.searchInfo = {
	            user_name: sessionSearch.user_name,
	            b_amount: sessionSearch.b_amount,
	            l_amount: sessionSearch.l_amount,
	            type: sessionSearch.type,
	            pay_way: sessionSearch.pay_way,
	            service_id: sessionSearch.service_id,
				doctor_id: sessionSearch.doctor_id,
                date_big: sessionSearch.date_big ? new Date(sessionSearch.date_big) : null,
                date_less: sessionSearch.date_less ? new Date(sessionSearch.date_less) : null,
            }
		}

		this.commonList = [
			{id: 1},
			{id: 2},
		]

		this.selector = {
			bookingDate: '',
			doctorName: '',
			serviceName: '',
			refereeName: '',
			remark: '',
		}

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
		this.loadingShow = true;
		sessionStorage.setItem('search-transactionStatistics', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.user_name && this.searchInfo.user_name != ''){
			urlOptions += '&user_name=' + this.searchInfo.user_name;
		}
        if(this.searchInfo.date_big){
            urlOptions += '&b_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_big));
        }
        if(this.searchInfo.date_less){
            urlOptions += '&l_time=' + this.adminService.getDayByDate(new Date(this.searchInfo.date_less));
        }
		if(this.searchInfo.b_amount && this.searchInfo.b_amount != ''){
			urlOptions += '&b_amount=' + this.searchInfo.b_amount;
		}
		if(this.searchInfo.l_amount && this.searchInfo.l_amount != ''){
			urlOptions += '&l_amount=' + this.searchInfo.l_amount;
		}
		if(this.searchInfo.type && this.searchInfo.type != ''){
			if(this.searchInfo.type == '1,3,7'){
				urlOptions += '&typelist=' + this.searchInfo.type;
			}else{
				urlOptions += '&type=' + this.searchInfo.type;
			}
		}
		if(this.searchInfo.pay_way && this.searchInfo.pay_way != ''){
			urlOptions += '&pay_way=' + this.searchInfo.pay_way;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptions += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptions += '&doctor_id=' + this.searchInfo.doctor_id;
		}

		if(type == ''){
			this.getData(urlOptions);
		}else{
			window.location.href = config.baseHTTP() + '/mebcrm/transtatisticsexport'+ urlOptions;
			this.loadingShow = false;
		}
    }

    _disabledStartDate = (startValue) => {
        if (!startValue || !this.searchInfo.date_less) {
            return false;
        }
        return startValue.getTime() > this.searchInfo.date_less.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this.searchInfo.date_big) {
            return false;
        }
        return endValue.getTime() < this.searchInfo.date_big.getTime();
    };

	getData(urlOptions) {
		this.adminService.transtatistics(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length>0){
					this.total = {
						act: this.adminService.toDecimal2(results.total.act),
						cash: this.adminService.toDecimal2(results.total.cash),
						needAmount: this.adminService.toDecimal2(results.total.needAmount),
						giveAmount: this.adminService.toDecimal2(results.total.giveAmount),
						paidUp: this.adminService.toDecimal2(results.total.paidUp),
						bookingFee: this.adminService.toDecimal2(results.total.bookingFee),
						money: this.adminService.toDecimal2(results.total.money),
						online: this.adminService.toDecimal2(results.total.online),
						balance: this.adminService.toDecimal2(results.total.balance),
						gua: this.adminService.toDecimal2(results.total.gua),
						total: this.adminService.toDecimal2(results.total.total),
						truepay: this.adminService.toDecimal2(results.total.truepay),
						discount: this.adminService.toDecimal2(results.total.discount),
					}
					for(var i=0;i<results.list.length;i++){
						var numList = [
							'act',
							'balance',
							'bookingFee',
							'money',
							'discount',
							'giveAmount',
							'gua',
							'needAmount',
							'online',
							'paidUp',
							'total',
							'truepay',
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
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
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
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId + '&status=1';
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.servicelist.length > 0){
					for(var i = 0; i < results.servicelist.length; i++){
						results.servicelist[i].color = this.adminService.colorList()[i % 15];
						results.servicelist[i].infoList = [];
					}
				}
				this.servicelist = results.servicelist;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	info(tran) {
		this.selector = {
			bookingDate: tran.bookingDate,
			doctorName: tran.doctorName,
			serviceName: tran.serviceName,
			refereeName: tran.refereeName,
			remark: tran.remark,
		}
		this.modalInfoTab = true;
	}

	closeInfo() {
		this.modalInfoTab = false;
		this.selector = {
			bookingDate: '',
			doctorName: '',
			serviceName: '',
			refereeName: '',
			remark: '',
		}
	}

}
