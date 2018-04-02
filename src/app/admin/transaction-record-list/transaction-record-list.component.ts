import { Component }                              from '@angular/core';

import { AdminService }                           from '../admin.service';

@Component({
	selector: 'admin-transaction-record-list',
	templateUrl: './transaction-record-list.component.html',
})
export class TransactionRecordListComponent{
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
	recordList: any[];
	url: string;
	searchInfo: {
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
			title: '交易记录',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.loadingShow = false;

		this.hasData = false;
		this.recordList = [];


		var todayDate = this.adminService.getDayByDate(new Date());
		this.searchInfo = {
			user_name: '',
			b_time: todayDate,
			b_time_text: this.adminService.dateFormat(todayDate),
			b_time_num: new Date(todayDate).getTime(),
			l_time: todayDate,
			l_time_text: this.adminService.dateFormat(todayDate),
			l_time_num: new Date(todayDate).getTime(),
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

		this.search();
	}

	search() {
		this.loadingShow = true;
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
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchtran(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].amount = this.adminService.toDecimal2(results.list[i].amount);
					}
				}
				this.recordList = results.list;
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
