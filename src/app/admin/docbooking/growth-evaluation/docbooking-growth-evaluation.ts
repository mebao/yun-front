import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../../admin.service';
import { DoctorService }                      from '../../doctor/doctor.service';

import { UploadService }                      from '../../../common/nll-upload/upload.service';

@Component({
	selector: 'admin-docbooking-growth-evaluation',
	templateUrl: './docbooking-growth-evaluation.html',
	styleUrls: ['../casehistory/docbooking-casehistory.component.scss', './docbooking-growth-evaluation.scss'],
})
export class DocbookingGrowthEvaluation implements OnInit{
	topBar: {
		title: string,
		back: boolean,
		back_url: string,
	};
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
	// pageType 空为医生接诊, history为查看
	pageType: string;
	healthrecord_id: string;
	modalConfirmTab: boolean;
	// 实际操作人
	actualOperator: {
		use: boolean,
		name: string,
	}
	operator: string;
	// 宝宝成长测评
	growthResult: {
		list: any[],
		selected: any,
		echart: any,
		typeAnswer: any,
	}
	// 育儿宝库中是否有对应宝宝信息
	hasGrowthEvaluation: boolean;
	// 是否有测评结果
	hasEvaluationResults: boolean;
	// 问题
	growthQst: {
		// 是否展示答题tab
		show: boolean,
		// 所有问题,
		list: any[],
		// 问题总数
		total: number,
		// 一级题目num
		first: number,
		// 二级题目num
		second: number,
		// 回到到第几题
		answerNum: number,
		// 正在回答的问题
		answerQestion: any,
		// 正在回答的问题的答案
		answer: string,
		// 答案列表
		answerList: any[],
	}
	questionInfo: {
		showInfo: boolean,
		modalQuestionTab: boolean,
		text: string,
		okText: string,
	}
	yebk: {
		child_id: string,
		month_id: string,
	}
	hasData: boolean;

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private doctorService: DoctorService,
		private route: ActivatedRoute,
		private router: Router,
		private uploadService: UploadService,
	) {}

	ngOnInit(): void{
		this.topBar = {
			title: '接诊',
			back: true,
			back_url: './admin/bookingReceive',
		}

		this.loadingShow = true;

		this.id = '';
		this.doctorId = '';

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
			genderText: ''
		};
		this.hasBookingData = false;

		this.route.queryParams.subscribe((params) => {
			this.id = params['id'];
			this.doctorId = params['doctorId'];
			this.pageType = params.pageType;
		});

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
		//获取预约信息
		this.getBookingData();

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

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.doctorId = params.doctorId;
            //this.editType = params.type;
        });

		this.healthrecord_id = '';
		this.modalConfirmTab = false;

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}
		this.operator = this.adminService.isFalse(this.actualOperator.name) ? '' : this.actualOperator.name;

		this.growthResult = {
			list: [],
			selected: {},
			echart: {},
			typeAnswer: {},
		}
		this.hasGrowthEvaluation = false;
		this.hasEvaluationResults = false;
		this.growthQst = {
			show: false,
			list: [],
			total: 0,
			first: 0,
			second: 0,
			answerNum: 1,
			answerQestion: {},
			answer: '',
			answerList: [],
		}
		this.questionInfo = {
			showInfo: true,
			modalQuestionTab: false,
			text: '',
			okText: '',
		}
		this.yebk = {
			child_id: '',
			month_id: '',
		}
		this.hasData = false;
	}

	changeFrameHeight() {

	}

	initEdit(){
		var doctorBooking = JSON.parse(sessionStorage.getItem('doctorBooking'));
		if(doctorBooking == null){
			return;
		}
	}

	goHistory(history) {
		window.open('./admin/docbooking?id=' + history.bookingId + '&doctorId=' + history.services[0].userDoctorId + '&pageType=history');
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
					this.booking = results.weekbooks[0];
					this.hasBookingData = true;
					var fees = results.weekbooks[0].fees;
					var total = 0;
					if(fees.length > 0){
						for(var i = 0; i < fees.length; i++){
							total += Number(fees[i].fee);
						}
					}
					this.booking.totalFee = this.adminService.toDecimal2(total.toString());
					sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
					this.initEdit();

					// 获取宝宝成长曲线图
					this.getChildGrowthEvaluation();
				}
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	changeTab(_value, url) {
		sessionStorage.setItem('doctorBookingTab', _value);
		// pageType 空为医生接诊， history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.loadingShow = true;
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
	}
	
	// 选择实际操作人
	selectOperator(_value) {
		this.operator = _value;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	getChildGrowthEvaluation() {
		var urlOptions = '?clinic_id=' + this.adminService.getUser().clinicId + '&child_id=' + this.booking.childId;
		this.adminService.gtchild(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.child){
					this.hasGrowthEvaluation = true;
					this.yebk.child_id = results.child.GtChildId;
					// 获取宝宝测评结果
					this.getChildreview();
				}else{
					this.hasData = true;
					this.loadingShow = false;
				}
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	getChildreview() {
		var childreviewUrl = '?child_id=' + this.yebk.child_id + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.childreview(childreviewUrl).then((dataChildreview) => {
			if(dataChildreview.status == 'no'){
				this.loadingShow = false;
				this._message.error(dataChildreview.errorMsg);
			}else{
				var resultsChildreview = JSON.parse(JSON.stringify(dataChildreview.results));
				if(resultsChildreview.length == 0){
					this.hasData = true;
					this.hasEvaluationResults = false;
				}else{
					this.growthResult.list = resultsChildreview;
					this.growthQst = {
						show: false,
						list: [],
						total: 0,
						first: 0,
						second: 0,
						answerNum: 1,
						answerQestion: {},
						answer: '',
						answerList: [],
					}
					this.selectedResults(resultsChildreview[0]);
					this.hasData = true;
				}
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	selectedResults(_value) {
		this.growthResult.selected = _value;
		this.growthResult.typeAnswer = {};
		this.hasEvaluationResults = true;
		var data = new Array();
		var radarList = [];
		for(var x in this.growthResult.selected.typeAnswer){
			var radar = {
				name: this.growthResult.selected.typeAnswer[x].type_name,
				max: this.growthResult.selected.typeAnswer[x].outstanding*1.5,
			}
			radarList.push(radar);
			if(this.growthResult.selected.typeAnswer[x].fenshu >= this.growthResult.selected.typeAnswer[x].outstanding * 1.5){
				data.push(this.growthResult.selected.typeAnswer[x].outstanding * 1.5);
			}else{
				if(this.growthResult.selected.typeAnswer[x].fenshu <= 2){
					data.push(2);
				}else{
					data.push(this.growthResult.selected.typeAnswer[x].fenshu);
				}
			}
		}

		this.growthResult.echart = {
			tooltip: {},
			radar: {
				// shape: 'circle',
				name: {
					textStyle: {
						color: '#fff',
						backgroundColor: '#999',
						borderRadius: 3,
						padding: [3, 5]
				   }
				},
				indicator: radarList
			},
			series: [{
				name: '成长测评',
				type: 'radar',
				// areaStyle: {normal: {}},
				data : [
					{
						value : data,
						name : '成长测评'
					}
				]
			}]
		};
	}

	// 详情描述
	selectedTypeAnswer(_value) {
		if(_value == ''){
			this.growthResult.typeAnswer = {};
		}else{
			this.growthResult.typeAnswer = _value;
		}
	}

	getGrowthEvaluationQst() {
		this.loadingShow = true;
		var urlOptions = '?child_id=' + this.yebk.child_id + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.growthquestions(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.yebk.month_id = results.monthId;
				this.growthQst = {
					show: true,
					list: results.question,
					total: 0,
					first: 0,
					second: 0,
					answerNum: 1,
					answerQestion: {},
					answer: '',
					answerList: [],
				}
				this.growthQst.total = 0;
				for(var x in this.growthQst.list){
					this.growthQst.total += this.growthQst.list[x].length;
				}
				this.growthQst.answerQestion = this.growthQst.list[0][0];
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器需错误');
		});
	}

	// 下一个问题
	nextQuestion(question, answer) {
		this.growthQst.answerNum += 1;
        var anwerObj = {
			type_id: '',
			question_id: '',
			month_id: '',
			answer: '',
		};
        anwerObj.type_id = question.typeId;
        anwerObj.question_id = question.id;
		anwerObj.month_id = question.monthId;
        anwerObj.answer = answer;
        if(this.growthQst.second < this.growthQst.list[this.growthQst.first].length - 1){
            this.growthQst.second += 1;
        }else{
            if(this.growthQst.first < this.growthQst.list.length - 1){
                this.growthQst.first += 1;
                this.growthQst.second = 0;
            }
        }
        this.growthQst.answerQestion = this.growthQst.list[this.growthQst.first][this.growthQst.second];

		var noAnswer = true;
		var boolActive = true;
		for(var x in this.growthQst.answerList){
			if(anwerObj.question_id == this.growthQst.answerList[x].question_id){
				noAnswer = false;
				this.growthQst.answerList[x].answer = anwerObj.answer;
			}
			if(this.growthQst.answerQestion.id == this.growthQst.answerList[x].question_id){
				this.growthQst.answer = this.growthQst.answerList[x].answer;
				boolActive = false;
			}
		}
		if(boolActive){
			this.growthQst.answer = '';
		}
		if(noAnswer){
			this.growthQst.answerList.push(anwerObj);
		}

        if(this.growthQst.first == this.growthQst.list.length - 1 && this.growthQst.second == this.growthQst.list[this.growthQst.first].length - 1){
            this.loadingShow = true;
            var params = {
				clinic_id: this.adminService.getUser().clinicId,
                child_id: this.yebk.child_id,
                month_id: this.yebk.month_id,
                alist: this.growthQst.answerList,
            }
            this.adminService.gtanswer(params).then((data) =>{
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					this.getChildreview();
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
        }
		// 如果不确定的题目超过5个，添加提醒
		var i = 0;
		for(var x in this.growthQst.answerList){
			if(this.growthQst.answerList[x].answer == '0'){
				i++;
			}
			if(this.questionInfo.showInfo && i>=5){
				this.questionInfo = {
					showInfo: false,
					modalQuestionTab: true,
					text: '如果不确定的题很多，测评结果就不准确了，请认真答题哦。',
					okText: '知道了',
				}
			}
		}
	}

	lastQuestion() {
		this.growthQst.answerNum -= 1;
		if(this.growthQst.first == 0 && this.growthQst.second == 0){
			this.questionInfo = {
				showInfo: this.questionInfo.showInfo,
				modalQuestionTab: true,
				text: '关闭后所有选项不会保留，确定关闭吗？',
				okText: '确定',
			}
		}
		if(this.growthQst.second > 0){
            this.growthQst.second -= 1;
        }else{
            if(this.growthQst.first > 0){
                this.growthQst.first -= 1;
                this.growthQst.second = this.growthQst.list[this.growthQst.first].length - 1;
            }
        }
		this.growthQst.answerQestion = this.growthQst.list[this.growthQst.first][this.growthQst.second];
		for(var x in this.growthQst.answerList){
			if(this.growthQst.answerQestion.id == this.growthQst.answerList[x].question_id){
				this.growthQst.answer = this.growthQst.answerList[x].answer;
			}
		}
    }

	closeQuestion() {
		this.questionInfo.modalQuestionTab = false;
	}

	confirmQuestion() {
		this.questionInfo.modalQuestionTab = false;
		this.questionInfo.showInfo = true;
		if(this.questionInfo.okText == '知道了'){
		}else{
			this.growthQst = {
				show: false,
				list: [],
				total: 0,
				first: 0,
				second: 0,
				answerNum: 1,
				answerQestion: {},
				answer: '',
				answerList: [],
			}
		}
	}

	closeQuestionTab() {
		this.questionInfo = {
			showInfo: this.questionInfo.showInfo,
			modalQuestionTab: true,
			text: '关闭后所有选项不会保留，确定关闭吗？',
			okText: '确定',
		}
	}
}
