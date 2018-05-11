import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../../admin.service';
import { DoctorService }                      from '../../doctor/doctor.service';
import { DialogService }                      from '../../dialog.service';
import { Observable }                         from 'rxjs';

import { UploadService }                      from '../../../common/nll-upload/upload.service';

@Component({
	selector: 'admin-doctor-booking-casehistory',
	templateUrl: './docbooking-casehistory.component.html',
	styleUrls: ['./docbooking-casehistory.component.scss'],
})
export class DocbookingCasehistoryComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
		back_url: string,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
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
	canEdit: boolean;
	//病历
	casehistoryList: any[];
	hasCasehistoryData: boolean;
	//病历模板
	selectedTemplet: string;
	casetempletList: any[];
	// 药方
	prescriptList: any[];
	prescription: any[];
	// pageType 空为医生接诊， history为查看
	pageType: string;
	// 体格检查
	showExamination: boolean;
	// 就诊记录
	historyHealthRList: any[];
	historyHealthR: any[];
	historyHealthRBookingFirst: any[];
	historyHealthRBookingLast: any[];
	selectedHistoryHealthRTab: string;
	historyList: any[];
	hasHistoryData: boolean;
	modalTab: boolean;
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
	adminList: any[];
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
	searchInfo: {
		doctor_id: string;
		service_id: string;
		bdate_less: string,
		bdate_less_num: number,
		bdate_less_text: string,
		bdate_big: string,
		bdate_big_num: number,
		bdate_big_text: string,
	};
	doctorlist: any[];
	servicelist: [{}];
	createType: string;
	// 最初数据
	infoOld: any;
	// 实时监控数据
	infoTime: any;
	timeSaveInterval: any;
	timeCheckInterval: any;

	constructor(
		private adminService: AdminService,
		private doctorService: DoctorService,
		private route: ActivatedRoute,
		private router: Router,
		private uploadService: UploadService,
		private dialogService: DialogService,
	) {}

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
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

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
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			bdate_less: '',
			bdate_less_num: 0,
			bdate_less_text: '',
			bdate_big: '',
			bdate_big_num: 0,
			bdate_big_text: '',
		}

		this.loadingShow = true;

		this.id = '';
		this.doctorId = '';
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
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					this.doctorInfo = results.adminlist[0];
				}
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}
		this.adminList = [];
		this.operator = this.adminService.isFalse(this.actualOperator.name) ? '' : this.actualOperator.name;
		if(this.actualOperator.use){
			// 获取护士列表
			var adminlistUrl = this.url + '&role=3';
			this.adminService.adminlist(adminlistUrl).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.adminlist.length > 0){
						for(var i = 0; i < results.adminlist.length; i++){
							var admin = {
								key: JSON.stringify({
									id: results.adminlist[i].id,
									realName: results.adminlist[i].realName,
								}),
								value: results.adminlist[i].realName,
							}
							this.adminList.push(admin);
						}
					}
				}
			}).catch(() => {
				this.toastTab('服务器错误', 'error');
			});
		}
		//获取预约信息
		this.getBookingData();
		//获取开方信息
		// this.prescriptList = [];
		// this.prescription = [];

		this.historyList = [];
		this.hasHistoryData = false;
		this.modalTab = false;

		this.casehistoryList = [];
		this.historyHealthRList = [];
		this.historyHealthR = [];
		this.historyHealthRBookingFirst = [];
		this.historyHealthRBookingLast = [];
		this.selectedHistoryHealthRTab = '1';

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
		this.getDoctorList();
		this.getServiceList();

		sessionStorage.setItem('canDeactivate', 'casehistory');
	}

	saveInterval() {
		var saveNum = 0;
		return setInterval(() => {
			saveNum++
			console.log('保存');
	    	if (JSON.stringify(this.info) != JSON.stringify(this.infoOld)) {
				if(this.pageType == 'examine'){
					this.create('examine');
				}else{
					this.create('');
				}
	    	}
		}, 5000);
	}

	intervalChange() {
		window.clearInterval(this.timeSaveInterval);
		window.clearInterval(this.timeCheckInterval);
		var checkNum = 0;
		this.timeSaveInterval = this.saveInterval();
		this.timeCheckInterval = setInterval(() => {
			checkNum++;
			console.log('检测');
    		if (JSON.stringify(this.info) != JSON.stringify(this.infoTime)) {
				this.infoTime = JSON.parse(JSON.stringify(this.info));
				window.clearInterval(this.timeSaveInterval);
				console.log('清除定时器，重新验证');
				this.timeSaveInterval = this.saveInterval();
			}
		}, 1000);
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

	initEdit(doctorBooking,casehistory) {
		this.loadingShow = false;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		if(this.editType == 'update' || this.pageType == 'examine'){
			this.info = {
				child_id: doctorBooking.childId,
				booking_id: doctorBooking.bookingId,
				name: doctorBooking.childName,
				age: doctorBooking.age,
				weight: casehistory.weight == '0.00' ? '' : casehistory.weight,
				mid_weight: casehistory.midWeight == '0.00' ? '' : casehistory.midWeight,
				compare_weight: casehistory.compareWeight,
				height: casehistory.height == '0.00' ? '' : casehistory.height,
				mid_height: casehistory.midHeight == '0.00' ? '' : casehistory.midHeight,
				compare_height: casehistory.compareHeight,
				head_circum: casehistory.headCircum == '0.00' ? '' : casehistory.headCircum,
				breast_circum: casehistory.breastCircum == '0.00' ? '' : casehistory.breastCircum,
				teeth: casehistory.teeth == '0' ? '' : casehistory.teeth,
				topic_comment: casehistory.topicComment,
				check_result: casehistory.checkResult,
				present_illness: casehistory.presentIllness,
				previous_history: casehistory.previousHistory,
				allergy: casehistory.allergy,
				family_history: casehistory.familyHistory,
				breed_history: casehistory.breedHistory,
				growth_history: casehistory.growthHistory,
				physical_check: casehistory.physicalCheck,
				body_temperature: casehistory.bodyTemperature == '0' ? '' : casehistory.bodyTemperature,
				breathe: casehistory.breathe == '0' ? '' : casehistory.breathe,
				blood_pressure: casehistory.bloodPressure == '0' ? '' : casehistory.bloodPressure,
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
				child_id: doctorBooking.childId,
				booking_id: doctorBooking.bookingId,
				name: doctorBooking.childName,
				age: doctorBooking.age,
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
			var childcontrastUrl = '?child_id=' + doctorBooking.childId;
			 this.adminService.childcontrast(childcontrastUrl).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					// sessionStorage.setItem('childcontrast', JSON.stringify(data.results));
					var childcontrast = JSON.parse(JSON.stringify(data.results));
					this.initTemplet(childcontrast);
				}
			}).catch(() => {
				this.toastTab('服务器错误', 'error');
			});
		}

		// 主诉模板
		this.cprtemplateList = [];
		this.cprtemplate = '';
		this.adminService.cprtemplate(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
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
			this.toastTab('服务器错误', 'error');
		});
		this.infoOld = JSON.parse(JSON.stringify(this.info));
		this.infoTime = JSON.parse(JSON.stringify(this.info));
	}

	searchCaseHistory(doctorBooking){
		//病例
		this.hasCasehistoryData = false;
		var casehistoryUrl = this.url + '&booking_id=' + this.id + '&unchecked=0';
		this.adminService.searchcasehistory(casehistoryUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
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
				if(this.hasCasehistoryData && this.casehistoryList.length == 0){
					this.editType = 'create';
					// 开启定时器
					this.intervalChange();
					// 病历模板
					this.casetempletList = [];
					this.selectedTemplet = '';
					var searchcasetempletUrl = this.url + '&doctor_id=' + this.doctorId
						 + '&status=1';
					this.doctorService.searchcasetemplet(searchcasetempletUrl).then((data) => {
						if(data.status == 'no'){
							this.toastTab(data.errorMsg, 'error');
						}else{
							var results = JSON.parse(JSON.stringify(data.results));
							if(results.list.length > 0){
								for(var i = 0; i < results.list.length; i++){
									results.list[i].string = JSON.stringify(results.list[i]);
								}
							}
							this.casetempletList = results.list;
							if(this.casetempletList.length > 0){
								this.selectedTemplet = this.casetempletList[0].string;
								sessionStorage.setItem('doctorBookingCaseTemplet', JSON.stringify(this.casetempletList[0]));
								var casehistory =  [];
								this.initEdit(doctorBooking,casehistory);
							}
						}
					}).catch(() => {
		                this.toastTab('服务器错误', 'error');
		            });
				}else{
					this.editType = 'view';
					var casehistory =  results.list[0];
					this.initEdit(doctorBooking,casehistory);
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
			this.toastTab('服务器错误', 'error');
		});
	}

	initTemplet(childcontrast){
		var doctorBookingCaseTemplet = JSON.parse(sessionStorage.getItem('doctorBookingCaseTemplet'));
		if(doctorBookingCaseTemplet != null){
			if(doctorBookingCaseTemplet.casekeys.length > 0){
				for(var i = 0; i < doctorBookingCaseTemplet.casekeys.length; i++){
					if(doctorBookingCaseTemplet.casekeys[i].value == ''){
						this.info[doctorBookingCaseTemplet.casekeys[i].key] = '';
					}else{
						if(this.info[doctorBookingCaseTemplet.casekeys[i].key+'_other'] != 'undefined'){
							this.info[doctorBookingCaseTemplet.casekeys[i].key+'_other'] = doctorBookingCaseTemplet.casekeys[i].value;
						}
							this.info[doctorBookingCaseTemplet.casekeys[i].key]	= doctorBookingCaseTemplet.casekeys[i].value;
					}
					//this.info[doctorBookingCaseTemplet.casekeys[i].key] = '';
					this.baseInfo[doctorBookingCaseTemplet.casekeys[i].key] = '';
					if(doctorBookingCaseTemplet.casekeys[i].key=='mid_height'){
						if(childcontrast.info){
							this.info.mid_height = childcontrast.info.height;
						}else{
							this.info.mid_height = '';
						}
					}
					if(doctorBookingCaseTemplet.casekeys[i].key=='mid_weight' && doctorBookingCaseTemplet.casekeys[i].value == ''){
						if(childcontrast.info){
							this.info.mid_weight = childcontrast.info.weight;
						}else{
							this.info.mid_weight = '';
						}
					}
					if(doctorBookingCaseTemplet.casekeys[i].key == 'previous_history' && doctorBookingCaseTemplet.casekeys[i].value == ''){
						this.info.previous_history = '否认肝炎、结核病史及接触史，无药物过敏史';
					}
					if(doctorBookingCaseTemplet.casekeys[i].key=='face_neck' && doctorBookingCaseTemplet.casekeys[i].value == ''){
							this.info.face_neck = '未见异常';
					}
					if(doctorBookingCaseTemplet.casekeys[i].key=='heart_lung' && doctorBookingCaseTemplet.casekeys[i].value == ''){
							this.info.heart_lung = '未见异常';
					}
					if(doctorBookingCaseTemplet.casekeys[i].key=='abdomen' && doctorBookingCaseTemplet.casekeys[i].value == ''){
							this.info.abdomen = '未见异常';
					}
					if(doctorBookingCaseTemplet.casekeys[i].key=='limbs' && doctorBookingCaseTemplet.casekeys[i].value == ''){
							this.info.limbs = '未见异常';
					}
					if(doctorBookingCaseTemplet.casekeys[i].key=='nervous_system' && doctorBookingCaseTemplet.casekeys[i].value == ''){
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
					this.toastTab(data.errorMsg, 'error');
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
					}
					this.infoOld = JSON.parse(JSON.stringify(this.info));
					this.infoTime = JSON.parse(JSON.stringify(this.info));
				}
			}).catch(() => {
				this.toastTab('服务器错误', 'error');
			});
		}
		// 获取儿保记录，若是身高、体重、头围、体温等信息已存在，则直接使用
		if(this.info.height != null || this.info.weight != null || this.info.head_circum != null || this.info.body_temperature != null){
			var healthrecordUrl = this.url + '&booking_id=' + this.id;
			this.adminService.searchhealthrecord(healthrecordUrl).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
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
				this.toastTab('服务器错误', 'error');
			});
		}

		// 获取实验室检查信息
		this.getBookingCheckList();
	}

	// 选择实际操作人
	selectOperator() {
		if(this.operator == ''){
			this.toastTab('请先选择实际操作人', 'error');
			return;
		}
		sessionStorage.setItem('actualOperator', this.operator);
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&clinic_id='
			 + this.adminService.getUser().clinicId + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.servicelist = results.servicelist;
				this.servicelist.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择科室'});
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	getHistoryHealthRList() {
		var urlOptions = this.url + '&child_id=' + this.booking.childId + '&latestEarliest=1';
		this.adminService.searchhealthrecord(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].bookingDate = this.adminService.dateFormat(results.list[i].bookingDate);
					}
					this.historyHealthR.push(results.list[0]);
				}
				this.historyHealthRList = results.list;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	// 搜索历史记录
	searhShowHistory(urlOptions) {
		this.modalTab = true;
		this.hasHistoryData = false;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.historyList = results.weekbooks;
				this.hasHistoryData = true;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	//查询
	showHistory() {
		//列表
		var urlOptionsList = this.url + '&child_id=' + this.booking.childId + '&statuslist=1,2,3,4,5,11';;
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptionsList += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptionsList += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.bdate_less && this.searchInfo.bdate_less != ''){
			urlOptionsList += '&bdate_less=' + this.searchInfo.bdate_less;
		}
		if(this.searchInfo.bdate_big && this.searchInfo.bdate_big != ''){
			urlOptionsList += '&bdate_big=' + this.searchInfo.bdate_big;
		}
		this.searhShowHistory(urlOptionsList);
	}

	// 选择日期
	changeDates(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
		this.searchInfo[key + '_text'] = this.adminService.dateFormat(JSON.parse(_value).value);
	}

	close() {
		this.modalTab = false;
	}

	goHistory(history) {
		window.open('./admin/docbooking?id=' + history.bookingId + '&doctorId=' + history.services[0].userDoctorId + '&pageType=history');
	}

	getBookingData() {
		//获取预约信息
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
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
					var fees = results.weekbooks[0].fees;
					var total = 0;
					if(fees.length > 0){
						for(var i = 0; i < fees.length; i++){
							total += Number(fees[i].fee);
						}
					}
					this.booking.totalFee = this.adminService.toDecimal2(total.toString());
					var doctorBooking = this.booking
					this.searchCaseHistory(doctorBooking);
					// 获取小孩儿保记录
					this.getHistoryHealthRList();
				}
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	getPrescriptData() {
		var urlOptions = this.url + '&booking_id=' + this.id + '&isout=1&today=1';
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
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
			this.toastTab('服务器错误', 'error');
		});
	}

	changeTab(_value, url) {
		sessionStorage.setItem('doctorBookingTab', _value);
		// pageType 空为医生接诊, history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
	}

	changeHistoryHealthRTab(_value) {
		this.historyHealthR = [];
		if(_value == '1'){
			if(this.historyHealthRList.length > 0){
				this.historyHealthR.push(this.historyHealthRList[0]);
			}
		}else{
			if(this.historyHealthRList.length > 0){
				this.historyHealthR.push(this.historyHealthRList[this.historyHealthRList.length - 1]);
			}
		}
		this.selectedHistoryHealthRTab = _value;
	}

	// 体格检查
	changeExamination() {
		this.showExamination = !this.showExamination;
	}

	// 新增病历
	addCaseHistory() {
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		if(this.selectedTemplet == ''){
			this.toastTab('请先选择模板', 'error');
			return;
		}
		sessionStorage.setItem('doctorBookingCaseTemplet', this.selectedTemplet);
		//sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		//this.router.navigate(['./admin/bookingCasehistory'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
		this.editType = 'create';
		// 开启定时器
		this.intervalChange();
		this.initEdit(this.booking,[]);
	}

	// 修改病历
	updateCaseHistory(casehistory) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		//判断是否有药方
		if(this.prescriptList.length > 0){
			sessionStorage.setItem('prescript', JSON.stringify(this.prescriptList[0]));
		}else{
			sessionStorage.setItem('prescript', '');
		}
		//sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		//sessionStorage.setItem('casehistory', JSON.stringify(casehistory));
		//this.router.navigate(['./admin/bookingCasehistory'], {queryParams: {id: this.id, doctor: this.doctorId, childId: this.booking.childId, type: 'update'}});
		this.editType = 'update';
		// 开启定时器
		this.intervalChange();
		this.initEdit(this.booking,casehistory);
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
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.info.checkList = results.list;
				this.infoOld = JSON.parse(JSON.stringify(this.info));
				this.infoTime = JSON.parse(JSON.stringify(this.info));
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

    // 身高对比
    changeHeight() {
		if(this.info.height == null){
			this.info.height = '';
		}
		if(this.info.mid_height == null){
			this.info.mid_height = '';
		}
		if(this.info.compare_height == null){
			this.info.compare_height = '';
		}
		if(!this.adminService.isFalse(this.info.height) && parseFloat(this.info.height) < 0){
			this.toastTab('身高应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(this.info.mid_height) && parseFloat(this.info.mid_height) < 0){
			this.toastTab('中等值应大于0', 'error');
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
		if(this.info.weight == null){
			this.info.weight = '';
		}
		if(this.info.mid_weight == null){
			this.info.mid_weight = '';
		}
		if(this.info.compare_weight == null){
			this.info.compare_weight = '';
		}
		if(!this.adminService.isFalse(this.info.weight) && parseFloat(this.info.weight) < 0){
			this.toastTab('体重应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(this.info.mid_weight) && parseFloat(this.info.mid_weight) < 0){
			this.toastTab('中等值应大于0', 'error');
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

	validateNumber(type, info) {console.log(1111);
		if(!this.adminService.isFalse(this.info[type]) && Number(this.info[type]) < 0){
			this.toastTab(info + '应大于0', 'error');
			return false;
		}
		if(this.info[type] == null){
			this.info[type] = '';
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
			this.toastTab('请选择实际操作人', 'error');
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
			weight: this.info.weight == '' ? '0' : (this.info.weight == null ? (this.baseInfo.weight == null ? null : '0') : this.info.weight),
			mid_weight: this.info.mid_weight == '' ? '0' : (this.info.mid_weight == null ? (this.baseInfo.mid_weight == null ? null : '0') : this.info.mid_weight),
			compare_weight: this.info.compare_weight,
			height: this.info.height == '' ? '0' : (this.info.height == null ? (this.baseInfo.height == null ? null : '0') : this.info.height),
			mid_height: this.info.mid_height == '' ? '0' : (this.info.mid_height == null ? (this.baseInfo.mid_height == null ? null : '0') : this.info.mid_height),
			compare_height: this.info.compare_height,
			head_circum: this.info.head_circum == '' ? '0' : (this.info.head_circum == null ? (this.baseInfo.head_circum == null ? null : '0') : this.info.head_circum),
			breast_circum: this.info.breast_circum == '' ? '0' : (this.info.breast_circum == null ? (this.baseInfo.breast_circum == null ? null : '0') : this.info.breast_circum),
			teeth: this.info.teeth == '' ? '0' : (this.info.teeth == null ? (this.baseInfo.teeth == null ? null : '0') : this.info.teeth),
			topic_comment: this.info.topic_comment,
			check_result: this.info.check_result,
			present_illness: this.info.present_illness,
			previous_history: this.info.previous_history,
			allergy: this.info.allergy,
			family_history: this.info.family_history,
			breed_history: this.info.breed_history,
			growth_history: this.info.growth_history,
			physical_check: this.info.physical_check,
			body_temperature: this.info.body_temperature == '' ? '0' : (this.info.body_temperature == null ? (this.baseInfo.body_temperature == null ? null : '0') : this.info.body_temperature),
			breathe: this.info.breathe == '' ? '0' : (this.info.breathe == null ? (this.baseInfo.breathe == null ? null : '0') : this.info.breathe),
			blood_pressure: this.info.blood_pressure == '' ? '0' : (this.info.blood_pressure == null ? (this.baseInfo.blood_pressure == null ? null : '0') : this.info.blood_pressure),
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
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					this.casehistory_id = results.id;
					this.uploadService.startUpload();
				}
			}).catch(() => {
				this.loadingShow = false;
				this.toastTab('服务器错误', 'error');
				this.btnCanEdit = false;
			});
		}else{
			this.adminService.checkcasehistory(urlOptions, params).then((data) => {
				if(data.status == 'no'){
					this.loadingShow = false;
					this.toastTab(data.errorMsg, 'error');
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
				this.toastTab('服务器错误', 'error');
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
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.modalConfirmTab = false;
				this.toastTab('文件删除成功', '');
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
			this.toastTab('服务器错误', 'error');
		});
	}

	getQiniuToken() {
		//获取头像上传token
		var tokenUrl  = '?type=childCircle';
		this.adminService.qiniutoken(tokenUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.qiniuToken = JSON.parse(JSON.stringify(data)).uptoken;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	errorUpload($event) {
		this.toastTab($event.errorMsg, 'error');
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
						this.toastTab(data.errorMsg, 'error');
						this.btnCanEdit = false;
					}else{
						this.complete();
					}
				}).catch(() => {
					this.loadingShow = false;
					this.toastTab('服务器错误', 'error');
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
				this.toastTab('病例修改成功', '');
			}else{
				this.toastTab('审核通过', '');
			}
			if(this.casehistoryList[0].checkId == null){
				setTimeout(() => {
					this.router.navigate(['./admin/bookingExamineCase']);
				}, 2000);
			}else{
				this.toastTab(this.editType == 'create' ? '病历创建成功' : '病历修改成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/repage'], {queryParams: {from:'docbooking/casehistory', id: this.id, doctorId: this.doctorId, pageType:'examine'}});
					this.editType = 'view';
				}, 2000);
			}
		}else{
			this.toastTab(this.editType == 'create' ? '病历创建成功' : '病历修改成功', '');
			setTimeout(() => {
				this.router.navigate(['./admin/repage'], {queryParams: {from:'docbooking/casehistory', id: this.id, doctorId: this.doctorId}});
				this.editType = 'view';
			}, 2000);
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
