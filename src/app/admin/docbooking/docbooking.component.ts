import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';
import { DomSanitizer }                       from '@angular/platform-browser';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-doctor-booking',
	templateUrl: './docbooking.component.html',
	styleUrls: ['./docbooking.component.scss', '../../../assets/css/ant-common.scss'],
})
export class DocbookingComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
		back_url: string,
	};
	// modal-img
	modalImg: {
		url: string,
		showImg: number,
	}
	loadingShow: boolean;
	url: string;
	id: string;
	doctorId: string;
	doctorInfo: {
		avatarUrl: string,
		id: string,
		mobile: string,
		realName: string,
		username: string,
		doctorProfile: {
			atitleText: string,
			ctitleText: string,
			description: string,
			gender: string,
		}
	};
	//添加费用
	addFeeInfo: {
		booking_id: string,
		project_name: string,
		price: string,
		number: string,
		fee: string,
		remarks: string,
		feeId: string,
		editProjectId: string,
		editType: string,
		type: string,
	};
	//添加检查单
	addCheckInfo: {
        checkList: any[],
		editType: string,
	};
	checklist: any[];
	hasCheckData: boolean;
	checkDataList: any[];
	selectedCheckTab: string;
	//开方
	hasPrescriptData: boolean;
	prescriptList: any[];
	booking: {
		actCards: any[],
		age: string,
		birthDate: string,
		bookingAge: string,
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
		status: string,
		totalFee: string,
		mobile: string,
		remark: string,
		genderText: string,
	};
	hasBookingData: boolean;
	canEdit: boolean;
	selectedTab: number;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
		type: string,
	}
	//回访
	hasFollowupsData: boolean;
	followupsList: any[];
	// pageType 空为医生接诊，history为查看
	pageType: string;
	// 辅助治疗
	assistProjects: any[];
	assistList: any[];
	hasAssistData: boolean;
	addAssistInfo: {
		editType: string,
        editProjectId: string,
		project: string,
		price: string,
		number: string,
		fee: string,
		remark: string,
        projectList: any[],
	};
	// 不可连续点击
	btnCanEdit: boolean;
	// 实际操作人
	actualOperator: {
		use: boolean,
		name: string,
	}
	operator: string;
	// 中药处方
	hasDocTcmData: boolean;
	docTcmList: any[];

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
		private sanitizer: DomSanitizer,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '接诊',
			back: true,
			back_url: './admin/bookingReceive',
		}

		this.loadingShow = true;

		// modal-img
		this.modalImg = {
			url: '',
			showImg: 0,
		}

		this.id = '';
		this.doctorId = '';
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
			type: '',
		}

		this.booking = {
			actCards: [],
			age: '',
			birthDate: '',
			bookingAge: '',
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
			status: '',
			totalFee: '',
			mobile: '',
			remark: '',
			genderText: '',
		};
		this.hasBookingData = false;
		//判断sessionStorage中是否已经缓存
		if(sessionStorage.getItem('doctorBookingTab')){
			this.selectedTab = Number(sessionStorage.getItem('doctorBookingTab'));
		}else{
			this.selectedTab = 1;
		}

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
			this.doctorId = params['doctorId'];
			this.pageType = params.pageType;
		});

		//添加费用
		this.addFeeInfo = {
			booking_id: this.id,
			project_name: '',
			price: '',
			number: '',
			fee: '',
			remarks: '',
			feeId: '',
			editProjectId: '',
			editType: '',
			type: '',
		}

		//添加检查
		this.addCheckInfo = {
            checkList: [],
			editType: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
		//获取预约信息
		this.getBookingData();

		//获取检查信息
		this.hasCheckData = false;
		this.checkDataList = [];
		this.selectedCheckTab = '';
		this.getCheckData();

		//获取开方信息
		this.hasPrescriptData = false;
		this.prescriptList = [];
		this.getPrescriptData();

		//回访
		this.hasFollowupsData = false;
		this.followupsList = [];
		var userfollowupsUrl = this.url + '&booking_id=' + this.id;
		this.adminService.userfollowups(userfollowupsUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.followupsList = results.list;
				this.hasFollowupsData = true;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});

		// 辅助治疗
		this.assistProjects = [];
		var assistUrl = this.url + '&status=1';
		this.adminService.searchassist(assistUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.assistProjects = results.list;
			}
		}).catch(() => {
			this._message.error('服务器错误');
        });
        
		// 预约辅助治疗
		this.hasAssistData = false;
		this.assistList = [];
		this.addAssistInfo = {
			editType: '',
			editProjectId: '',
			project: '',
			price: '',
			number: '',
			fee: '',
            remark: '',
            projectList: [],
		}
		this.getBookingAssistData();

		// 中药处方
		this.hasDocTcmData = false;
		this.docTcmList = [];
		this.getDocTcmList();

		this.doctorInfo = {
			avatarUrl: '',
			id: '',
			mobile: '',
			realName: '',
			username: '',
			doctorProfile: {
				atitleText: '',
				ctitleText: '',
				description: '',
				gender: '',
			}
		};

		//获取医生信息
		var urlDoctor = this.url + '&id=' + this.doctorId;
		this.adminService.adminlist(urlDoctor).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					this.doctorInfo = results.adminlist[0];
				}
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});

		//查询诊所检查项
		this.checklist = [];
		var checkUrl = this.url;
		this.adminService.checkprojects(checkUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.checklist = results.list;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}
		this.operator = this.adminService.isFalse(this.actualOperator.name) ? '' : this.actualOperator.name;

		this.btnCanEdit = false;
	}

	// 选择实际操作人
	selectOperator(_value) {
		this.operator = _value;
	}

	// 成长记录
	goSection(url) {
		// pageType 空为医生， history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.loadingShow = true;
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
	}

	getBookingData() {
		//获取预约信息
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					if((new Date().getTime() - 24*60*60*1000) > new Date(results.weekbooks[0].bookingDate).getTime()){
						this.canEdit = false;
					}else{
						this.canEdit = true;
					}
					if(results.weekbooks[0].services.length > 0){
						for(var i = 0; i < results.weekbooks[0].services.length; i++){
							if(!this.adminService.isFalse(results.weekbooks[0].services[i].begin)){
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.replace('-', '年');
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.replace('-', '月');
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.replace(' ', '日 ');
								results.weekbooks[0].services[i].begin = results.weekbooks[0].services[i].begin.slice(0, results.weekbooks[0].services[i].begin.indexOf(' '));
							}
							if(!this.adminService.isFalse(results.weekbooks[0].services[i].end)){
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace('-', '年');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace('-', '月');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace(' ', '日 ');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.slice(0, results.weekbooks[0].services[i].end.indexOf(' '));
							}
						}
					}
					// fees中fee为折扣费用，需计算实际费用
					if(results.weekbooks[0].fees.length > 0){
						for(var index in results.weekbooks[0].fees){
							if(results.weekbooks[0].fees[index].number != null){
								results.weekbooks[0].fees[index].originFee = this.adminService.toDecimal2(parseFloat(results.weekbooks[0].fees[index].number) * parseFloat(results.weekbooks[0].fees[index].price));
							}else{
								results.weekbooks[0].fees[index].originFee = results.weekbooks[0].fees[index].fee;
							}
						}
					}
					this.booking = results.weekbooks[0];
					this.hasBookingData = true;
					var fees = results.weekbooks[0].fees;
					var total = 0;
					if(fees.length > 0){
						for(var i = 0; i < fees.length; i++){
							if(fees[i].type != 'booking'){
								total += Number(fees[i].fee);
							}
						}
					}
					this.booking.totalFee = this.adminService.toDecimal2(total.toString());

					//中等值身高体重
					var childcontrastUrl = '?child_id=' + this.booking.childId;
					this.adminService.childcontrast(childcontrastUrl).then((data) => {
						if(data.status == 'no'){
							this.loadingShow = false;
							this._message.error(data.errorMsg);
						}else{
							sessionStorage.setItem('childcontrast', JSON.stringify(data.results));
							this.loadingShow = false;
						}
					}).catch(() => {
						this.loadingShow = false;
						this._message.error('服务器错误');
					});
				}
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	// 检查
	changeCheckTab(_value) {
		this.selectedCheckTab = _value;
	}

	// 放大图片
	enlargeImg(ele, type, values) {
		if(type == 'image'){
			this.modalImg = {
				url: ele.src,
				showImg: this.modalImg.showImg == 0 ? 1 : 0,
			}
		}else{
			window.open(values);
		}
	}

	getCheckData() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&today=1';
		this.adminService.usercheckprojectinfo(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					this.selectedCheckTab = results.list[0].id;
					for(var i = 0; i < results.list.length; i++){
						if(!this.adminService.isFalse(results.list[i].remark)){
							results.list[i].remark = this.sanitizer.bypassSecurityTrustHtml(results.list[i].remark.replace(/;/g, '<br/>'));
						}
					}
				}
				this.checkDataList = results.list;
				this.hasCheckData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	getPrescriptData() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&isout=1&today=1';
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].infoLength = results.list[i].info.length;
						if(results.list[i].info.length > 0){
							for(var j = 0; j < results.list[i].info.length; j++){
								results.list[i].info[j].msExplain = '单次：' + results.list[i].info[j].oneNum + results.list[i].info[j].oneUnit + '，' + results.list[i].info[j].frequency + '，' + results.list[i].info[j].usage + (results.list[i].info[j].days ? '，共' + results.list[i].info[j].days + '天' : '') ;
							}
						}
					}
				}
				this.prescriptList = results.list;
				this.hasPrescriptData = true;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	//开方
	prescript() {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId}});
	}

	//追加科室
	addService() {
		this.router.navigate(['./admin/bookingAddService'], {queryParams: {id: this.id, doctorId: this.doctorId}});
	}

	//取消追加费用
	removeFee() {
		//清空费用信息
		this.addFeeInfo.project_name = '';
		this.addFeeInfo.price = '';
		this.addFeeInfo.number = '';
		this.addFeeInfo.fee = '';
		this.addFeeInfo.remarks = '';
		this.addFeeInfo.feeId = '';
		this.addFeeInfo.editType = '';
		this.addFeeInfo.type = '';
	}

	// 单价或者数量变化
	changeFee() {
		var price = false;
		if(!this.adminService.isFalse(this.addFeeInfo.price)){
			if(Number(this.addFeeInfo.price) < 0){
				this._message.error('单价费用应大于等于0');
			}
			price = true;
		}
		var number = false;
		if(!this.adminService.isFalse(this.addFeeInfo.number)){
			if(Number(this.addFeeInfo.number) <= 0 || Number(this.addFeeInfo.number) % 1 != 0){
				this._message.error('单价数量应为大于0的整数');
			}
			number = true;
		}
		if(price && number){
			this.addFeeInfo.fee = (parseFloat(this.addFeeInfo.price) * Number(this.addFeeInfo.number)).toString();
		}
	}

	//追加费用
	addfee() {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.addFeeInfo.editType = 'create';
	}

	//修改费用
	updateFee(fee) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.addFeeInfo.project_name = fee.projectName;
		this.addFeeInfo.price = fee.price;
		this.addFeeInfo.number = fee.number;
		this.addFeeInfo.fee = fee.fee;
		this.addFeeInfo.remarks = fee.remark;
		this.addFeeInfo.feeId = fee.feeId;
		this.addFeeInfo.editProjectId = fee.projectId;
		this.addFeeInfo.editType = 'update';
		this.addFeeInfo.type = fee.type;
	}

	editFee(f) {
		this.btnCanEdit = true;
		this.addFeeInfo.project_name = this.adminService.trim(this.addFeeInfo.project_name);
		this.addFeeInfo.remarks = this.adminService.trim(this.addFeeInfo.remarks);
		if(this.addFeeInfo.project_name == ''){
			this._message.error('消费项目名不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.addFeeInfo.price)){
			this._message.error('消费项目单价不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.addFeeInfo.price) < 0){
			this._message.error('消费项目单价应大于等于0');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.addFeeInfo.number)){
			this._message.error('消费项目数量不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(Number(this.addFeeInfo.number) <= 0 || Number(this.addFeeInfo.number) % 1 != 0){
			this._message.error('消费项目数量应为大于0的整数');
			this.btnCanEdit = false;
			return;
		}
		if(this.adminService.isFalse(this.addFeeInfo.fee)){
			this._message.error('消费项目单价不可为空');
			this.btnCanEdit = false;
			return;
		}
		if(parseFloat(this.addFeeInfo.fee) < 0){
			this._message.error('消费项目单价应大于等于0');
			this.btnCanEdit = false;
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			booking_id: this.addFeeInfo.booking_id,
			project_name: this.addFeeInfo.project_name,
			price: this.addFeeInfo.price,
			number: this.addFeeInfo.number,
			fee: this.addFeeInfo.fee,
			remarks: this.addFeeInfo.remarks,
			id: this.addFeeInfo.feeId ? this.addFeeInfo.feeId : null,
		}
		this.adminService.addfee(params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this.getBookingData();
				//清空费用信息
				this.addFeeInfo.project_name = '';
				this.addFeeInfo.price = '';
				this.addFeeInfo.number = '';
				this.addFeeInfo.fee = '';
				this.addFeeInfo.remarks = '';
				this.addFeeInfo.feeId = '';
				this.addFeeInfo.editType = '';
				if(this.addFeeInfo.editType == 'create'){
					this._message.success('费用添加成功');
				}else{
					this._message.success('费用修改成功');
				}
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	addCheckTab() {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
        }
        this.addCheckInfo.checkList = [{
            check: ''
        }];
		this.addCheckInfo.editType = 'create';
    }
    
    addCheck() {
        this.addCheckInfo.checkList.push({
            check: ''
        });
    }

    removeCheck(index) {
        if(this.addCheckInfo.checkList.length == 1){
            this._message.error('实验室检查不可为空');
            return;
        }
        this.addCheckInfo.checkList.splice(index, 1);
    }

	// 删除检查
	deleteCheck(check) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.selector = {
			id: check.id,
			text: '确认删除该检查',
			type: 'check',
		}
		this.modalConfirmTab = true;
	}

	removeCheckTab() {
		//取消检查单操作
		this.addCheckInfo = {
            checkList: [],
			editType: '',
		}
	}

	editCheckTab() {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
        this.btnCanEdit = true;
        var checkList = [];
		if(this.addCheckInfo.checkList.length > 0){
            for(var i = 0; i < this.addCheckInfo.checkList.length; i++){
                if(!this.addCheckInfo.checkList[i].check || this.addCheckInfo.checkList[i].check == ''){
                    this._message.error('实验室检查不可为空');
                    this.btnCanEdit = false;
                    return;
                }else{
                    checkList.push({
                        check_id: this.addCheckInfo.checkList[i].check.project_id,
                        check_name: this.addCheckInfo.checkList[i].check.name
                    })
                }
            }
        }else{
			this._message.error('实验室检查未选择');
			this.btnCanEdit = false;
			return;
        }
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
            booking_id: this.id,
            checklist: JSON.stringify(checkList),
		}
		this.adminService.usercheckproject(params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('检查创建成功');
				this.getCheckData();
				//清空检查信息
				this.removeCheckTab();
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	// 辅助治疗
	getBookingAssistData() {
		var assistUrl = this.url + '&booking_id=' + this.id;
		this.adminService.bookingassist(assistUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						var remark = results.list[i].remark ? results.list[i].remark : '';
						var drug = '';
						if(results.list[i].drugs.length > 0){
							for(var j = 0; j < results.list[i].oneDrugs.length; j++){
								drug += results.list[i].oneDrugs[j].name + '（' + results.list[i].oneDrugs[j].show_num + results.list[i].oneDrugs[j].show_unit + '），';
							}
							if(drug.length > 0){
								drug = drug.slice(0, drug.length - 1);
							}
							remark += (remark == '' ? remark : '，') + '单次配比：' + drug;
						}
						results.list[i].remark = remark;
					}
				}
				this.assistList = results.list;
				this.hasAssistData = true;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
    }
    
	addAssistTab() {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.addAssistInfo = {
            editType: 'add',
            editProjectId: '',
            project: '',
            price: '',
            number: '',
            fee: '',
            remark: '',
            projectList: [{
                project: '',
                price: '',
                number: '',
                fee: '',
                remark: '',
            }]
        }
    }
    
    addAssist() {
        this.addAssistInfo.projectList.push({
            project: '',
            price: '',
            number: '',
            fee: '',
            remark: '',
        });
    }

    removeAssist(index) {
        if(this.addAssistInfo.projectList.length == 0){
            this._message.error('辅助治疗不可为空');
            return;
        }
        this.addAssistInfo.projectList.splice(index, 1);
    }

	removeAssistTab() {
		this.addAssistInfo = {
            editType: '',
            editProjectId: '',
            project: '',
            price: '',
            number: '',
            fee: '',
            remark: '',
            projectList: []
        }
	}

	changeAssist(index) {
		if(this.addAssistInfo.projectList[index].project['id']){
			this.addAssistInfo.projectList[index].price = this.addAssistInfo.projectList[index].project['price'];
			this.changeAssistNumber('list', index);
		}
	}

	changeAssistNumber(type, index) {
        if(type == 'list'){
            var projectInfo = this.addAssistInfo.projectList[index];
            if(!this.adminService.isFalse(projectInfo.number) && (Number(projectInfo.number) <= 0 || Number(projectInfo.number) % 1 != 0)){
                this._message.error('数量应为大于0的整数');
                return;
            }
            if(!this.adminService.isFalse(projectInfo.price)){
                this.addAssistInfo.projectList[index].fee = this.adminService.toDecimal2(Number(projectInfo.number) * parseFloat(projectInfo.price));
            }
        }else{
            if(!this.adminService.isFalse(this.addAssistInfo.number) && (Number(this.addAssistInfo.number) <= 0 || Number(this.addAssistInfo.number) % 1 != 0)){
                this._message.error('数量应为大于0的整数');
                return;
            }
            if(!this.adminService.isFalse(this.addAssistInfo.price)){
                this.addAssistInfo.fee = this.adminService.toDecimal2(Number(this.addAssistInfo.number) * parseFloat(this.addAssistInfo.price));
            }
        }
	}

	updateAddAssistTab(assist) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.addAssistInfo.editType = 'update';
		this.addAssistInfo.editProjectId = assist.id;
		this.addAssistInfo.project = assist.assistName;
		this.addAssistInfo.price = assist.price;
		this.addAssistInfo.number = assist.number;
		this.addAssistInfo.fee = assist.fee;
		this.addAssistInfo.remark = assist.remark;
	}

	editAssistTab() {
        this.btnCanEdit = true;
        var assistlist = [];
		if(this.addAssistInfo.editType == 'add'){
            if(this.addAssistInfo.projectList.length > 0){
                for(var i = 0; i < this.addAssistInfo.projectList.length; i++){
                    var projectInfo = this.addAssistInfo.projectList[i];
                    // 新增
                    if(this.adminService.isFalse(projectInfo.project)){
                        this._message.error('辅助治疗不可为空');
                        this.btnCanEdit = false;
                        return;
                    }
                    if(this.adminService.isFalse(projectInfo.number)){
                        this._message.error('数量不可为空');
                        this.btnCanEdit = false;
                        return;
                    }
                    if(Number(projectInfo.number) <= 0 || Number(projectInfo.number) % 1 != 0){
                        this._message.error('数量应为大于0的整数');
                        this.btnCanEdit = false;
                        return;
                    }
                    assistlist.push({
                        assist_id: projectInfo.project['id'],
                        num: projectInfo.number,
                        remark: this.adminService.trim(projectInfo.remark),
                    })
                }
            }else{
                this._message.error('辅助治疗未添加');
				this.btnCanEdit = false;
				return;
            }
		}else{
            // 修改
			if(this.assistProjects.length > 0){
				for(var i = 0; i < this.assistProjects.length; i++){
					if(this.assistProjects[i].id == this.addAssistInfo.project['id']){
						this.addAssistInfo.project = this.assistProjects[i];
					}
				}
            }
            if(this.adminService.isFalse(this.addAssistInfo.number)){
                this._message.error('数量不可为空');
                this.btnCanEdit = false;
                return;
            }
            if(Number(this.addAssistInfo.number) <= 0 || Number(this.addAssistInfo.number) % 1 != 0){
                this._message.error('数量应为大于0的整数');
                this.btnCanEdit = false;
                return;
            }
            assistlist.push({
                id: this.addAssistInfo.editProjectId,
                assist_id: this.addAssistInfo.project['id'],
                num: this.addAssistInfo.number,
                remark: this.adminService.trim(this.addAssistInfo.remark),
            })
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			booking_id: this.id,
			child_id: this.booking.childId,
			assistlist: JSON.stringify(assistlist),
		}

		this.adminService.addassist(params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				if(this.addAssistInfo.editType == 'update'){
					this._message.success('辅助治疗修改成功');
				}else{
					this._message.success('辅助治疗添加成功');
				}
				this.removeAssistTab();
				this.getBookingAssistData();
				this.getBookingData();
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
		});
	}

	//删除辅助治疗
	deleteAssist(_id) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.selector = {
			id: _id,
			text: '确认删除该辅助治疗',
			type: 'assist',
		}
		this.modalConfirmTab = true;
	}

	// 中药处方
	getDocTcmList() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&isout=1';
		this.adminService.searchtcmprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.docTcmList = results.list;
				this.hasDocTcmData = true;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	// 开中药处方
	tcmPrescript() {
		sessionStorage.setItem('docBookingDocName', this.booking.services.length > 0 ? this.booking.services[0].userDoctorName : '');
		this.router.navigate(['./admin/doctorTcmPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, creatorId: this.booking.creatorId, childId: this.booking.childId}});
	}

	// 修改中药处方
	updateDocTcm(docTcm) {
		sessionStorage.setItem('docBookingDocName', this.booking.services.length > 0 ? this.booking.services[0].userDoctorName : '');
		this.router.navigate(['./admin/doctorTcmPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, creatorId: this.booking.creatorId, childId: this.booking.childId, tcmPreId: docTcm.id}});
	}

	//修改药方
	updatePrescript(info) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id, type: 'update'}});
	}

	//删除药方
	deletePrescript(_id) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.selector = {
			id: _id,
			text: '确认删除该药方',
			type: 'prescript',
		}
		this.modalConfirmTab = true;
	}

	// 出药后，可继续加药
	continueAdd(info) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id, type: 'continueAdd'}});
	}

	//退药
	backdrug(info) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		sessionStorage.setItem('prescript', JSON.stringify(info));
		this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: info.id, type: 'back'}});
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.modalConfirmTab = false;
		if(this.selector.type == 'prescript'){
			// 删除药方
			var urlOptions = this.selector.id + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token;
			this.adminService.deleteprescript(urlOptions).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					this._message.success('药方删除成功');
					this.getPrescriptData();
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}else if(this.selector.type == 'check'){
			// 删除检查
			var deleteCheckUrl = this.selector.id + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token;
			this.adminService.deleteusercheck(deleteCheckUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					this._message.success('检查删除成功');
					this.getCheckData();
					//清空检查信息
					this.addCheckInfo = {
                        checkList: [],
						editType: '',
					}
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}else if(this.selector.type == 'assist'){
			// 删除辅助治疗
			var deleteAssistUrl = this.selector.id + '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&booking_id=' + this.id;
			this.adminService.deleteassist(deleteAssistUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					this._message.success('辅助治疗删除成功');
					this.getBookingAssistData();
					//清空辅助治疗信息
					this.removeAssistTab();
					this.getBookingData();
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}
	}

	changeTab(_value) {
		this.selectedTab = _value;
		sessionStorage.setItem('doctorBookingTab', _value);
	}

	//新增回访
	addFollowups() {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.router.navigate(['./admin/bookingFollowups'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create', from: 'docbooking'}});
	}

	//新增成长记录
	addGrowthrecord() {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		this.router.navigate(['./admin/bookingGrowthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
	}

	//修改成长记录
	updateGrowthrecord(growthrecord) {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('growthrecord', JSON.stringify(growthrecord));
		this.router.navigate(['./admin/bookingGrowthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'update'}});
	}

	//新增病例
	addCasehistory() {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		this.router.navigate(['./admin/bookingCasehistory'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
	}

	//修改病例
	updateCasehistory(casehistory) {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('casehistory', JSON.stringify(casehistory));
		this.router.navigate(['./admin/bookingCasehistory'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'update'}});
	}

	// 新增儿保记录
	addHealthrecord() {
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
	}

	// 修改儿保记录
	updateHealthrecord(healthrecord) {
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('healthrecord', JSON.stringify(healthrecord));
		this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctor: this.doctorId, childId: this.booking.childId, type: 'update'}});
	}

	closeImg() {
		this.modalImg.showImg = 0;
	}
}
