import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../../admin.service';
import { DoctorService }                      from '../../doctor/doctor.service';
import { DialogService }                      from '../../dialog.service';
import { Observable }                         from 'rxjs';

import { UploadService }                      from '../../../common/nll-upload/upload.service';

@Component({
	selector: 'admin-doctor-booking-casehistory',
	templateUrl: './docbooking-casehistory.component.html',
	styleUrls: ['./docbooking-casehistory.component.scss', '../docbooking.component.scss'],
})
export class DocbookingCasehistoryComponent implements OnInit{
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
	//病历
	casehistoryList: any[];
	hasCasehistoryData: boolean;
	//病历模板
	casetempletList: any[];
	selectedTemplet: any;
	// 药方
	prescriptList: any[];
	prescription: any[];
	// pageType 空为医生接诊， history为查看
	pageType: string;
	// 体格检查
	showExamination: boolean;
	info: {
		child_id:string,
		booking_id:string,
		name: string,
		age: string,
		weight: string,
		mid_weight: string,
		compare_weight: string,
		height: string,
		mid_height: string,
		compare_height: string,
		head_circum: string,
		breast_circum: string,
		teeth: string,
		topic_comment: string,
		check_result: string,
		present_illness: string,
		previous_history: string,
		allergy: string,
		family_history: string,
		breed_history: string,
		growth_history: string,
		physical_check: string,
		body_temperature: string,
		breathe: string,
		blood_pressure: string,
		face_neck: string,
		face_neck_other: string,
		files: any[],
		heart_lung: string,
		heart_lung_other: string,
		abdomen: string,
		abdomen_other: string,
		limbs: string,
		limbs_other: string,
		nervous_system: string,
		nervous_system_other: string,
		blood_routine_examination: string,
		blood_routine_examination_other: string,
		routine_urine: string,
		routine_urine_other: string,
		bone_density: string,
		BALP: string,
		BALP_other: string,
		trace_element: string,
		trace_element_other: string,
		diagnosis: string,
		prescription: string,
		advise: string,
		time: string,
		timeText: string,
		checkList: any[],
		checkId: string,
	};
	// 用于判断input-number类型，因为当输入框被清空时，value会变成null导致输入框消失
	baseInfo: {
        height: string,
        mid_height: string,
        weight: string,
        mid_weight: string,
        head_circum: string,
        breast_circum: string,
        body_temperature: string,
        breathe: string,
        blood_pressure: string,
		teeth: string,
    };
	status: string;
	childId: string;
	editType: string;
	// 主诉模板
	cprtemplateList: any[];
	cprtemplate: string;
	// 不可连续点击
	btnCanEdit: boolean;
	// 是否可以修改药方
	canUpdatePrescript: boolean;
	// 实际操作人
	actualOperator: {
		use: boolean,
		name: string,
	}
	operator: string;
	casehistory_id: string;
	qiniuToken: string;
	upload_multiple: boolean;
	acceptType: string;
	selectFile: {
		file: string,
		url: string,
		showImg: number,
	}
	modalConfirmTab: boolean;
	createType: string;
	// 最初数据
	infoOld: any;
	// 实时监控数据
	infoTime: any;
	timeSaveInterval: any;
	timeCheckInterval: any;
	printCSS:any;
	printStyle:any;
	hasTemplet:boolean;
	caseHistory: {
		hasData: boolean,
		showTab: boolean,
		list: any[],
	}

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private doctorService: DoctorService,
		private route: ActivatedRoute,
		private router: Router,
		private uploadService: UploadService,
		private dialogService: DialogService,
	) {
		this.printCSS = ['../../../../assets/css/pure.min.css','../../../../assets/css/_flex.scss'];

		this.printStyle =
		`
		*{
			box-sizing: border-box;
			margin:0px;
			font-size:16px;
			font-family:"黑体";
			color:#333;
		}
		.pure-tab{
			page-break-before: always;
		}
		.section{
			margin-top: 20px;
	    	border: 1px solid #f5f5f5;
		}
		.pure-tab .pure-u-8-24.bt,.pure-tab .pure-u-24-24.bt{
			border-top: 1px solid #efefef;
		}
		.title{
			background-color: #dedede;
			padding: 10px;
		}
		.info{
			padding:10px;
		}
		`;
	}

	ngOnDestroy(){
    	window.clearInterval(this.timeSaveInterval);
    	window.clearInterval(this.timeCheckInterval);
	}

	ngOnInit(): void{
		this.topBar = {
			title: '接诊',
			back: true,
			back_url: './admin/bookingReceive',
		}

		this.hasTemplet = true;

		this.info = {
			child_id:'',
			booking_id:'',
			name: '',
			age: '',
			weight: '',
			mid_weight: '',
			compare_weight: '',
			height: '',
			mid_height: '',
			compare_height: '',
			head_circum: '',
			breast_circum: '',
			teeth: '',
			topic_comment: '',
			check_result: '',
			present_illness: '',
			previous_history: '',
			allergy: '',
			family_history: '',
			breed_history: '',
			growth_history: '',
			physical_check: '',
			body_temperature: '',
			breathe: '',
			blood_pressure: '',
			face_neck: '',
			face_neck_other: '',
			files: [],
			heart_lung: '',
			heart_lung_other: '',
			abdomen: '',
			abdomen_other: '',
			limbs: '',
			limbs_other: '',
			nervous_system: '',
			nervous_system_other: '',
			blood_routine_examination: '',
			blood_routine_examination_other: '',
			routine_urine: '',
			routine_urine_other: '',
			bone_density: '',
			BALP: '',
			BALP_other: '',
			trace_element: '',
			trace_element_other: '',
			diagnosis: '',
			prescription: '',
			advise: '',
			time: '',
			timeText: '',
			checkList: [],
			checkId: '',
		}
		this.infoOld = JSON.parse(JSON.stringify(this.info));
		this.infoTime = JSON.parse(JSON.stringify(this.info));
		this.baseInfo = {
			height: '',
			mid_height: '',
			weight: '',
			mid_weight: '',
			head_circum: '',
			breast_circum: '',
			body_temperature: '',
			breathe: '',
			blood_pressure: '',
			teeth: '',
		}

		this.loadingShow = true;

		this.id = '';
		this.doctorId = '';
		this.pageType = '';
		this.editType = '';

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
			this.id = params.id;
			this.doctorId = params.doctorId;
			this.pageType = params.pageType;
		});

		this.canUpdatePrescript = false;

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;

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

		this.showExamination = false;

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

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}
		this.operator = this.adminService.isFalse(this.actualOperator.name) ? '' : this.actualOperator.name;

		//获取预约信息
		this.getBookingData();
		//获取开方信息
		// this.prescriptList = [];
		// this.prescription = [];

		this.casehistoryList = [];

		this.casehistory_id = '';
		this.qiniuToken = '';
		this.upload_multiple = true;
		this.acceptType = 'image/*, application/pdf';
		this.selectFile = {
			file: '',
			url: '',
			showImg: 0,
		}
		this.modalConfirmTab = false;
		this.getQiniuToken();
		this.createType = '';

		this.showExamination = false;

		this.btnCanEdit = false;
		this.caseHistory = {
			hasData: false,
			showTab: false,
			list: [],
		}

		sessionStorage.setItem('canDeactivate', 'casehistory');
	}

	saveInterval() {
		var saveNum = 0;
		return setInterval(() => {
			saveNum++
	    	if (JSON.stringify(this.info) != JSON.stringify(this.infoOld)) {
				if(this.pageType == 'examine'){
					this.create('');
				}else{
					this.create('');
				}
	    	}
        }, 60000 * 5);
	}

	intervalChange() {
		window.clearInterval(this.timeSaveInterval);
		window.clearInterval(this.timeCheckInterval);
		var checkNum = 0;
		this.timeSaveInterval = this.saveInterval();
		this.timeCheckInterval = setInterval(() => {
			checkNum++;
    		if (JSON.stringify(this.info) != JSON.stringify(this.infoTime)) {
				this.infoTime = JSON.parse(JSON.stringify(this.info));
				window.clearInterval(this.timeSaveInterval);
				this.timeSaveInterval = this.saveInterval();
			}
		}, 5000);
	}

	canDeactivate(): Observable<boolean> | boolean {
    	// Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    	if (JSON.stringify(this.info) == JSON.stringify(this.infoOld)) {
      		return true;
    	}

    	// Otherwise ask the user with the dialog service and return its
    	// observable which resolves to true or false when the user decides
    	if(sessionStorage.getItem('canDeactivate') == 'casehistory_canDeactivate'){
			return true;
		}else{
    		return this.dialogService.confirm('病例尚未保存，是否离开?');
		}
  	}

	getBookingData() {
		//获取预约信息
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.weekbooks.length > 0){
					this.booking = results.weekbooks[0];
					this.hasBookingData = true;

					// 获取病例
					this.getCaseHistoryData();
				}else{
					this.loadingShow = false;
					this._message.error('数据错误');
				}
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	getCaseHistoryData(){
		//病例
		this.hasCasehistoryData = false;
		var casehistoryUrl = this.url + '&booking_id=' + this.id + '&unchecked=0';
		this.adminService.searchcasehistory(casehistoryUrl).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].time = results.list[i].time ? this.adminService.dateFormat(results.list[i].time) : results.list[i].time;
					}
					sessionStorage.setItem('casehistory', JSON.stringify(results.list[0]));
				}
				this.casehistoryList = results.list;
				this.hasCasehistoryData = true;
				if(this.casehistoryList.length == 0){
					this.editType = 'create';
					// 开启定时器
					this.intervalChange();
					// 获取病历模板
					this.getCaseHistoryTempletData();
				}else{
					this.editType = 'view';
					var casehistory =  results.list[0];
					this.structureData(casehistory);
				}
				// 若是查看历史记录
				if(this.pageType == 'history'){
					this.editType = 'view';
				}
				//获取开方信息
				this.prescriptList = [];
				this.prescription = [];
				this.getPrescriptData();
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	getCaseHistoryTempletData() {
		this.casetempletList = [];
		this.selectedTemplet = {};
		var searchcasetempletUrl = this.url + '&doctor_id=' + this.doctorId
			 + '&status=1';
		this.doctorService.searchcasetemplet(searchcasetempletUrl).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.casetempletList = results.list;
				if(this.casetempletList.length > 0){
					this.selectedTemplet = this.casetempletList[0];
					var casehistory =  [];
					this.structureData(casehistory);
				}else{
					this.hasTemplet = false;
					this.loadingShow = false;
				}
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	structureData(casehistory) {
		this.loadingShow = false;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		if(this.editType == 'update' || this.pageType == 'examine'){
			this.info = {
				child_id: this.booking.childId,
				booking_id: this.booking.bookingId,
				name: this.booking.childName,
				age: this.booking.age,
				weight: casehistory.weight,
				mid_weight: casehistory.midWeight,
				compare_weight: casehistory.compareWeight,
				height: casehistory.height,
				mid_height: casehistory.midHeight,
				compare_height: casehistory.compareHeight,
				head_circum: casehistory.headCircum,
				breast_circum: casehistory.breastCircum,
				teeth: casehistory.teeth,
				topic_comment: casehistory.topicComment,
				check_result: casehistory.checkResult,
				present_illness: casehistory.presentIllness,
				previous_history: casehistory.previousHistory,
				allergy: casehistory.allergy,
				family_history: casehistory.familyHistory,
				breed_history: casehistory.breedHistory,
				growth_history: casehistory.growthHistory,
				physical_check: casehistory.physicalCheck,
				body_temperature: casehistory.bodyTemperature,
				breathe: casehistory.breathe,
				blood_pressure: casehistory.bloodPressure,
				face_neck: casehistory.faceNeck,
				face_neck_other: casehistory.faceNeck == '未见异常' ? '' : casehistory.faceNeck,
				files: casehistory.files,
				heart_lung: casehistory.heartLung,
				heart_lung_other: casehistory.heartLung == '未见异常' ? '' : casehistory.heartLung,
				abdomen: casehistory.abdomen,
				abdomen_other: casehistory.abdomen == '未见异常' ? '' : casehistory.abdomen,
				limbs: casehistory.limbs,
				limbs_other: casehistory.limbs == '未见异常' ? '' : casehistory.limbs,
				nervous_system: casehistory.nervousSystem,
				nervous_system_other: casehistory.nervousSystem == '未见异常' ? '' : casehistory.nervousSystem,
				blood_routine_examination: casehistory.bloodRoutineExamination,
				blood_routine_examination_other: casehistory.bloodRoutineExamination == '正常' || casehistory.bloodRoutineExamination == '贫血' || casehistory.bloodRoutineExamination == '白细胞高值' ? '' : casehistory.bloodRoutineExamination,
				routine_urine: casehistory.routineUrine,
				routine_urine_other: casehistory.routineUrine == '正常' ? '' : casehistory.routineUrine,
				bone_density: casehistory.boneDensity,
				BALP: casehistory.BALP,
				BALP_other: casehistory.BALP == '正常' ? '' : casehistory.BALP,
				trace_element: casehistory.traceElement,
				trace_element_other: casehistory.traceElement == '正常' ? '' : casehistory.traceElement,
				diagnosis: casehistory.diagnosis,
				prescription: '',
				advise: casehistory.advise,
				time: casehistory.time,
				timeText: casehistory.time,
				checkList: casehistory.checkList,
				checkId: casehistory.checkId,
			}
			this.baseInfo = {
                height: casehistory.height,
                mid_height: casehistory.midHeight,
                weight: casehistory.weight,
                mid_weight: casehistory.midWeight,
                head_circum: casehistory.headCircum,
                breast_circum: casehistory.breastCircum,
                body_temperature: casehistory.bodyTemperature,
                breathe: casehistory.breathe,
                blood_pressure: casehistory.bloodPressure,
				teeth: casehistory.teeth,
            }
		}else if(this.editType == 'create'){
			this.info = {
				child_id: this.booking.childId,
				booking_id: this.booking.bookingId,
				name: this.booking.childName,
				age: this.booking.age,
				weight: null,
				mid_weight: null,
				compare_weight: null,
				height: null,
				mid_height: null,
				compare_height: null,
				head_circum: null,
				breast_circum: null,
				teeth: null,
				topic_comment: null,
				check_result: null,
				present_illness: null,
				previous_history: null,
				allergy: null,
				family_history: null,
				breed_history: null,
				growth_history: null,
				physical_check: null,
				body_temperature: null,
				breathe: null,
				blood_pressure: null,
				face_neck: null,
				face_neck_other: '',
				files: [],
				heart_lung: null,
				heart_lung_other: '',
				abdomen: null,
				abdomen_other: '',
				limbs: null,
				limbs_other: '',
				nervous_system: null,
				nervous_system_other: '',
				blood_routine_examination: null,
				blood_routine_examination_other: '',
				routine_urine: null,
				routine_urine_other: '',
				bone_density: null,
				BALP: null,
				BALP_other: '',
				trace_element: null,
				trace_element_other: '',
				diagnosis: null,
				prescription: '',
				advise: null,
				time: '',
				timeText: '',
				checkList: [],
				checkId: '',
			}
			this.baseInfo = {
                height: null,
                mid_height: null,
                weight: null,
                mid_weight: null,
                head_circum: null,
                breast_circum: null,
                body_temperature: null,
                breathe: null,
                blood_pressure: null,
				teeth:null,
            }
			//中等值身高体重
			var childcontrastUrl = '?child_id=' + this.booking.childId;
			 this.adminService.childcontrast(childcontrastUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var childcontrast = JSON.parse(JSON.stringify(data.results));
					this.structureTempletData(childcontrast);
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}

		// 主诉模板
		this.cprtemplateList = [];
		this.cprtemplate = '';
		this.adminService.cprtemplate(this.url).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.template.length > 0){
					for(var i = 0; i < results.template.length; i++){
						results.template[i].string = JSON.stringify(results.template[i]);
					}
				}
				this.cprtemplateList = results.template;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
		this.infoOld = JSON.parse(JSON.stringify(this.info));
		this.infoTime = JSON.parse(JSON.stringify(this.info));
	}

	structureTempletData(childcontrast){
		var caseTemplet = this.selectedTemplet;
		if(caseTemplet != null){
			if(caseTemplet.casekeys.length > 0){
				for(var i = 0; i < caseTemplet.casekeys.length; i++){
					if(caseTemplet.casekeys[i].value == ''){
						this.info[caseTemplet.casekeys[i].key] = '';
					}else{
						if(this.info[caseTemplet.casekeys[i].key+'_other'] != 'undefined'){
							this.info[caseTemplet.casekeys[i].key+'_other'] = caseTemplet.casekeys[i].value;
						}
							this.info[caseTemplet.casekeys[i].key]	= caseTemplet.casekeys[i].value;
					}
					//this.info[caseTemplet.casekeys[i].key] = '';
					this.baseInfo[caseTemplet.casekeys[i].key] = '';
					if(caseTemplet.casekeys[i].key=='mid_height'){
						if(childcontrast.info){
							this.info.mid_height = childcontrast.info.height;
						}else{
							this.info.mid_height = '';
						}
					}
					if(caseTemplet.casekeys[i].key=='mid_weight' && caseTemplet.casekeys[i].value == ''){
						if(childcontrast.info){
							this.info.mid_weight = childcontrast.info.weight;
						}else{
							this.info.mid_weight = '';
						}
					}
					if(caseTemplet.casekeys[i].key == 'previous_history' && caseTemplet.casekeys[i].value == ''){
						this.info.previous_history = '否认肝炎、结核病史及接触史，无药物过敏史';
					}
					if(caseTemplet.casekeys[i].key=='face_neck' && caseTemplet.casekeys[i].value == ''){
							this.info.face_neck = '未见异常';
					}
					if(caseTemplet.casekeys[i].key=='heart_lung' && caseTemplet.casekeys[i].value == ''){
							this.info.heart_lung = '未见异常';
					}
					if(caseTemplet.casekeys[i].key=='abdomen' && caseTemplet.casekeys[i].value == ''){
							this.info.abdomen = '未见异常';
					}
					if(caseTemplet.casekeys[i].key=='limbs' && caseTemplet.casekeys[i].value == ''){
							this.info.limbs = '未见异常';
					}
					if(caseTemplet.casekeys[i].key=='nervous_system' && caseTemplet.casekeys[i].value == ''){
							this.info.nervous_system = '未见异常';
					}
				}
			}
			this.infoOld = JSON.parse(JSON.stringify(this.info));
			this.infoTime = JSON.parse(JSON.stringify(this.info));
		}
		// 若就诊管理中，添加了小孩临时信息，则直接使用
		if(this.info.height != null || this.info.weight != null || this.info.breathe != null || this.info.body_temperature != null || this.info.blood_pressure){
			var childinfoUrl = this.url + '&child_id=' + this.booking.childId;
			this.adminService.getChildinfo(childinfoUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.childInfo != null){
						if(this.info.height != null && results.childInfo.height != null){
							this.info.height = results.childInfo.height;
						}
						if(this.info.weight != null && results.childInfo.weight != null){
							this.info.weight = results.childInfo.weight;
						}
						if(this.info.breathe != null && results.childInfo.breathe != null){
							this.info.breathe = results.childInfo.breathe;
						}
						if(this.info.body_temperature != null && results.childInfo.bodyTemperature != null){
							this.info.body_temperature = results.childInfo.bodyTemperature;
						}
						if(this.info.blood_pressure != null && results.childInfo.bloodPressure != null){
							this.info.blood_pressure = results.childInfo.bloodPressure;
						}
						if(this.info.head_circum != null && results.childInfo.headCircum != null){
							this.info.head_circum = results.childInfo.headCircum;
						}
						if(this.info.breast_circum != null && results.childInfo.breastCircum != null){
							this.info.breast_circum = results.childInfo.breastCircum;
						}
					}
					this.infoOld = JSON.parse(JSON.stringify(this.info));
					this.infoTime = JSON.parse(JSON.stringify(this.info));
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}
		// 获取儿保记录，若是身高、体重、头围、体温等信息已存在，则直接使用
		if(this.info.height != null || this.info.weight != null || this.info.head_circum != null || this.info.body_temperature != null){
			var healthrecordUrl = this.url + '&booking_id=' + this.id;
			this.adminService.searchhealthrecord(healthrecordUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.list.length > 0){
						if(this.info.height != null && results.list[0].height && parseFloat(results.list[0].height) != 0){
							this.info.height = results.list[0].height;
						}
						if(this.info.weight != null && results.list[0].weight && parseFloat(results.list[0].weight) != 0){
							this.info.weight = results.list[0].weight;
						}
						if(this.info.head_circum != null && results.list[0].headCircum && parseFloat(results.list[0].headCircum) != 0){
							this.info.head_circum = results.list[0].headCircum;
						}
						if(this.info.body_temperature != null && results.list[0].bodyTemperature && parseFloat(results.list[0].bodyTemperature) != 0){
							this.info.body_temperature = results.list[0].bodyTemperature;
						}
					}
					this.infoOld = JSON.parse(JSON.stringify(this.info));
					this.infoTime = JSON.parse(JSON.stringify(this.info));
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}

		// 获取实验室检查信息
		this.getBookingCheckList();
	}

	// 选择实际操作人
	selectOperator(_value) {
		this.operator = _value;
	}

	getPrescriptData() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&isout=1&today=1';
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					if(this.status != '5' && !results.list[0].apotId){
						this.canUpdatePrescript = true;
					}
				}
				this.prescriptList = results.list;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	changeTab(_value, url) {
		sessionStorage.setItem('doctorBookingTab', _value);
		// pageType 空为医生接诊, history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.loadingShow = true;
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
	}

	// 体格检查
	changeExamination() {
		this.showExamination = !this.showExamination;
	}

	// 切换模板
	changeTemplet() {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		if(!this.selectedTemplet.id){
			this._message.error('请先选择模板');
			return;
		}
		this.editType = 'create';
		// 开启定时器
		this.intervalChange();
		this.structureData([]);
	}

	// 修改病历
	updateCaseHistory(casehistory) {
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		this.editType = 'update';
		// 开启定时器
		this.intervalChange();
		this.structureData(casehistory);
		this.btnCanEdit = false;
	}

	// 取消修改
	cancel() {
		this.editType = 'view';
	}

	getBookingCheckList(){
		var urlOptions = this.url + '&booking_id=' + this.id + '&today=1';
		this.adminService.usercheckprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.info.checkList = results.list;
				this.infoOld = JSON.parse(JSON.stringify(this.info));
				this.infoTime = JSON.parse(JSON.stringify(this.info));
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

    // 身高对比
    changeHeight() {
		if(!this.adminService.isFalse(this.info.height) && parseFloat(this.info.height) < 0){
			this._message.error('身高应大于0');
			return;
		}
		if(!this.adminService.isFalse(this.info.mid_height) && parseFloat(this.info.mid_height) < 0){
			this._message.error('中等值应大于0');
			return;
		}
        if(this.adminService.isFalse(this.info.height) || this.adminService.isFalse(this.info.mid_height)){
            this.info.compare_height = '';
            return;
        }
        var compare = this.adminService.toDecimal2((parseFloat(this.info.height) - parseFloat(this.info.mid_height)) / parseFloat(this.info.mid_height) * 100);
        this.info.compare_height = (parseFloat(compare) < 0 ? '低' : '高') + (this.adminService.toDecimal2(parseFloat(compare) * (parseFloat(compare) < 0 ? -1 : 1))) + '%';
    }

    // 体重对比
    changeWeight() {
		if(!this.adminService.isFalse(this.info.weight) && parseFloat(this.info.weight) < 0){
			this._message.error('体重应大于0');
			return;
		}
		if(!this.adminService.isFalse(this.info.mid_weight) && parseFloat(this.info.mid_weight) < 0){
			this._message.error('中等值应大于0');
			return;
		}
        if(this.adminService.isFalse(this.info.weight) || this.adminService.isFalse(this.info.mid_weight)){
            this.info.compare_weight = '';
            return;
        }
        var compare = this.adminService.toDecimal2((parseFloat(this.info.weight) - parseFloat(this.info.mid_weight)) / parseFloat(this.info.mid_weight));
        this.info.compare_weight = (parseFloat(compare) < 0 ? '低' : '高') + (this.adminService.toDecimal2(parseFloat(compare) * 100 * (parseFloat(compare) < 0 ? -1 : 1))) + '%';
    }

	//redio切换
	changeRedio(_value, _key) {
        if(_key.indexOf('_other') != -1){
            this.info[_key.slice(0, _key.indexOf('_other'))] = '';
            return;
        }
        this.info[_key + '_other'] = '';
		this.info[_key] = _value;
	}

	// 主诉模板切换
	changeCprtemplate() {
		if(this.info.diagnosis != null){
			this.info.diagnosis = JSON.parse(this.cprtemplate).action;
		}
		if(this.info.physical_check != null){
			this.info.physical_check = JSON.parse(this.cprtemplate).peValue;
		}
	}

	// 日期
	changeDate(_value) {
		this.info.time = JSON.parse(_value).value;
	}

	validateNumber(type, info) {
		if(!this.adminService.isFalse(this.info[type]) && Number(this.info[type]) < 0){
			this._message.error(info + '应大于0');
			return false;
		}
		return true;
	}

	// 去修改药方
	updatePrescript() {
		if(this.prescriptList.length > 0){
			var prescript = this.prescriptList[0];
			sessionStorage.setItem('prescript', JSON.stringify(prescript));
			this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: prescript.id}});
		}
	}

	create(type) {
		// 审核状态下，只保存，不审核，完成操作后，仍属于审核状态
		this.createType = type;
		if(this.actualOperator.use && this.operator == ''){
			this._message.error('请选择实际操作人');
			return;
		}
		this.btnCanEdit = true;
		this.info.topic_comment = this.adminService.trim(this.info.topic_comment);
		this.info.check_result = this.adminService.trim(this.info.check_result);
		this.info.present_illness = this.adminService.trim(this.info.present_illness);
		this.info.previous_history = this.adminService.trim(this.info.previous_history);
		this.info.allergy = this.adminService.trim(this.info.allergy);
		this.info.family_history = this.adminService.trim(this.info.family_history);
		this.info.breed_history = this.adminService.trim(this.info.breed_history);
		this.info.growth_history = this.adminService.trim(this.info.growth_history);
		this.info.physical_check = this.adminService.trim(this.info.physical_check);
		this.info.face_neck = this.adminService.trim(this.info.face_neck);
		this.info.heart_lung = this.adminService.trim(this.info.heart_lung);
		this.info.abdomen = this.adminService.trim(this.info.abdomen);
		this.info.limbs = this.adminService.trim(this.info.limbs);
		this.info.nervous_system = this.adminService.trim(this.info.nervous_system);
		this.info.diagnosis = this.adminService.trim(this.info.diagnosis);
		this.info.advise = this.adminService.trim(this.info.advise);
		if(!this.validateNumber('weight', '体重')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('mid_weight', '体重中等值')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('height', '身高')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('mid_height', '身高中等值')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('head_circum', '头围')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('breast_circum', '胸围')){
			this.btnCanEdit = false;
			return;
		}
		// if(!this.validateNumber('teeth', '出牙数')){
		// 	this.btnCanEdit = false;
		// 	return;
		// }
		if(!this.validateNumber('body_temperature', '体温')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('breathe', '呼吸')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('blood_pressure', '血压')){
			this.btnCanEdit = false;
			return;
		}
		this.loadingShow = true;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			child_id: this.info.child_id,
			booking_id: this.info.booking_id,
			weight: this.info.weight == null ? (this.baseInfo.weight == null ? null : '') : this.info.weight,
			mid_weight: this.info.mid_weight == null ? (this.baseInfo.mid_weight == null ? null : '') : this.info.mid_weight,
			compare_weight: this.info.compare_weight,
			height: this.info.height == null ? (this.baseInfo.height == null ? null : '') : this.info.height,
			mid_height: this.info.mid_height == null ? (this.baseInfo.mid_height == null ? null : '') : this.info.mid_height,
			compare_height: this.info.compare_height,
			head_circum: this.info.head_circum == null ? (this.baseInfo.head_circum == null ? null : '') : this.info.head_circum,
			breast_circum: this.info.breast_circum == null ? (this.baseInfo.breast_circum == null ? null : '') : this.info.breast_circum,
			teeth: this.info.teeth == null ? (this.baseInfo.teeth == null ? null : '') : this.info.teeth,
			topic_comment: this.info.topic_comment,
			check_result: this.info.check_result,
			present_illness: this.info.present_illness,
			previous_history: this.info.previous_history,
			allergy: this.info.allergy,
			family_history: this.info.family_history,
			breed_history: this.info.breed_history,
			growth_history: this.info.growth_history,
			physical_check: this.info.physical_check,
			body_temperature: this.info.body_temperature == null ? (this.baseInfo.body_temperature == null ? null : '') : this.info.body_temperature,
			breathe: this.info.breathe == null ? (this.baseInfo.breathe == null ? null : '') : this.info.breathe,
			blood_pressure: this.info.blood_pressure == null ? (this.baseInfo.blood_pressure == null ? null : '') : this.info.blood_pressure,
			face_neck: this.info.face_neck != '' ? this.info.face_neck : this.info.face_neck_other,
			heart_lung: this.info.heart_lung != '' ? this.info.heart_lung : this.info.heart_lung_other,
			abdomen: this.info.abdomen != '' ? this.info.abdomen : this.info.abdomen_other,
			limbs: this.info.limbs != '' ? this.info.limbs : this.info.limbs_other,
			nervous_system: this.info.nervous_system != '' ? this.info.nervous_system : this.info.nervous_system_other,
			blood_routine_examination: this.info.blood_routine_examination == '' ? this.info.blood_routine_examination_other : this.info.blood_routine_examination,
			routine_urine: this.info.routine_urine == '' ? this.info.routine_urine_other : this.info.routine_urine,
			bone_density: this.info.bone_density,
			BALP: this.info.BALP == '' ? this.info.BALP_other : this.info.BALP,
			trace_element: this.info.trace_element == '' ? this.info.trace_element_other : this.info.trace_element,
			diagnosis: this.info.diagnosis,
			advise: this.info.advise,
			time: this.info.time == '' ? this.adminService.dateFormatHasWord(this.booking.bookingDate) : this.adminService.dateFormatHasWord(this.info.time),
			true_id: this.actualOperator.use ? JSON.parse(this.operator).id : null,
			true_name: this.actualOperator.use ? JSON.parse(this.operator).realName : null,
			is_check: type == '' ? null : '1',
		}

		var urlOptions = '';
		if(this.editType == 'create'){
			urlOptions = '';
		}else{
			urlOptions = '/' + JSON.parse(sessionStorage.getItem('casehistory')).id;
		}
		if(type == '' && this.pageType != 'examine'){
			this.adminService.casehistory(urlOptions, params).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.casehistory_id = results.id;
					this.uploadService.startUpload();
				}
			}).catch(() => {
				this.loadingShow = false;
				this._message.error('服务器错误');
				this.btnCanEdit = false;
			});
		}else{
			this.adminService.checkcasehistory(urlOptions, params).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this._message.error(data.errorMsg);
					this.btnCanEdit = false;
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.casehistory_id = results.id;
					// 查看状态，无需再次上传文件
					if(this.editType == 'view'){
						this.complete();
					}else{
						this.uploadService.startUpload();
					}
				}
			}).catch(() => {
				this.loadingShow = false;
				this._message.error('服务器错误');
				this.btnCanEdit = false;
			});
		}
		this.infoOld = JSON.parse(JSON.stringify(this.info));
		this.infoTime = JSON.parse(JSON.stringify(this.info));
	}

	showFile(file) {
		if(file.mimeType == 'image'){
			this.selectFile.url = file.fileUrl;
			this.selectFile.showImg = 1;
		}else{
			window.open(file.fileUrl);
		}
	}

	closeImg() {
		this.selectFile = {
			file: '',
			url: '',
			showImg: 0,
		}
	}

	delete(file) {
		this.selectFile = {
			file: JSON.stringify(file),
			url: '',
			showImg: 0,
		}
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirmDelete() {
		var urlOptions = JSON.parse(this.selectFile.file).fileId + '?username=' + this.adminService.getUser().username
			+ '&token=' + this.adminService.getUser().token;
		this.adminService.deletechfile(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this.modalConfirmTab = false;
				this._message.success('文件删除成功');
				for(var i = 0; i < this.info.files.length; i++){
					if(JSON.parse(this.selectFile.file).fileId == this.info.files[i].fileId){
						if(this.casehistoryList.length > 0){
							this.casehistoryList[0].files.splice(i, 1);
						}
						this.info.files.splice(i, 1);
					}
				}
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	getQiniuToken() {
		//获取头像上传token
		var tokenUrl  = '?type=childCircle';
		this.adminService.qiniutoken(tokenUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this.qiniuToken = JSON.parse(JSON.stringify(data)).uptoken;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	errorUpload($event) {
		this._message.error($event.errorMsg);
	}

	successUpload($event) {
		var fileList = $event.fileList;
		if(fileList.length > 0){
			var flist = [];
			for(var i = 0; i < fileList.length; i++){
				if(fileList[i].uploadStatus == 'success'){
					var fileInfo = {
						case_id: this.editType == 'create' ? this.casehistory_id : JSON.parse(sessionStorage.getItem('casehistory')).id,
						file_ext: fileList[i].name.substr(fileList[i].name.lastIndexOf('.')+1),
						file_size: fileList[i].file.size,
						file_name: fileList[i].name,
						remote_domain: 'http://bcircle.meb.meb168.com',
						remote_file_key: fileList[i].key,
						mime_type: fileList[i].isImg ? 'image' : '',
					}
					flist.push(fileInfo);
				}
			}
			if(flist.length > 0){
				var params = {
					flist: flist,
				}
				this.adminService.uploadcasehistory(params).then((data) => {
					if(data.errorMsg == 'no'){
						this.loadingShow = false;
						this._message.error(data.errorMsg);
						this.btnCanEdit = false;
					}else{
						this.complete();
					}
				}).catch(() => {
					this.loadingShow = false;
					this._message.error('服务器错误');
					this.btnCanEdit = false;
				});
			}else{
				this.complete();
			}
		}else{
			this.complete();
		}
	}

	complete() {
		this.loadingShow = false;
		if(this.pageType == 'examine'){
			if(this.createType == ''){
				this._message.success('病例修改成功');
			}else{
				this._message.success('审核通过');
			}
			if(this.casehistoryList[0].checkId == null){
				setTimeout(() => {
					this.router.navigate(['./admin/booking/examine/case']);
				}, 2000);
			}else{
				this._message.success(this.editType == 'create' ? '病历创建成功' : '病历修改成功');
				setTimeout(() => {
					this.router.navigate(['./admin/repage'], {queryParams: {from:'docbooking/casehistory', id: this.id, doctorId: this.doctorId, pageType:'examine'}});
					this.editType = 'view';
				}, 2000);
			}
		}else{
			this._message.success(this.editType == 'create' ? '病历创建成功' : '病历修改成功');
			setTimeout(() => {
				this.router.navigate(['./admin/repage'], {queryParams: {from:'docbooking/casehistory', id: this.id, doctorId: this.doctorId}});
				this.editType = 'view';
			}, 2000);
		}
	}

	// 往期病例
	showCaseHistory() {
		if(!this.caseHistory.hasData){
			this.loadingShow = true;
			var urlOptions = this.url + '&child_id=' + this.booking.childId + '&doctor_id=' + this.doctorId + '&unchecked=0';
			this.adminService.searchcasehistory(urlOptions).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.list.length > 0){
						for(var i = 0; i < results.list.length; i++){
							results.list[i].time = results.list[i].time ? this.adminService.dateFormat(results.list[i].time) : results.list[i].time;
						}
					}
					this.loadingShow = false;
					this.caseHistory = {
						hasData: true,
						showTab: true,
						list: results.list,
					}
				}
			}).catch(() => {
				this.loadingShow = false;
				this._message.error('服务器错误');
			});
		}else{
			this.caseHistory.showTab = true;
		}
	}

	closeCaseHistory() {
		this.caseHistory.showTab = false;
	}

	copyCase(caseH) {
		var keyList = [
			{
				info_key: 'weight',
				key: 'weight',
			},
			{
				info_key: 'mid_weight',
				key: 'midWeight',
			},
			{
				info_key: 'compare_weight',
				key: 'compareWeight',
			},
			{
				info_key: 'height',
				key: 'height',
			},
			{
				info_key: 'mid_height',
				key: 'midHeight',
			},
			{
				info_key: 'compare_height',
				key: 'compareHeight',
			},
			{
				info_key: 'head_circum',
				key: 'headCircum',
			},
			{
				info_key: 'breast_circum',
				key: 'breastCircum',
			},
			{
				info_key: 'teeth',
				key: 'teeth',
			},
			{
				info_key: 'topic_comment',
				key: 'topicComment',
			},
			{
				info_key: 'check_result',
				key: 'checkResult',
			},
			{
				info_key: 'present_illness',
				key: 'presentIllness',
			},
			{
				info_key: 'previous_history',
				key: 'previousHistory',
			},
			{
				info_key: 'allergy',
				key: 'allergy',
			},
			{
				info_key: 'family_history',
				key: 'familyHistory',
			},
			{
				info_key: 'breed_history',
				key: 'breedHistory',
			},
			{
				info_key: 'growth_history',
				key: 'growthHistory',
			},
			{
				info_key: 'physical_check',
				key: 'physicalCheck',
			},
			{
				info_key: 'body_temperature',
				key: 'bodyTemperature',
			},
			{
				info_key: 'breathe',
				key: 'breathe',
			},
			{
				info_key: 'blood_pressure',
				key: 'bloodPressure',
			},
			{
				info_key: 'face_neck',
				key: 'faceNeck',
			},
			{
				info_key: 'face_neck_other',
				key: 'faceNeck',
			},
			{
				info_key: 'heart_lung',
				key: 'heartLung',
			},
			{
				info_key: 'heart_lung_other',
				key: 'heartLung',
			},
			{
				info_key: 'abdomen',
				key: 'abdomen',
			},
			{
				info_key: 'abdomen_other',
				key: 'abdomen',
			},
			{
				info_key: 'limbs',
				key: 'limbs',
			},
			{
				info_key: 'limbs_other',
				key: 'limbs',
			},
			{
				info_key: 'nervous_system',
				key: 'nervousSystem',
			},
			{
				info_key: 'nervous_system_other',
				key: 'nervousSystem',
			},
			{
				info_key: 'blood_routine_examination',
				key: 'bloodRoutineExamination',
			},
			{
				info_key: 'blood_routine_examination_other',
				key: 'bloodRoutineExamination',
			},
			{
				info_key: 'routine_urine',
				key: 'routineUrine',
			},
			{
				info_key: 'routine_urine_other',
				key: 'routineUrine',
			},
			{
				info_key: 'bone_density',
				key: 'boneDensity',
			},
			{
				info_key: 'BALP',
				key: 'BALP',
			},
			{
				info_key: 'BALP_other',
				key: 'BALP',
			},
			{
				info_key: 'trace_element',
				key: 'traceElement',
			},
			{
				info_key: 'trace_element_other',
				key: 'traceElement',
			},
			{
				info_key: 'diagnosis',
				key: 'diagnosis',
			},
			{
				info_key: 'advise',
				key: 'advise',
			},
		]
		for(var key of keyList){
			if(this.info[key.info_key] != null && caseH[key.key] != null){
				this.info[key.info_key] = caseH[key.key];
			}
		}
		this.caseHistory.showTab = false;
	}
}
