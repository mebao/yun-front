import { Component }                      from '@angular/core';

import { AdminService }                   from '../admin.service';

@Component({
    selector: 'admin-guazhang-list',
    templateUrl: './guazhang-list.component.html'
})

export class GuazhangList{
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
		b_time_num: number,
		l_time: string,
		l_time_num: number,
		b_amount: string,
		l_amount: string,
        second_type: string,
        selectType: string,
	}
	commonList: any[];
    modalConfirmTab: boolean;
    selector: {
        id: string,
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
		public adminService: AdminService,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '挂账收费',
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

		this.searchInfo = {
			user_name: '',
			b_time: '',
			b_time_num: 0,
			l_time: '',
			l_time_num: 0,
			b_amount: '',
			l_amount: '',
            second_type: '1',
            selectType: '1',
		}

		this.commonList = [
			{id: 1},
			{id: 2},
		]

        this.modalConfirmTab = false;;
        this.selector = {
            id: '',
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
		var urlOptions = this.url;
		if(this.searchInfo.user_name && this.searchInfo.user_name != ''){
			urlOptions += '&user_name=' + this.searchInfo.user_name;
		}
		if(this.searchInfo.b_time && this.searchInfo.b_time != ''){
			urlOptions += '&b_time=' + this.searchInfo.b_time;
		}
		if(this.searchInfo.l_time && this.searchInfo.l_time != ''){
			urlOptions += '&l_time=' + this.searchInfo.l_time;
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

	getData(urlOptions) {
		this.adminService.searchtran(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.recordList = results.list;

                this.searchInfo.selectType = this.searchInfo.second_type;

				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
            this.loadingShow = false;
            this.toastTab('服务器错误', 'error');
        });
	}

	// 选择时间
	changeDate(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
	}

    closeConfirm() {
        this.selector = {
            id: '',
            amount: '',
            text: '',
            second_way: '',
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
        this.selector.amount = record.payWay == 'guazhang' ? record.amount : record.secondAmount;
        this.getUserInfo(record.userId,this.selector.amount);
    }

    confirm() {
        this.btnCanEdit = true;
        if(this.adminService.isFalse(this.selector.second_way)){
            this.toastTab('支付方式不可为空', 'error');
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
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
            }else{
                this.toastTab('支付成功', '');
                this.btnCanEdit = false;
                this.search();
            }
        }).catch(() => {
            this.toastTab('服务器错误', 'error');
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
                this.toastTab(data.errorMsg, 'error');
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
            this.toastTab('服务器错误', 'error');
        });
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
