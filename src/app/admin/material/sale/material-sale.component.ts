import { Component, OnInit }                     from '@angular/core';
import { Router }                                from '@angular/router';

import { NzMessageService }                      from 'ng-zorro-antd';

import { AdminService }                          from '../../admin.service';

@Component({
	selector: 'app-material-sale',
	templateUrl: './material-sale.component.html',
})
export class MaterialSaleComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	url: string;
	plist: any[];
	materialSupplies: any[];
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
			mobile: string,
			userBalance: string,
			memberList: any[],
		},
		member: {
			id: string,
			name: string,
			prescript: string,
		},
		selectedMember: string,
		selectedMemberJson: any,
		mobile: string,
		idcard: string,
		pay_way: string,
		// 是否可用余额支付
		balanceUse: string,
	}
	userList: any[];
	// 支付
	modalTab: boolean;
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '物资零售',
			back: true,
		}

		this.userList = [];
		this.plist = [];

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		// 初始化数据
		this.initData();

		// 获取诊所用户
		this.adminService.searchuser(this.url).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.users.length > 0){
					for(var i = 0; i < results.users.length; i++){
						var _memberList = [];
						if(results.users[i].members.length > 0){
							for(var member of results.users[i].members){
								if(member.canUse == '1'){
									_memberList.push(member);
								}
							}
						}
						results.users[i].memberList = _memberList;
					}
				}
				this.userList = results.users;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});

		//查看库存
		this.adminService.searchsupplies(this.url + '&type=3,4').then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.materialSupplies = results.list;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});

		this.btnCanEdit = false;
	}

	initData() {
		this.addMs();
		this.modalTab = false;

		this.sale = {
			type: '',
			user: {
				id: '',
				name: '',
				mobile: '',
				userBalance: '',
				memberList: [],
			},
			member: {
				id: '',
				name: '',
				prescript: '',
			},
			selectedMember: '',
			selectedMemberJson: {},
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
	changeUser() {
		if(this.sale.user != null){
			if(this.sale.user.memberList.length > 0){
				for(var i = 0; i < this.sale.user.memberList.length; i++){
					this.sale.user.memberList[i].string = JSON.stringify(this.sale.user.memberList[i]);
				}
			}
			this.sale.mobile = this.sale.user.mobile;
			this.sale.user = this.sale.user;
		}
	}

	// 选择会员卡
	changeMember() {
		// 获取用户会员信息
		if(this.sale.selectedMember != null){
			this.sale.selectedMemberJson = this.sale.selectedMember;
			var urlOptions = this.url + '&id=' + this.sale.selectedMemberJson.memberId + '&status=1';
			this.adminService.memberlist(urlOptions).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
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
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}else{
			this.sale.selectedMemberJson = {};
			this.sale.member = {
				id: '',
				name: '',
				prescript: '',
			}
		}
	}

	addMs() {
		this.plist.push({
			ms: {
				num: '',
				unit: '',
				others: [],
			},
		});
	}

	deleteMs(_index) {
		this.plist.splice(_index, 1);
	}

	msChange(_index, value) {
		this.plist[_index].ms = value;
		this.plist[_index].ms.num = '';
	}

	create() {
		var plist = [];
		var num = 0;
		// 原价格
		var feeAll = 0;
		// 折后价格
		var saleFee = 0;
		if(this.plist.length > 0){
			for(var i = 0; i < this.plist.length; i++){
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
				if(this.plist[i].ms.name == ''){
					this._message.error('第' + num + '条物资不可为空');
					return;
				}
				if(this.plist[i].ms.others.length == 0){
					this._message.error('第' + num + '条物资信息错误，不可零售');
					return;
				}
				p.sinfo_id = this.plist[i].ms.others[0].id;
				p.name = this.plist[i].ms.name;
				p.unit = this.plist[i].ms.unit;
				if(this.adminService.isFalse(this.plist[i].ms.num)){
					this._message.error('第' + num + '条物资总量不可为空');
					return;
				}
				if(Number(this.plist[i].ms.num) <= 0 || Number(this.plist[i].ms.num) % 1 != 0){
					this._message.error('第' + num + '条物资总量应为大于0的整数');
					return;
				}
				p.num = this.plist[i].ms.num;
				if(Number(this.plist[i].ms.others[0].price) == 0){
					this.selected = {
						text: p.name + '，尚未设置售价，请先设置售价，再出售',
						plist: [],
						feeAll: '',
						saleFee: '',
					}
					this.modalConfirmTab = true;
					return;
				}
				p.price = this.plist[i].ms.others[0].price;
				if(Number(p.num) > Number(this.plist[i].ms.others[0].stock)){
					this.selected = {
						text: p.name + '，库存' + this.plist[i].ms.others[0].stock + p.unit + '，所选物资数量超过库存现有量',
						plist: [],
						feeAll: '',
						saleFee: '',
					}
					this.modalConfirmTab = true;
					return;
				}
				// 费用
				p.fee = this.adminService.toDecimal2(Number(p.num) * parseFloat(p.price));
				p.canDiscount = this.plist[i].ms.others[0].canDiscount;
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
		// 是否是诊所用户
		if(this.sale.user.id != ''){
			if(parseFloat(this.sale.selectedMemberJson.balance ? this.sale.selectedMemberJson.balance : '0.00') < saleFee){
				this.sale.balanceUse = '余额不足';
			}else{
				this.sale.balanceUse = '';
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
		this.sale.pay_way = (this.sale.pay_way == null ? '' : null);
		this.modalTab = false;
	}

	confirm() {
		this.btnCanEdit = true;
		if(this.sale.pay_way == ''){
			this._message.error('支付方式不可为空');
			this.btnCanEdit = false;
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			pay_way: this.sale.pay_way.indexOf('member_') == -1 ? this.sale.pay_way : 'member',
			um_id: this.sale.pay_way.split('_')[1],
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
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('支付成功');
				setTimeout(() => {
					this.router.navigate(['./admin/material/sale/list']);
				}, 2000);
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	// 提示性消息
	closeConfirm() {
		this.modalConfirmTab = false;
	}
}
