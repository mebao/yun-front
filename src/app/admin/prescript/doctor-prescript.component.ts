import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-doctor-prescript',
	templateUrl: './doctor-prescript.component.html',
	styleUrls: ['./doctor-prescript.component.scss'],
})
export class DoctorPrescriptComponent{
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
	id: string;
	doctorId: string;
	prescriptId: string;
	canEdit: boolean;
	bookingInfo: {
		age: string,
		bookingDate: string,
		bookingId: string,
		childId: string,
		childName: string,
		creatorId: string,
		creatorName: string,
		refNo: string,
		serviceId: string,
		serviceName: string,
		time: string,
		type: string,
		userDoctorId: string,
		userDoctorName: string,
		services: any[],
		fees: any[],
	};
	plist: any[];
	medicalSupplies: any[];
	usagelsit: any[];
	frequencylist: any[];
	editType: string;
	secondType: string;
	prescriptInfo: {
		name: string,
		remark: string,
	}
	modalConfirmTab: boolean;
	selected: {
		text: string,
	}
	numberList: any[];
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '开方',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.bookingInfo = {
			age: '',
			bookingDate: '',
			bookingId: '',
			childId: '',
			childName: '',
			creatorId: '',
			creatorName: '',
			refNo: '',
			serviceId: '',
			serviceName: '',
			time: '',
			type: '',
			userDoctorId: '',
			userDoctorName: '',
			services: [],
			fees: [],
		};

		//用法
		this.usagelsit = [
			'每天四次',
			'每天三次',
			'每天两次',
			'每天一次',
			'两天一次',
			'每周两次',
			'每周一次',
			'需要时',
			'立即',
			'睡前',
			'饭前',
			'空腹',
			'饭后',
			'饭中',
			'必要时',
			'bid',
			'晚睡前',
			'Qd',
			'Tid',
			'Q2h',
			'Q4h',
			'Q6h',
			'Q8h',
			'QN',
			'Q2D',
		];

		//用药频次
		this.frequencylist = [
			'口服',
			'注射',
			'静脉滴注',
			'静脉注射',
			'舌下含服',
			'皮下注射',
			'滴入',
			'塞肛用',
			'阴道用',
			'外用',
			'肌肉注射',
			'皮内注射',
			'吸入',
			'滴耳',
			'滴鼻',
			'滴眼',
			'嚼服',
			'静滴',
			'高压泵雾化吸入',
			'纳肛',
			'喷鼻',
			'雾化吸入',
			'外涂',
			'含漱',
			'煎服',
			'滴左眼',
			'局部封闭',
			'先煎',
			'后下',
			'单煎',
			'包煎',
			'劈开',
			'打碎',
			'烊化',
			'冲服',
			'研磨冲服',
			'煎汤代水饮',
			'另煎',
			'捣碎',
			'生汁兑入',
			'另煎后兑入',
			'溶化',
			'煎汤代水',
			'烊化冲入',
			'作丸内服',
			'直接服用',
			'温水助服',
			'泡水',
			'生吃',
			'水煎服两次服用',
			'碾碎分两次服用',
			'外敷',
			'合药冲服',
			'水煎服',
			'副药',
		];

		this.numberList = [];
		for(var i = 1; i < 21; i++){
			this.numberList.push({key: i, value: i});
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
			this.doctorId = params.doctorId;
			this.prescriptId = params.prescriptId;
			this.secondType = params.type ? params.type : '';
		});

		this.plist = [];
		this.prescriptInfo = {
			name: '',
			remark: '',
		}

		//判断创建或修改
		if(this.prescriptId && this.prescriptId != ''){
			this.editType = 'update';
			var sessionPrescript = JSON.parse(sessionStorage.getItem('prescript'));
			this.prescriptInfo = {
				name: sessionPrescript.name,
				remark: sessionPrescript.remark,
			}
			if(sessionPrescript.info.length > 0){
				for(var i = 0; i < sessionPrescript.info.length; i++){
					var p = {
						key: this.plist.length + 1,
						show: this.secondType == '' || this.secondType == 'back' || this.secondType == 'update',
						use: true,
						ms: sessionPrescript.info[i],
						batchList: [],
						bak: JSON.stringify(sessionPrescript.info[i]),
						string: '',
					}
					this.plist.push(p);
				}
			}
			// 如果加药，
			if(this.secondType == 'continueAdd'){
				this.addMs();
			}
		}else{
			this.editType = 'create';

			this.plist.push({
				key: 1,
				show: true,
				use: true,
				ms: {
					batch: '',
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
					ms_usage: '',
				},
				batchList: [],
				string: '',
			});
		}

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;

		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if((new Date().getTime() - 24*60*60*1000) > new Date(results.weekbooks[0].bookingDate).getTime()){
					this.canEdit = false;
				}else{
					this.canEdit = true;
				}
				this.bookingInfo = results.weekbooks[0];
			}
		})

		//查看库存
		var searchsuppliesUrl = this.url + '&type=1,2';
		this.adminService.searchsupplies(searchsuppliesUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					results.list.sort(this.adminService.compare);
					for(var i = 0; i < results.list.length; i++){
						if(results.list[i].others.length > 0){
							for(var j = 0; j < results.list[i].others.length; j++){
								results.list[i].others[j].string = JSON.stringify(results.list[i].others[j]);
								//修改时，需要获取药品、批次数据
								if(this.editType == 'update'){
									for(var k = 0; k < this.plist.length; k++){
										if(results.list[i].others[j].id == this.plist[k].ms.sinfoId){
											this.plist[k].batchList = results.list[i].others;
											this.plist[k].ms.batch = results.list[i].others[j].string;
											this.plist[k].ms.ms_usage = results.list[i].usage;
										}
									}
								}
							}
						}
						results.list[i].string = JSON.stringify(results.list[i]);
						//修改时，需要获取药品、批次数据
						if(this.editType == 'update'){
							if(results.list[i].others.length > 0){
								for(var j = 0; j < results.list[i].others.length; j++){
									for(var k = 0; k < this.plist.length; k++){
										if(results.list[i].others[j].id == this.plist[k].ms.sinfoId){
											this.plist[k].string = results.list[i].string;
										}
									}
								}
							}
						}
					}
				}
				this.medicalSupplies = results.list;
			}
		});

		this.modalConfirmTab = false;
		this.selected = {
			text: '',
		}

		this.btnCanEdit = false;
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
				batch: '',
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
				ms_usage: '',
				isOut: '',
			},
			batchList: [],
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
				// 兼容select-search
				var oneNum = this.plist[i].ms.oneNum;
				var days = this.plist[i].ms.days;
				var num = this.plist[i].ms.num;
				this.plist[i].ms = JSON.parse(_value);
				this.plist[i].ms.batch = '';
				this.plist[i].ms.oneNum = oneNum;
				this.plist[i].ms.usage = '';
				this.plist[i].ms.frequency = '';
				this.plist[i].ms.days = days;
				this.plist[i].ms.num = num;
				this.plist[i].ms.remark = '';
				this.plist[i].ms.ms_usage = JSON.parse(_value).usage;
				this.plist[i].ms.isOut = '';
				this.plist[i].batchList = JSON.parse(_value).others;
			}
		}
	}

	changeNumber(_value, index, key) {
		this.plist[index - 1].ms[key] = _value;
	}

	create(f) {
		this.btnCanEdit = true;
		//新增或修改或再次加药
		if(this.secondType == '' || this.secondType == 'update' || this.secondType == 'continueAdd'){
			var plist = [];
			var num = 0;
			var feeAll = 0;
			if(this.plist.length > 0){
				for(var i = 0; i < this.plist.length; i++){
					//判断可用或未出药
					if(this.plist[i].use && (this.plist[i].ms.isOut == '' || (this.plist[i].ms.isOut == '0' && this.secondType == 'update'))){
						num++;
						var p = {
							sinfo_id: '',
							name: '',
							unit: '',
							num: '',
							price: '',
							one_num: '',
							one_unit: '',
							usage: '',
							frequency: '',
							days: '',
							remark: '',
						};
						this.plist[i].ms.remark = this.adminService.trim(this.plist[i].ms.remark);
						if(this.plist[i].string == ''){
							this.toastTab('第' + num + '条药品名不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						if(this.adminService.isFalse(this.plist[i].ms.batch)){
							this.toastTab('第' + num + '条批次不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						p.sinfo_id = JSON.parse(this.plist[i].ms.batch).id;
						p.name = JSON.parse(this.plist[i].string).name;
						p.unit = JSON.parse(this.plist[i].string).unit;
						p.one_unit = JSON.parse(this.plist[i].string).oneUnit;
						if(this.adminService.isFalse(this.plist[i].ms.oneNum)){
							this.toastTab('第' + num + '条单位剂量不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						if(parseFloat(this.plist[i].ms.oneNum) <= 0){
							this.toastTab('第' + num + '条单位剂量应大于0', 'error');
							this.btnCanEdit = false;
							return;
						}
						p.one_num = this.plist[i].ms.oneNum;
						if(!(this.plist[i].ms.usage) || this.plist[i].ms.usage == ''){
							this.toastTab('第' + num + '条用法不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						p.usage = this.plist[i].ms.usage;
						if(!(this.plist[i].ms.frequency) || this.plist[i].ms.frequency == ''){
							this.toastTab('第' + num + '条用药频次不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						p.frequency = this.plist[i].ms.frequency;
						if(this.adminService.isFalse(this.plist[i].ms.days)){
							this.toastTab('第' + num + '条天数不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						if(Number(this.plist[i].ms.days) <=0 || Number(this.plist[i].ms.days) % 1 != 0){
							this.toastTab('第' + num + '条天数应为大于0的整数', 'error');
							this.btnCanEdit = false;
							return;
						}
						p.days = this.plist[i].ms.days;
						if(this.adminService.isFalse(this.plist[i].ms.num)){
							this.toastTab('第' + num + '条药单总量不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						if(Number(this.plist[i].ms.num) <= 0 || Number(this.plist[i].ms.num) % 1 != 0){
							this.toastTab('第' + num + '条药单总量应为大于0的整数', 'error');
							this.btnCanEdit = false;
							return;
						}
						p.num = this.plist[i].ms.num;
						if(Number(JSON.parse(this.plist[i].ms.batch).price) == 0){
							this.selected = {
								text: p.name + JSON.parse(this.plist[i].ms.batch).batch + '批次，尚未设置售价，请先设置售价，再开方',
							}
							this.modalConfirmTab = true;
							this.btnCanEdit = false;
							return;
						}
						p.price = JSON.parse(this.plist[i].ms.batch).price;
						if(Number(p.num) > Number(JSON.parse(this.plist[i].ms.batch).stock)){
							this.selected = {
								text: p.name + JSON.parse(this.plist[i].ms.batch).batch + '批次，库存' + JSON.parse(this.plist[i].ms.batch).stock + p.unit + '，所选药品数量超过库存现有量',
							}
							this.modalConfirmTab = true;
							this.btnCanEdit = false;
							return;
						}
						p.remark = this.plist[i].ms.remark ? this.plist[i].ms.remark : '';
						plist.push(p);
						feeAll += parseFloat(JSON.parse(this.plist[i].ms.batch).price) * Number(p.num);
					}else if(this.plist[i].use){
						feeAll += parseFloat(this.plist[i].ms.price) * Number(this.plist[i].ms.num);
					}
				}
			}
			if(this.secondType == '' || this.secondType == 'update'){
				if(this.editType == 'create'){
					var params = {
						username: this.adminService.getUser().username,
						token: this.adminService.getUser().token,
						clinic_id: this.adminService.getUser().clinicId,
						booking_id: this.bookingInfo.bookingId,
						user_id: this.bookingInfo.creatorId,
						user_name: this.bookingInfo.creatorName,
						child_id: this.bookingInfo.childId,
						child_name: this.bookingInfo.childName,
						name: '',
						plist: JSON.stringify(plist),
						remark: this.adminService.trim(f.value.remark),
						fee: feeAll.toString(),
					}

					this.adminService.doctorprescript(params).then((data) => {
						if(data.status == 'no'){
							this.toastTab(data.errorMsg, 'error');
							this.btnCanEdit = false;
						}else{
							this.toastTab('开方成功', '');
							setTimeout(() => {
								this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
							}, 2000);
						}
					})
				}else{
					var updateParams = {
						username: this.adminService.getUser().username,
						token: this.adminService.getUser().token,
						name: '',
						plist: JSON.stringify(plist),
						remark: f.value.remark,
						fee: feeAll,
					}
					this.adminService.updateprescript(this.prescriptId, updateParams).then((data) => {
						if(data.status == 'no'){
							this.toastTab(data.errorMsg, 'error');
							this.btnCanEdit = false;
						}else{
							this.toastTab('药方修改成功', '');
							setTimeout(() => {
								this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
							}, 2000);
						}
					})
				}
			}else{
				var addParams = {
					username: this.adminService.getUser().username,
					token: this.adminService.getUser().token,
					fee: feeAll,
					plist: JSON.stringify(plist),
				}
				this.adminService.adddrug(this.prescriptId, addParams).then((data) => {
					if(data.status == 'no'){
						this.toastTab(data.errorMsg, 'error');
					}else{
						this.toastTab('药品添加成功', '');
						setTimeout(() => {
							this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
						}, 2000);
					}
				});
			}
		}else{
			//退药逻辑，填写需要退多少量的药品，计算剩下的药品
			if(this.plist.length > 0){
				var backPlist = [];
				var hasBack = false;
				var feeAll = 0;
				for(var i = 0; i < this.plist.length; i++){
					//判断该药品是否退药
					var backP = {
						id: this.plist[i].ms.pid,
						num: '',
						remark: this.plist[i].ms.remark,
					}
					if(this.plist[i].use){
						hasBack = true;
						//判断是否填写
						if(this.plist[i].ms.num == ''){
							this.toastTab(this.plist[i].ms.pname + '退药数量不可为空', 'error');
							this.btnCanEdit = false;
							return;
						}
						if(Number(this.plist[i].ms.num) > JSON.parse(this.plist[i].bak).num){
							this.toastTab(this.plist[i].ms.pname + '退药数量大于开药数量', 'error');
							this.btnCanEdit = false;
							return;
						}
						backP.num = (Number(JSON.parse(this.plist[i].bak).num) - Number(this.plist[i].ms.num)).toString();
					}else{
						backP.num = JSON.parse(this.plist[i].bak).num;
					}
					backPlist.push(backP);
					feeAll += Number(backP.num) * Number(this.plist[i].ms.price);
				}
				if(!hasBack){
					this.toastTab('未选择退药信息', 'error');
					this.btnCanEdit = false;
					return;
				}
				if(f.value.remark == ''){
					this.toastTab('退药说明不可为空', 'error');
					this.btnCanEdit = false;
					return;
				}
				var backParams = {
					username: this.adminService.getUser().username,
					token: this.adminService.getUser().token,
					id: this.prescriptId,
					plist: JSON.stringify(backPlist),
					fee: feeAll.toString(),
					remark: f.value.remark,
				}

				this.adminService.doctorback(this.prescriptId, backParams).then((data) => {
					if(data.status == 'no'){
						this.toastTab(data.errorMsg, 'error');
						this.btnCanEdit = false;
					}else{
						this.toastTab('退药成功', '');
						setTimeout(() => {
							this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
						}, 2000);
					}
				});
			}
		}
	}

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
