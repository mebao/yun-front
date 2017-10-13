import { Component, OnInit }                     from '@angular/core';
import { Router }                                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-prescript-sale',
	templateUrl: './prescript-sale.component.html',
	styleUrls: ['./prescript-sale.component.scss'],
})
export class PrescriptSaleComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	url: string;
	plist: any[];
	medicalSupplies: any[];
	modalConfirmTab: boolean;
	selected: {
		text: string,
		plist: any[],
		// 总费用
		feeAll: string,
		// 折后价格
		saleFee: string,
	}
	sale: {
		type: string,
		user: {
			id: string,
			name: string,
			memberId: string,
			memberName: string,
			balance: string,
		},
		member: {
			id: string,
			name: string,
			prescript: string,
		},
		mobile: string,
		idcard: string,
		pay_way: string,
		// 是否可用余额支付
		balanceUse: string,
	}
	userList: any[];
	// 支付
	modalTab: boolean;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '药方列表',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.userList = [];

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token;

		// 初始化数据
		this.initData();

		// 获取诊所用户
		this.adminService.searchuser(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					for(var i = 0; i < results.users.length; i++){
						results.users[i].string = JSON.stringify(results.users[i]);
						results.users[i].key = JSON.stringify(results.users[i]);
						results.users[i].value = results.users[i].name + '(' + results.users[i].mobile + ')';
					}
				}
				this.userList = results.users;
			}
		});

		//查看库存
		var searchsuppliesUrl = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.searchsupplies(searchsuppliesUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.medicalSupplies = results.list;
			}
		});

	}

	initData() {
		this.plist = [{
			key: 1,
			show: true,
			use: true,
			ms: {
				days: '',
				frequency: '',
				num: '',
				oneNum: '',
				oneUnit: '',
				pid: '',
				pname: '',
				price: '',
				remark: '',
				sinfoId: '',
				unit: '',
				usage: '',
			},
			string: '',
		}];
		this.modalTab = false;

		this.sale = {
			type: '',
			user: {
				id: '',
				name: '',
				memberId: '',
				memberName: '',
				balance: '',
			},
			member: {
				id: '',
				name: '',
				prescript: '',
			},
			mobile: '',
			idcard: '',
			pay_way: '',
			balanceUse: '',
		}

		this.modalConfirmTab = false;
		this.selected = {
			text: '',
			plist: [],
			feeAll: '',
			saleFee: '',
		}
	}

	goUrl(url) {
		this.router.navigate([url]);
	}

	// 选择用户
	changeUser(value) {
		this.sale.mobile = JSON.parse(value).mobile;
		this.sale.user = JSON.parse(value);
		// 获取用户会员信息
		if(this.sale.user.memberId && this.sale.user.memberId != ''){
			var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId
				 + '&id=' + this.sale.user.memberId + '&status=1';
			this.adminService.memberlist(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.list.length > 0){
						this.sale.member = {
							id: results.list[0].id,
							name: results.list[0].name,
							prescript: this.adminService.toDecimal2(Number(results.list[0].prescript) / 100),
						}
					}
				}
			});
		}
	}

	showMs(_key) {
		if(this.plist.length > 0){
			for(var i = 0; i < this.plist.length; i++){
				if(this.plist[i].key == _key){
					this.plist[i].show = !this.plist[i].show;
				}
			}
		}
	}

	addMs() {
		this.plist.push({
			key: this.plist.length + 1,
			show: true,
			use: true,
			ms: {
				days: '',
				frequency: '',
				num: '',
				oneNum: '',
				oneUnit: '',
				pid: '',
				pname: '',
				price: '',
				remark: '',
				sinfoId: '',
				unit: '',
				usage: '',
			},
			string: '',
		});
	}

	deleteMs(_key) {
		if(this.plist.length > 0){
			for(var i = 0; i < this.plist.length; i++){
				if(this.plist[i].key == _key){
					this.plist[i].use = false;
				}
			}
		}
	}

	msChange(key, _value) {
		for(var i = 0; i < this.plist.length; i++){
			if(this.plist[i].key == key){
				this.plist[i].ms = JSON.parse(_value);
				this.plist[i].ms.oneNum = '';
				this.plist[i].ms.usage = '';
				this.plist[i].ms.frequency = '';
				this.plist[i].ms.days = '';
				this.plist[i].ms.num = '';
				this.plist[i].ms.remark = '';
			}
		}
	}

	create(f) {
		var plist = [];
		var num = 0;
		// 原价格
		var feeAll = 0;
		// 折后价格
		var saleFee = 0;
		if(this.plist.length > 0){
			for(var i = 0; i < this.plist.length; i++){
				//判断可用
				if(this.plist[i].use){
					num++;
					var p = {
						sinfo_id: '',
						name: '',
						unit: '',
						num: '',
						price: '',
						fee: '',
						canDiscount: '',
						discountFee: '',
					};
					if(f.value['ms_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条药品名不可为空', 'error');
						return;
					}
					p.sinfo_id = JSON.parse(f.value['ms_' + this.plist[i].key]).id;
					p.name = JSON.parse(f.value['ms_' + this.plist[i].key]).name;
					p.unit = JSON.parse(f.value['ms_' + this.plist[i].key]).unit;
					p.price = JSON.parse(f.value['ms_' + this.plist[i].key]).price;
					if(this.adminService.isFalse(f.value['num_' + this.plist[i].key])){
						this.toastTab('第' + num + '条药单总量不可为空', 'error');
						return;
					}
					if(Number(f.value['num_' + this.plist[i].key]) <= 0 || Number(f.value['num_' + this.plist[i].key]) % 1 != 0){
						this.toastTab('第' + num + '条药单总量应为大于0的整数', 'error');
						return;
					}
					p.num = f.value['num_' + this.plist[i].key];
					if(Number(JSON.parse(f.value['ms_' + this.plist[i].key]).price) == 0){
						this.selected = {
							text: p.name + '尚未设置售价，请先设置售价，再开方',
							plist: [],
							feeAll: '',
							saleFee: '',
						}
						this.modalConfirmTab = true;
						return;
					}
					if(Number(p.num) > Number(JSON.parse(f.value['ms_' + this.plist[i].key]).stock)){
						this.selected = {
							text: p.name + '库存' + JSON.parse(f.value['ms_' + this.plist[i].key]).stock + p.unit + '，所选药品数量超过库存现有量',
							plist: [],
							feeAll: '',
							saleFee: '',
						}
						this.modalConfirmTab = true;
						return;
					}
					// 费用
					p.fee = this.adminService.toDecimal2(Number(p.num) * parseFloat(p.price));
					p.canDiscount = JSON.parse(f.value['ms_' + this.plist[i].key]).canDiscount;
					// 折扣价
					if(p.canDiscount == '1' && this.sale.member.id != ''){
						p.discountFee = this.adminService.toDecimal2(parseFloat(p.fee) * parseFloat(this.sale.member.prescript));
					}else{
						p.discountFee = p.fee;
					}
					plist.push(p);
					feeAll += parseFloat(p.fee);
					saleFee += parseFloat(p.discountFee);
				}
			}
		}
		// 是否是诊所用户
		if(this.sale.user.id != ''){
			if(parseFloat(this.sale.user.balance) < saleFee){
				this.sale.balanceUse = '余额不足';
			}
		}else{
			this.sale.balanceUse = '不是诊所用户';
		}
		this.selected = {
			text: '',
			plist: plist,
			feeAll: this.adminService.toDecimal2(feeAll),
			saleFee: this.adminService.toDecimal2(saleFee),
		};

		this.modalTab = true;
	}

	// 支付
	close() {
		this.modalTab = false;
	}

	confirm() {
		if(this.sale.pay_way == ''){
			this.toastTab('支付方式不可为空', 'error');
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			pay_way: this.sale.pay_way,
			need_amount: this.selected.feeAll,
			amount: this.selected.saleFee,
			give_amount: 0,
			plist: JSON.stringify(this.selected.plist),
			user_id: this.sale.user.id,
			user_name: this.sale.user.name,
			mobile: this.sale.mobile,
			idcard: this.sale.idcard,
		}

		this.modalTab = false;

		this.adminService.drugretail(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('支付成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/prescriptSaleList']);
				}, 2000);
			}
		});
	}

	// 提示性消息
	closeConfirm() {
		this.modalConfirmTab = false;
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