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
	prescriptInfo: {
		name: string,
		remark: string,
	}

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
			'两天一次',
			'每周两次',
			'每周一次',
			'需要时',
			'立即',
			'睡前',
			'每天一次',
			'每天两次',
			'每日二次',
			'每日1次',
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

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
			this.doctorId = params.doctorId;
			this.prescriptId = params.prescriptId;
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
						show: true,
						use: true,
						ms: sessionPrescript.info[i],
						string: '',
					}
					this.plist.push(p);
				}
			}
			console.log(this.plist);
		}else{
			this.editType = 'create';

			this.plist.push({
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
		var searchsuppliesUrl = this.url;
		this.adminService.searchsupplies(searchsuppliesUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
						//修改时，需要获取数据
						if(this.editType == 'update'){
							for(var j = 0; j < this.plist.length; j++){
								if(results.list[i].id == this.plist[j].ms.sinfoId){
									this.plist[j].string = results.list[i].string;
								}
							}
						}
					}
				}
				this.medicalSupplies = results.list;
				console.log(this.plist);
			}
		})
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
			}
		}
		console.log(this.plist);
	}

	create(f) {
		var plist = [];
		var num = 0;
		var feeAll = 0;
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
						one_num: '',
						one_unit: '',
						usage: '',
						frequency: '',
						days: '',
						remark: '',
					};
					if(f.value['ms_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条药品名不可为空', 'error');
						return;
					}
					p.sinfo_id = JSON.parse(f.value['ms_' + this.plist[i].key]).id;
					p.name = JSON.parse(f.value['ms_' + this.plist[i].key]).name;
					p.unit = JSON.parse(f.value['ms_' + this.plist[i].key]).unit;
					p.one_unit = JSON.parse(f.value['ms_' + this.plist[i].key]).oneUnit;
					p.price = JSON.parse(f.value['ms_' + this.plist[i].key]).price;
					if(f.value['one_num_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条单位剂量不可为空', 'error');
						return;
					}
					p.one_num = f.value['one_num_' + this.plist[i].key];
					if(f.value['usage_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条用法不可为空', 'error');
						return;
					}
					p.usage = f.value['usage_' + this.plist[i].key];
					if(f.value['frequency_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条用药频次不可为空', 'error');
						return;
					}
					p.frequency = f.value['frequency_' + this.plist[i].key];
					if(f.value['days_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条天数不可为空', 'error');
						return;
					}
					p.days = f.value['num_' + this.plist[i].key];
					if(f.value['days_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条药单数量不可为空', 'error');
						return;
					}
					p.num = f.value['num_' + this.plist[i].key];
					p.remark = f.value['remark_' + this.plist[i].key] ? f.value['remark_' + this.plist[i].key] : '';
					plist.push(p);
					feeAll += Number(JSON.parse(f.value['ms_' + this.plist[i].key]).price) * Number(p.num); 
				}
			}
		}
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
				name: f.value.name,
				plist: JSON.stringify(plist),
				remark: f.value.remark,
				fee: feeAll,
			}

			this.adminService.doctorprescript(params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('开方成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
					}, 2000);
				}
			})
		}else{
			console.log(plist);
			var updateParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				name: f.value.name,
				plist: JSON.stringify(plist),
				remark: f.value.remark,
				fee: feeAll,
			}
			this.adminService.updateprescript(this.prescriptId, updateParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('药方修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
					}, 2000);
				}
			})
		}
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