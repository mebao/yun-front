import { Component }                              from '@angular/core';

import { NzMessageService }                       from 'ng-zorro-antd';

import { AdminService }                           from '../admin.service';

@Component({
	selector: 'admin-transaction-record-list',
	templateUrl: './transaction-record-list.component.html',
	styles: [ `
		.ant-form-item-label label:after{
		    display: none;
		}
	`
  	]
})
export class TransactionRecordListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	hasData: boolean;
	recordList: any[];
	url: string;
	searchInfo: {
		user_name: string,
		b_amount: string,
		l_amount: string,
		type: string,
		pay_way: string,
	}
    _startDate = null;
    _endDate = null;
	commonList: any[];

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '交易记录',
			back: false,
		}

		this.loadingShow = false;

		this.hasData = false;
		this.recordList = [];


		var todayDate = this.adminService.getDayByDate(new Date());
		this.searchInfo = {
			user_name: '',
			b_amount: '',
			l_amount: '',
			type: '',
			pay_way: '',
		}
        this._startDate = new Date();
        this._endDate = new Date();
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-transactionRecordList'));
        if(sessionSearch){
			this.searchInfo = {
	            user_name: sessionSearch.user_name,
	            b_amount: sessionSearch.b_amount,
	            l_amount: sessionSearch.l_amount,
	            type: sessionSearch.type,
	            pay_way: sessionSearch.pay_way,
            }
            this._startDate = sessionSearch._startDate ? new Date(sessionSearch._startDate) : null;
            this._endDate = sessionSearch._endDate ? new Date(sessionSearch._endDate) : null;
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
		sessionStorage.setItem('search-transactionRecordList', JSON.stringify({
            user_name: this.searchInfo.user_name,
            b_amount: this.searchInfo.b_amount,
            l_amount: this.searchInfo.l_amount,
            type: this.searchInfo.type,
            pay_way: this.searchInfo.pay_way,
            _startDate: this._startDate,
            _endDate: this._endDate,
        }));
		var urlOptions = this.url;
		if(this.searchInfo.user_name && this.searchInfo.user_name != ''){
			urlOptions += '&user_name=' + this.searchInfo.user_name;
		}
        if(this._startDate){
            urlOptions += '&b_time=' + this.adminService.getDayByDate(new Date(this._startDate));
        }
        if(this._endDate){
            urlOptions += '&l_time=' + this.adminService.getDayByDate(new Date(this._endDate));
        }
		if(this.searchInfo.b_amount && this.searchInfo.b_amount != ''){
			urlOptions += '&b_amount=' + this.searchInfo.b_amount;
		}
		if(this.searchInfo.l_amount && this.searchInfo.l_amount != ''){
			urlOptions += '&l_amount=' + this.searchInfo.l_amount;
		}
		if(this.searchInfo.type && this.searchInfo.type != ''){
			urlOptions += '&type=' + this.searchInfo.type;
		}
		if(this.searchInfo.pay_way && this.searchInfo.pay_way != ''){
			urlOptions += '&pay_way=' + this.searchInfo.pay_way;
		}
		this.getData(urlOptions);
	}

    _disabledStartDate = (startValue) => {
        if (!startValue || !this._endDate) {
            return false;
        }
        return startValue.getTime() > this._endDate.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this._startDate) {
            return false;
        }
        return endValue.getTime() < this._startDate.getTime();
    };

	getData(urlOptions) {
		this.adminService.searchtran(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
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
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}
}
