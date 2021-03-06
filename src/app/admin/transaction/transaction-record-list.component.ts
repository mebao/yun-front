import { Component }                              from '@angular/core';

import { NzMessageService }                       from 'ng-zorro-antd';

import { AdminService }                           from '../admin.service';
import { config }                                 from '../../config';

@Component({
	selector: 'admin-transaction-record-list',
	templateUrl: './transaction-record-list.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
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
        date_big: Date,
        date_less: Date,
	}
	commonList: any[];
	amount: string;

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
            date_big: new Date(),
            date_less: new Date(),
		}
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-transactionRecordList'));
        if(sessionSearch){
			this.searchInfo = {
	            user_name: sessionSearch.user_name,
	            b_amount: sessionSearch.b_amount,
	            l_amount: sessionSearch.l_amount,
	            type: sessionSearch.type,
				pay_way: sessionSearch.pay_way,
                date_big: sessionSearch.date_big ? new Date(sessionSearch.date_big) : null,
                date_less: sessionSearch.date_less ? new Date(sessionSearch.date_less) : null,
            }
		}

		this.commonList = [
			{id: 1},
			{id: 2},
		]
		this.amount = '';

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search('');
	}

	search(type) {
		this.loadingShow = true;
		sessionStorage.setItem('search-transactionRecordList', JSON.stringify(this.searchInfo));
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
			urlOptions += '&type=' + this.searchInfo.type;
		}
		if(this.searchInfo.pay_way && this.searchInfo.pay_way != ''){
			urlOptions += '&pay_way=' + this.searchInfo.pay_way;
		}

		if(type == ''){
			this.getData(urlOptions);
		}else{
			window.location.href = config.baseHTTP() + '/mebcrm/tranexport'+ urlOptions;
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
				this.amount = results.amount;
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
