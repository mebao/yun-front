import { Component, OnInit }                     from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
import { Router, ActivatedRoute }                from '@angular/router';

import { NzMessageService }                      from 'ng-zorro-antd';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-doctor-prescript',
	templateUrl: './doctor-prescript.component.html',
	styleUrls: ['./doctor-prescript.component.scss', '../../../assets/css/ant-common.scss'],
})
export class DoctorPrescriptComponent{
	topBar: {
		title: string,
		back: boolean,
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
	medicalSupplies: any[];
	usagelsit: any[];
	frequencylist: any[];
	editType: string;
	secondType: string;
	modalConfirmTab: boolean;
	selected: {
		text: string,
	}
	numberList: any[];
	oneNumList: any[];
    oneNumOldList: any[];
	// 不可连续点击
	isLoadingSave: boolean;
	createTab: boolean;
	form: any;
	actualOperator: {
		use: boolean,
		name: string,
	}
    validateForm: FormGroup;
    // 已选中药品
	mPrescriptList: any[];
    // 药方中药品
    mPrescriptInfoList: any[];
    // 删除的药品
    mPrescriptDelList: any[];

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
		private _message: NzMessageService,
        private fb: FormBuilder,
	) {
        this.validateForm = this.fb.group({
			remark: [ '', [ Validators.required ]],
		});
	}

	ngOnInit() {
		this.topBar = {
			title: '开方',
			back: true,
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
		this.frequencylist = [
			'每天五次',
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
		this.usagelsit = [
			'口服',
			'注射',
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
			'纳肛',
			'喷鼻',
			'雾化吸入',
			'外涂',
			'含漱',
			'外敷',
			'PO',
			'喷喉'
		];

		this.numberList = [];
		this.oneNumList = [];
        this.oneNumOldList = [];
		for(var i = 1; i < 21; i++){
			this.numberList.push({key: i, value: i});
			this.oneNumList.push({key: i.toString(), value: i.toString()});
			this.oneNumOldList.push({key: i.toString(), value: i.toString()});
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
			this.doctorId = params.doctorId;
			this.prescriptId = params.prescriptId;
			this.secondType = params.type ? params.type : '';
		});

		//判断创建或修改
		this.mPrescriptList = [];
        this.mPrescriptInfoList = [];
        this.mPrescriptDelList = [];
		if(this.prescriptId && this.prescriptId != ''){
			this.editType = 'update';
			var sessionPrescript = JSON.parse(sessionStorage.getItem('prescript'));
            this.validateForm.controls.remark.setValue(sessionPrescript.remark);
			if(sessionPrescript.info.length > 0){
				for(var i = 0; i < sessionPrescript.info.length; i++){
                    var mInfo = {
                        medical: {},
                        batch: {},
                        pid: sessionPrescript.info[i].pid,
                        sinfoId: sessionPrescript.info[i].sinfoId,
                        oneNum: sessionPrescript.info[i].oneNum,
                        oneUnit: sessionPrescript.info[i].oneUnit,
                        frequency: sessionPrescript.info[i].frequency,
                        usage: sessionPrescript.info[i].usage,
                        days: sessionPrescript.info[i].days,
                        num: sessionPrescript.info[i].num,
                        unit: sessionPrescript.info[i].unit,
                        ms_usage: '',
                        remark: sessionPrescript.info[i].remark,
                        isOut: sessionPrescript.info[i].isOut,
                    }
                    this.mPrescriptInfoList.push(mInfo);
				}
			}
		}else{
			this.editType = 'create';
    		this.addField(null);
		}

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;

		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
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
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					results.list.sort(this.adminService.compare);
					for(var i = 0; i < results.list.length; i++){
						// 处理库存信息，若批次库存为0，则不显示
						var item = results.list[i];
						var itemInfo = [];
						for(var j = 0; j < results.list[i].others.length; j++){
							//修改时，需要获取药品、批次数据
							if(this.editType == 'update'){
								for(var k = 0; k < this.mPrescriptInfoList.length; k++){
									if(results.list[i].others[j].id == this.mPrescriptInfoList[k].sinfoId){
										this.mPrescriptInfoList[k].batch = results.list[i].others[j];
                                        this.mPrescriptInfoList[k].selectedBatch = results.list[i].others[j];
										this.mPrescriptInfoList[k].ms_usage = results.list[i].usage;
									}
								}
							}
                            // 库存不为0，则获取
							if(results.list[i].others[j].stock != '0'){
								itemInfo.push(results.list[i].others[j]);
							}
						}
						//修改时，需要获取药品、批次数据
						if(this.editType == 'update'){
							if(results.list[i].others.length > 0){
								for(var j = 0; j < results.list[i].others.length; j++){
									for(var k = 0; k < this.mPrescriptInfoList.length; k++){
										if(results.list[i].others[j].id == this.mPrescriptInfoList[k].sinfoId){
											this.mPrescriptInfoList[k].medical = results.list[i];
										}
									}
								}
							}
						}
						if(results.list[i].others.length > 0){
	                        item.others = itemInfo;
                        }
					}
                    //修改时，需要获取药品、批次数据
                    if(this.editType == 'update'){
                        for(var index in this.mPrescriptInfoList){
                            this.addField(this.mPrescriptInfoList[index]);
                        }
                    }
        			// 如果加药，
        			if(this.secondType == 'continueAdd'){
        				this.addField(null);
        			}
				}
				this.medicalSupplies = results.list;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}

		this.modalConfirmTab = false;
		this.selected = {
			text: '',
		}

		this.isLoadingSave = false;
		this.createTab = false;
		this.form = '';
	}

    addField(medical, e?: MouseEvent) {
        if (e) {
          e.preventDefault();
        }
        const id = (this.mPrescriptList.length > 0) ? this.mPrescriptList[this.mPrescriptList.length - 1].id + 1 : 0;
        const medical_info = {
            id: id,
            isActive: medical == null ? true : (this.secondType == 'continueAdd' ? false : true),
            medical: `medical${id}`,
			batch: `batch${id}`,
			batchList: medical == null ? [] : medical.medical.others,
            selectedBatch: medical == null ? {} : medical.selectedBatch,
            pid: medical == null ? '' : medical.pid,
			oneNum: `oneNum${id}`,
			oneUnit: `oneUnit${id}`,
			selectedOneUnit: medical == null ? '' : medical.oneUnit,
			frequency: `frequency${id}`,
			usage: `usage${id}`,
			days: `days${id}`,
			num: `num${id}`,
            bakNum: `bakNum${id}`,
			unit: `unit${id}`,
			selectedUnit: medical == null ? '' : medical.unit,
			ms_usage: `ms_usage${id}`,
			remark: `remark${id}`,
			isOut: medical == null ? '' : medical.isOut,
        };
        const index = this.mPrescriptList.push(medical_info);
        this.validateForm.addControl(this.mPrescriptList[index - 1].medical, new FormControl(medical == null ? '' : medical.medical, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].batch, new FormControl(medical == null ? '' : medical.batch, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].oneNum, new FormControl(medical == null ? '' : medical.oneNum, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].oneUnit, new FormControl(medical == null ? '' : medical.oneUnit, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].frequency, new FormControl(medical == null ? '' : medical.frequency, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].usage, new FormControl(medical == null ? '' : medical.usage, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].days, new FormControl(medical == null ? '' : Number(medical.days), Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].num, new FormControl(medical == null ? '' : Number(medical.num), Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].bakNum, new FormControl(medical == null ? '' : Number(medical.num), Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].unit, new FormControl(medical == null ? '' : medical.unit, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].ms_usage, new FormControl(medical == null ? '' : medical.ms_usage, Validators.required));
        this.validateForm.addControl(this.mPrescriptList[index - 1].remark, new FormControl(medical == null ? '' : medical.remark, Validators.required));
        if(medical != null){
            if(this.oneNumList.indexOf({key: medical.oneNum, value: medical.oneNum}) == -1){
                this.oneNumList.push({key: medical.oneNum, value: medical.oneNum});
                this.oneNumOldList.push({key: medical.oneNum, value: medical.oneNum});
            }
        }
    }

    removeField(i) {
        this.mPrescriptDelList.push(i);
        if (this.mPrescriptList.length > 0) {
            const index = this.mPrescriptList.indexOf(i);
            this.mPrescriptList.splice(index, 1);
            if(this.secondType != 'back'){
                this.validateForm.removeControl(i.medical);
                this.validateForm.removeControl(i.batch);
                this.validateForm.removeControl(i.oneNum);
                this.validateForm.removeControl(i.oneUnit);
                this.validateForm.removeControl(i.frequency);
                this.validateForm.removeControl(i.usage);
                this.validateForm.removeControl(i.days);
                this.validateForm.removeControl(i.num);
    			this.validateForm.removeControl(i.unit);
    			this.validateForm.removeControl(i.ms_usage);
    			this.validateForm.removeControl(i.remark);
            }
        }
    }

	msChange(_index) {
        var selectedOneUnit = this.validateForm.controls['medical' + _index].value.oneUnit ? this.validateForm.controls['medical' + _index].value.oneUnit : '';
        var selectedUnit = this.validateForm.controls['medical' + _index].value.unit ? this.validateForm.controls['medical' + _index].value.unit : '';
        var selectedUsage = this.validateForm.controls['medical' + _index].value.usage ? this.validateForm.controls['medical' + _index].value.usage : '';
		this.mPrescriptList[_index].batchList = this.validateForm.controls['medical' + _index].value.others;
        this.mPrescriptList[_index].selectedOneUnit = selectedOneUnit;
        this.mPrescriptList[_index].selectedUnit = selectedUnit;
        this.validateForm.controls['oneUnit' + _index].setValue(selectedUnit);
        this.validateForm.controls['unit' + _index].setValue(selectedUnit);
        this.validateForm.controls['ms_usage' + _index].setValue(selectedUsage);
	}

    searchOneNum(_value) {
        if(this.oneNumList.indexOf({key: _value, value: _value}) == -1){
            this.oneNumList = JSON.parse(JSON.stringify(this.oneNumOldList));
            this.oneNumList.push({key: _value, value: _value});
        }
    }

	confirmCreate(){
		this.createTab = true;
		var p = '';
		for(var i = 0; i < this.mPrescriptList.length; i++){
            var index = this.mPrescriptList[i].id;
			p += this.validateForm.controls['medical' + index].value.name + '（' + this.validateForm.controls['num' + index].value + this.validateForm.controls['unit' + index].value + '），';
		}
		if(p == ''){
			this.selected = {
				text: '暂无退药',
			}
		}else{
			this.selected = {
				text: '将' + p.toString().substring(0, p.length - 1) + '退回到药品库？',
			}
		}

		this.modalConfirmTab = true;
	}

	//确认退药
	confirmPre(){
        this.isLoadingSave = false;
        this.modalConfirmTab = false;
        //退药逻辑，填写需要退多少量的药品，计算剩下的药品
        if(this.mPrescriptList.length > 0){
            var backPlist = [];
            var hasBack = false;
            var feeAll = 0;
            for(var i = 0; i < this.mPrescriptList.length; i++){
                var index = this.mPrescriptList[i].id;
                //判断该药品是否退药
                var backP = {
                    id: this.mPrescriptList[i].pid,
                    num: '',
                    remark: this.validateForm.controls['remark' + index].value,
                }
                hasBack = true;
                //判断是否填写
                if(this.validateForm.controls['num' + index].value == ''){
                    this._message.error(this.validateForm.controls['medical' + index].value.name + '退药数量不可为空');
                    this.isLoadingSave = false;
                    return;
                }
                if(Number(this.validateForm.controls['num' + index].value) > Number(this.validateForm.controls['bakNum' + index].value)){
                    this._message.error(this.validateForm.controls['medical' + index].value.name + '退药数量大于开药数量');
                    this.isLoadingSave = false;
                    return;
                }
                backP.num = (Number(this.validateForm.controls['bakNum' + index].value) - Number(this.validateForm.controls['num' + index].value)).toString();
                backPlist.push(backP);
                feeAll += Number(backP.num) * Number(this.validateForm.controls['batch' + index].value.price);
            }
            for(var indexDel in this.mPrescriptDelList){
                var iDel = this.mPrescriptDelList[indexDel].id;
                feeAll += Number(this.validateForm.controls['num' + iDel].value) * Number(this.validateForm.controls['batch' + iDel].value.price);
            }
            if(!hasBack){
                this._message.error('未选择退药信息');
                this.isLoadingSave = false;
                return;
            }
            if(this.validateForm.controls.remark.value == ''){
                this._message.error('退药说明不可为空');
                this.isLoadingSave = false;
                return;
            }

            var backParams = {
                username: this.adminService.getUser().username,
                token: this.adminService.getUser().token,
                id: this.prescriptId,
                plist: JSON.stringify(backPlist),
                fee: feeAll.toString(),
                remark: this.validateForm.controls.remark.value,
                true_id: this.actualOperator.use ? JSON.parse(this.actualOperator.name).id : null,
                true_name: this.actualOperator.use ? JSON.parse(this.actualOperator.name).realName : null,
            }

            this.adminService.doctorback(this.prescriptId, backParams).then((data) => {
                if(data.status == 'no'){
                    this._message.error(data.errorMsg);
                    this.isLoadingSave = false;
                }else{
                    this._message.success('退药成功');
                    setTimeout(() => {
                        this.router.navigate(['./admin/docbooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
                    }, 2000);
                }
            }).catch(() => {
                this.isLoadingSave = false;
                this._message.error('服务器错误');
            });
        }
	}

	create() {
		if(this.actualOperator.use && this.adminService.isFalse(this.actualOperator.name)){
			this._message.error('请先选择实际操作人');
			return;
		}
		this.isLoadingSave = true;
		//新增或修改或再次加药
		if(this.secondType == '' || this.secondType == 'update' || this.secondType == 'continueAdd'){
			var plist = [];
			var num = 0;
			var feeAll = 0;
			if(this.mPrescriptList.length > 0){
				for(var i = 0; i < this.mPrescriptList.length; i++){
					//判断可用或未出药
					if(this.adminService.isFalse(this.mPrescriptList[i].isOut) || (this.mPrescriptList[i].isOut == '0' && this.secondType == 'update')){
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
						this.validateForm.controls['remark' + i].setValue(this.adminService.trim(this.validateForm.controls['remark' + i].value));
						if(this.validateForm.controls['medical' + i].value == ''){
							this._message.error('第' + num + '条药品名不可为空');
							this.isLoadingSave = false;
							return;
						}
						if(this.adminService.isFalse(this.validateForm.controls['batch' + i].value)){
							this._message.error('第' + num + '条批次不可为空');
							this.isLoadingSave = false;
							return;
						}
						p.sinfo_id = this.validateForm.controls['batch' + i].value.id;
						p.name = this.validateForm.controls['medical' + i].value.name;
						p.unit = this.validateForm.controls['medical' + i].value.unit;
						p.one_unit = this.validateForm.controls['medical' + i].value.oneUnit;
						if(this.adminService.isFalse(this.validateForm.controls['oneNum' + i].value)){
							this._message.error('第' + num + '条单位剂量不可为空');
							this.isLoadingSave = false;
							return;
						}
						if(parseFloat(this.validateForm.controls['oneNum' + i].value) <= 0){
							this._message.error('第' + num + '条单次计量应大于0');
							this.isLoadingSave = false;
							return;
						}
						p.one_num = this.validateForm.controls['oneNum' + i].value;
						if(!(this.validateForm.controls['usage' + i].value) || this.validateForm.controls['usage' + i].value == ''){
							this._message.error('第' + num + '条用法不可为空');
							this.isLoadingSave = false;
							return;
						}
						p.usage = this.validateForm.controls['usage' + i].value;
						if(!(this.validateForm.controls['frequency' + i].value) || this.validateForm.controls['frequency' + i].value == ''){
							this._message.error('第' + num + '条用药频次不可为空');
							this.isLoadingSave = false;
							return;
						}
						p.frequency = this.validateForm.controls['frequency' + i].value;
						if(this.adminService.isFalse(this.validateForm.controls['days' + i].value)){
							this._message.error('第' + num + '条天数不可为空');
							this.isLoadingSave = false;
							return;
						}
						if(Number(this.validateForm.controls['days' + i].value) <=0 || Number(this.validateForm.controls['days' + i].value) % 1 != 0){
							this._message.error('第' + num + '条天数应为大于0的整数');
							this.isLoadingSave = false;
							return;
						}
						p.days = this.validateForm.controls['days' + i].value;
						if(this.adminService.isFalse(this.validateForm.controls['num' + i].value)){
							this._message.error('第' + num + '条药单总量不可为空');
							this.isLoadingSave = false;
							return;
						}
						if(Number(this.validateForm.controls['num' + i].value) <= 0 || Number(this.validateForm.controls['num' + i].value) % 1 != 0){
							this._message.error('第' + num + '条药单总量应为大于0的整数');
							this.isLoadingSave = false;
							return;
						}
						p.num = this.validateForm.controls['num' + i].value;
						if(Number(this.validateForm.controls['batch' + i].value.price) == 0){
							this.selected = {
								text: p.name + this.validateForm.controls['batch' + i].value.batch + '批次，尚未设置售价，请先设置售价，再开方',
							}
							this.modalConfirmTab = true;
							this.isLoadingSave = false;
							return;
						}
						p.price = this.validateForm.controls['batch' + i].value.price;
						if(Number(p.num) > Number(this.validateForm.controls['batch' + i].value.stock)){
							this.selected = {
								text: p.name + this.validateForm.controls['batch' + i].value.batch + '批次，库存' + this.validateForm.controls['batch' + i].value.stock + p.unit + '，所选药品数量超过库存现有量',
							}
							this.modalConfirmTab = true;
							this.isLoadingSave = false;
							return;
						}
						p.remark = this.validateForm.controls['remark' + i].value ? this.validateForm.controls['remark' + i].value : '';
						plist.push(p);
						feeAll += parseFloat(this.validateForm.controls['batch' + i].value.price) * Number(p.num);
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
						remark: this.adminService.trim(this.validateForm.controls.remark.value),
						fee: feeAll.toString(),
						true_id: this.actualOperator.use ? JSON.parse(this.actualOperator.name).id : null,
						true_name: this.actualOperator.use ? JSON.parse(this.actualOperator.name).realName : null,
					}

					this.adminService.doctorprescript(params).then((data) => {
						if(data.status == 'no'){
							this._message.error(data.errorMsg);
							this.isLoadingSave = false;
						}else{
							this._message.success('开方成功');
							setTimeout(() => {
								this.router.navigate(['./admin/docbooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
							}, 2000);
						}
					}).catch(() => {
                        this.isLoadingSave = false;
                        this._message.error('服务器错误');
                    });
				}else{
					var updateParams = {
						username: this.adminService.getUser().username,
						token: this.adminService.getUser().token,
						name: '',
						plist: JSON.stringify(plist),
						remark: this.validateForm.controls.remark.value,
						fee: feeAll,
						true_id: this.actualOperator.use ? JSON.parse(this.actualOperator.name).id : null,
						true_name: this.actualOperator.use ? JSON.parse(this.actualOperator.name).realName : null,
					}
					this.adminService.updateprescript(this.prescriptId, updateParams).then((data) => {
						if(data.status == 'no'){
							this._message.error(data.errorMsg);
							this.isLoadingSave = false;
						}else{
							this._message.success('药方修改成功');
							setTimeout(() => {
								this.router.navigate(['./admin/docbooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
							}, 2000);
						}
					}).catch(() => {
                        this.isLoadingSave = false;
                        this._message.error('服务器错误');
                    });
				}
			}else{
				var addParams = {
					username: this.adminService.getUser().username,
					token: this.adminService.getUser().token,
					fee: feeAll,
					plist: JSON.stringify(plist),
                    remark: this.validateForm.controls.remark.value,
					true_id: this.actualOperator.use ? JSON.parse(this.actualOperator.name).id : null,
					true_name: this.actualOperator.use ? JSON.parse(this.actualOperator.name).realName : null,
				}
				this.adminService.adddrug(this.prescriptId, addParams).then((data) => {
					if(data.status == 'no'){
                        this.isLoadingSave = false;
						this._message.error(data.errorMsg);
					}else{
						this._message.success('药品添加成功');
						setTimeout(() => {
							this.router.navigate(['./admin/docbooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
						}, 2000);
					}
				}).catch(() => {
                    this.isLoadingSave = false;
                    this._message.error('服务器错误');
                });
			}
		}else{

		}
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}
}
