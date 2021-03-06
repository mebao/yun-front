import { Component }                      from '@angular/core';

import { NzMessageService }               from 'ng-zorro-antd';

import { AdminService }                   from '../admin.service';

@Component({
    selector: 'admin-guazhang-list',
    templateUrl: './guazhang-list.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})

export class GuazhangList{
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
        second_type: string,
        selectType: string,
        date_big: Date,
        date_less: Date,
	}
    modalConfirmTab: boolean;
    selector: {
        id: string,
        user: string,
        amount: string,
        text: string,
        second_way: string,
        userBalance: string,
        memberId: string,
        memberName: string,
        balanceCanPay: boolean,
    }
    btnCanEdit: boolean;

	constructor(
        private _message: NzMessageService,
		public adminService: AdminService,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '挂账收费',
			back: false,
		}

		this.loadingShow = false;

		this.hasData = false;
		this.recordList = [];

		this.searchInfo = {
			user_name: '',
			b_amount: '',
			l_amount: '',
            second_type: '1',
            selectType: '1',
            date_big: new Date(),
            date_less: new Date(),
		}
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-guazhangList'));
        if(sessionSearch){
			this.searchInfo = {
	            user_name: sessionSearch.user_name,
	            b_amount: sessionSearch.b_amount,
	            l_amount: sessionSearch.l_amount,
	            second_type: sessionSearch.second_type,
                selectType: sessionSearch.selectType,
                date_big: sessionSearch.date_big ? new Date(sessionSearch.date_big) : null,
                date_less: sessionSearch.date_less ? new Date(sessionSearch.date_less) : null,
            }
		}

        this.modalConfirmTab = false;;
        this.selector = {
            id: '',
            user: '',
            amount: '',
            text: '',
            second_way: '',
            userBalance: '',
            memberId: '',
            memberName: '',
            balanceCanPay: false,
        }
        this.btnCanEdit = false;

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search();
	}

	search() {
        this.loadingShow = true;
		sessionStorage.setItem('search-guazhangList', JSON.stringify(this.searchInfo));
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
		if(this.searchInfo.second_type && this.searchInfo.second_type != ''){
			urlOptions += '&second_type=' + this.searchInfo.second_type;
		}
		this.getData(urlOptions);
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
		this.adminService.searchguazhang(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.recordList = results.list;

                this.searchInfo.selectType = this.searchInfo.second_type;

				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

    closeConfirm() {
        this.selector = {
            id: '',
            user: '',
            amount: '',
            text: '',
            second_way: this.selector.second_way == '' ? null : '',
            userBalance: '',
            memberId: '',
            memberName: '',
            balanceCanPay: false,
        }
        this.modalConfirmTab = false;
    }

    pay(record) {
        this.loadingShow = true;
        this.selector.id = record.id;
        this.selector.user = record.userName;
        this.selector.amount = record.amount;
        this.selector.second_way = this.selector.second_way == '' ? null : '';
        this.getUserInfo(record.userId,this.selector.amount);
    }

    confirm() {
        this.btnCanEdit = true;
        if(this.adminService.isFalse(this.selector.second_way)){
            this._message.error('支付方式不可为空');
            this.btnCanEdit = false;
            return;
        }
        this.modalConfirmTab = false;
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            id: this.selector.id,
            amount: this.selector.amount,
            second_way: this.selector.second_way,
        }
        this.adminService.payguazhang(this.selector.id, params).then((data) => {
            if(data.status == 'no'){
                this._message.error(data.errorMsg);
                this.btnCanEdit = false;
            }else{
                this._message.success('支付成功');
                this.btnCanEdit = false;
                this.search();
            }
        }).catch(() => {
            this._message.error('服务器错误');
            this.btnCanEdit = false;
        });
    }

    // 获取家长信息，是否是会员
    getUserInfo(id,guzhang) {
        var urlOptions = '?username=' + this.adminService.getUser().username
             + '&token=' + this.adminService.getUser().token
             + '&clinic_id=' + this.adminService.getUser().clinicId
             + '&id=' + id;
        this.adminService.searchuser(urlOptions).then((data) => {
            if(data.status == 'no'){
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            }else{
                var results = JSON.parse(JSON.stringify(data.results));
                if(results.users.length > 0){
                    this.selector.userBalance = results.users[0].userBalance;
                    this.selector.memberId = results.users[0].memberId;
                    this.selector.memberName = results.users[0].memberName;
                    if(parseFloat(results.users[0].userBalance) >= parseFloat(guzhang)){
                        this.selector.balanceCanPay = true;
                    }else{
                        this.selector.balanceCanPay = false;
                    }
                }
                this.loadingShow = false;
                this.modalConfirmTab = true;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }
}
