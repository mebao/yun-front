import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../admin.service';
import { DoctorService }                      from '../doctor/doctor.service';

import { UploadService }                      from '../../common/nll-upload/upload.service';

@Component({
	selector: 'admin-doctor-booking-healthrecord',
	templateUrl: './docbooking-healthrecord.component.html',
	styleUrls: ['./docbooking-casehistory.component.scss'],
})
export class DocbookingHealthrecordComponent implements OnInit{
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
	// 儿保记录
	healthrecordList: any[];
	hasHealthrecordData: boolean;
	// 儿保记录模板
	recordtempletList: any[];
	selectedTemplet: string;
	// pageType 空为医生接诊, history为查看
	pageType: string;
	// 就诊记录
	historyList: any[];
	hasHistoryData: boolean;
	modalTab: boolean;
	info: {
        id: string,
        child_id: string,
        booking_id: string,
        name: string,
        age: string,
        check_date: string,
        height: string,
        medium_height: string,
        compare_height: string,
        weight: string,
        medium_weight: string,
        compare_weight: string,
        head_circum: string,
        breast_circum: string,
        body_temperature: string,
        pulse: string,
        breathe: string,
        blood_pressure: string,
		spirit: string,//精神及神志
		nutritional_status: string,//营养状态
        skin: string,
        skin_other: string,
        oral_mucosa: string,
        oral_mucosa_other: string,
        hair: string,
        hair_other: string,
        lymph_node: string,
        lymph_node_other: string,
        heart: string,
        heart_other: string,
		thoracic: string,//胸廓
		thoracic_other: string,
        lung: string,
        lung_other: string,
        liver_spleen: string,
        liver_spleen_other: string,
        kidney: string,
        kidney_other: string,
        abdomen: string,
        abdomen_other: string,
        ear: string,
        ear_other: string,
        nose: string,
        nose_other: string,
        throat: string,
        throat_other: string,
        tonsil: string,
        tonsil_other: string,
        eyes: string,
        eyes_other: string,
        vision: string,
        vision_other: string,
        gums: string,
        gums_other: string,
        tongue_tie: string,
        tongue_tie_other: string,
        teeth_pit: string,
        teeth_pit_other: string,
        plaque: string,
        plaque_other: string,
		teeth_num: string,//出牙数
        dental_caries: string,
        dental_caries_other: string,
        limb: string,
        limb_other: string,
        ribs: string,
        ribs_other: string,
        head: string,
        bregmatic: string,
        hip_joint: string,
        hip_joint_other: string,
        torticollis: string,
        torticollis_other: string,
        genitalia: string,
        genitalia_other: string,
        anus: string,
        anus_other: string,
        neurodevelopment: string,
        neurodevelopment_other: string,
        blood_routine_examination: string,
        blood_routine_examination_other: string,
        routine_urine: string,
        routine_urine_other: string,
        stool_routine_examination: string,
        stool_routine_examination_other: string,
        bone_density: string,
        bone_density_other: string,
        BALP: string,
        BALP_other: string,
        trace_element: string,
        trace_element_other: string,
        heavy_metal: string,
        heavy_metal_other: string,
		blood_type: string,//ABO血型鉴定
        feeding: string,
        life: string,
        immunization: string,
        disease_prevention: string,
        answering_questions: string,
        record: string,
        review_date: string,
		review_date_num: number,
        review_date_text: string,
		files: any[],
    }
    // 用于判断input-number类型，因为当输入框被清空时，value会变成null导致输入框消失
    baseInfo: {
        height: string,
        medium_height: string,
        weight: string,
        medium_weight: string,
        head_circum: string,
        breast_circum: string,
        body_temperature: string,
        pulse: string,
        breathe: string,
        blood_pressure: string,
		teeth_num: string,
    }
    editType: string;
	// 不可连续点击
	btnCanEdit: boolean;
	// 实际操作人
	actualOperator: {
		use: boolean,
		name: string,
	}
	adminList: any[];
	operator: string;
	healthrecord_id: string;
	qiniuToken: string;
	upload_multiple: boolean;
	acceptType: string;
	selectFile: {
		file: string,
		url: string,
		showImg: number,
	}
	modalConfirmTab: boolean;

	constructor(
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
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.info = {
			id: '',
			child_id: '',
			booking_id: '',
			name: '',
			age: '',
			check_date: '',
			height: '',
			medium_height: '',
			compare_height: '',
			weight: '',
			medium_weight: '',
			compare_weight: '',
			head_circum: '',
			breast_circum: '',
			body_temperature: '',
			pulse: '',
			breathe: '',
			blood_pressure: '',
			spirit: '',
			nutritional_status: '',
			skin: '',
			skin_other: '',
			oral_mucosa: '',
			oral_mucosa_other: '',
			hair: '',
			hair_other: '',
			lymph_node: '',
			lymph_node_other: '',
			heart: '',
			heart_other: '',
			thoracic: '',
			thoracic_other: '',
			lung: '',
			lung_other: '',
			liver_spleen: '',
			liver_spleen_other: '',
			kidney: '',
			kidney_other: '',
			abdomen: '',
			abdomen_other: '',
			ear: '',
			ear_other: '',
			nose: '',
			nose_other: '',
			throat: '',
			throat_other: '',
			tonsil: '',
			tonsil_other: '',
			eyes: '',
			eyes_other: '',
			vision: '',
			vision_other: '',
			gums: '',
			gums_other: '',
			tongue_tie: '',
			tongue_tie_other: '',
			teeth_pit: '',
			teeth_pit_other: '',
			plaque: '',
			plaque_other: '',
			teeth_num: '',
			dental_caries: '',
			dental_caries_other: '',
			limb: '',
			limb_other: '',
			ribs: '',
			ribs_other: '',
			head: '',
			bregmatic: '',
			hip_joint: '',
			hip_joint_other: '',
			torticollis: '',
			torticollis_other: '',
			genitalia: '',
			genitalia_other: '',
			anus: '',
			anus_other: '',
			neurodevelopment: '',
			neurodevelopment_other: '',
			blood_routine_examination: '',
			blood_routine_examination_other: '',
			routine_urine: '',
			routine_urine_other: '',
			stool_routine_examination: '',
			stool_routine_examination_other: '',
			bone_density: '',
			bone_density_other: '',
			BALP: '',
			BALP_other: '',
			trace_element: '',
			trace_element_other: '',
			heavy_metal: '',
			heavy_metal_other: '',
			blood_type: '',
			feeding: '',
			life: '',
			immunization: '',
			disease_prevention: '',
			answering_questions: '',
			record: '',
			review_date: '',
			review_date_num: 0,
			review_date_text: '',
			files: [],
		}
		this.baseInfo = {
			height: '',
			medium_height: '',
			weight: '',
			medium_weight: '',
			head_circum: '',
			breast_circum: '',
			body_temperature: '',
			pulse: '',
			breathe: '',
			blood_pressure: '',
			teeth_num: '',
		}

		this.loadingShow = true;

		this.id = '';
		this.doctorId = '';
		this.editType = '';

		this.booking = {
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
			this.id = params['id'];
			this.doctorId = params['doctorId'];
			this.pageType = params.pageType;
		});

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
		//获取预约信息
		this.getBookingData();

		// 儿保记录
		this.healthrecordList = [];
		this.hasHealthrecordData = false;

		var healthrecordUrl = this.url + '&booking_id=' + this.id;
		this.adminService.searchhealthrecord(healthrecordUrl).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						// results.list[i].stoolRoutineExamination = results.list[i].stoolRoutineExamination.replace('镜检：', '\n镜检：');
						results.list[i].reviewDate = results.list[i].reviewDate ? this.adminService.dateFormat(results.list[i].reviewDate) : results.list[i].reviewDate;
					}
				}
				this.healthrecordList = results.list;
				this.hasHealthrecordData = true;
				if(this.hasHealthrecordData && this.healthrecordList.length == 0){
					this.editType = 'create';
				}else{
					this.editType = 'view';
				}
				this.initEdit();
				this.loadingShow = false;
			}
		});

		// 儿保记录模板
		this.recordtempletList = [];
		this.selectedTemplet = '';
		var searchrecordtempletUrl = this.url + '&doctor_id=' + this.doctorId
			 + '&status=1';
		this.doctorService.searchrecordtemplet(searchrecordtempletUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.recordtempletList = results.list;
				if(this.recordtempletList.length > 0){
					this.selectedTemplet = this.recordtempletList[0].string;
					sessionStorage.setItem('doctorBookingRecordTemplet', JSON.stringify(this.recordtempletList[0]));
					this.initEdit();
				}

			}
		});

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
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					this.doctorInfo = results.adminlist[0];
				}
			}
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
			});
		}

		this.historyList = [];
		this.hasHistoryData = false;
		this.modalTab = false;

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.doctorId = params.doctorId;
            //this.editType = params.type;
        });

        this.btnCanEdit = false;

		this.healthrecord_id = '';
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
	}

	initEdit(){
		var doctorBooking = JSON.parse(sessionStorage.getItem('doctorBooking'));
		var healthrecord = JSON.parse(sessionStorage.getItem('healthrecord'));
		var childcontrast = JSON.parse(sessionStorage.getItem('childcontrast'));
		if(doctorBooking == null){
			return;
		}


		var todayDate = this.adminService.getDayByDate(new Date());
		if(this.editType == 'update'){
			this.info = {
				id: healthrecord.id,
				child_id: doctorBooking.childId,
				booking_id: doctorBooking.bookingId,
				name: doctorBooking.childName,
				age: doctorBooking.age,
				check_date: healthrecord.checkDate,
				height: healthrecord.height == '0.00' ? '' : healthrecord.height,
				medium_height: healthrecord.mediumHeight == '0.00' ? '' : healthrecord.mediumHeight,
				compare_height: healthrecord.compareHeight,
				weight: healthrecord.weight == '0.00' ? '' : healthrecord.weight,
				medium_weight: healthrecord.mediumWeight == '0.00' ? '' : healthrecord.mediumWeight,
				compare_weight: healthrecord.compareWeight,
				head_circum: healthrecord.headCircum == '0.00' ? '' : healthrecord.headCircum,
				breast_circum: healthrecord.breastCircum == '0.00' ? '' : healthrecord.breastCircum,
				body_temperature: healthrecord.bodyTemperature == '0' ? '' : healthrecord.bodyTemperature,
				pulse: healthrecord.pulse == '0' ? '' : healthrecord.pulse,
				breathe: healthrecord.breathe == '0' ? '' : healthrecord.breathe,
				blood_pressure: healthrecord.bloodPressure == '0' ? '' : healthrecord.bloodPressure,
				spirit: healthrecord.spirit,
				nutritional_status: healthrecord.nutritionalStatus,
				skin: healthrecord.skin,
				skin_other: healthrecord.skin == '未见异常' ? '' : healthrecord.skin,
				oral_mucosa: healthrecord.oralMucosa,
				oral_mucosa_other: healthrecord.oralMucosa == '未见异常' ? '' : healthrecord.oralMucosa,
				hair: healthrecord.hair,
				hair_other: healthrecord.hair == '未见异常' ? '' : healthrecord.hair,
				lymph_node: healthrecord.lymphNode,
				lymph_node_other: healthrecord.lymphNode == '未见异常' ? '' : healthrecord.lymphNode,
				heart: healthrecord.heart,
				heart_other: healthrecord.heart == '未见异常' ? '' : healthrecord.heart,
				thoracic: healthrecord.thoracic,
				thoracic_other: healthrecord.thoracic == '未见异常' ? '' : healthrecord.thoracic,
				lung: healthrecord.lung,
				lung_other: healthrecord.lung == '未见异常' ? '' : healthrecord.lung,
				liver_spleen: healthrecord.liverSpleen,
				liver_spleen_other: healthrecord.liverSpleen == '未见异常' ? '' : healthrecord.liverSpleen,
				kidney: healthrecord.kidney,
				kidney_other: healthrecord.kidney == '未见异常' ? '' : healthrecord.kidney,
				abdomen: healthrecord.abdomen,
				abdomen_other: healthrecord.abdomen == '未见异常' ? '' : healthrecord.abdomen,
				ear: healthrecord.ear,
				ear_other: healthrecord.ear == '未见明显畸形' ? '' : healthrecord.ear,
				nose: healthrecord.nose,
				nose_other: healthrecord.nose == '未见明显畸形' ? '' : healthrecord.nose,
				throat: healthrecord.throat,
				throat_other: healthrecord.throat == '未见异常' ? '' : healthrecord.throat,
				tonsil: healthrecord.tonsil,
				tonsil_other: healthrecord.tonsil == '未见异常' ? '' : healthrecord.tonsil,
				eyes: healthrecord.eyes,
				eyes_other: healthrecord.eyes == '未见明显畸形' ? '' : healthrecord.eyes,
				vision: healthrecord.vision,
				vision_other: healthrecord.vision == '未做' ? '' : healthrecord.vision,
				gums: healthrecord.gums,
				gums_other: healthrecord.gums == '未见异常' ? '' : healthrecord.gums,
				tongue_tie: healthrecord.tongue_tie,
				tongue_tie_other: healthrecord.tongue_tie == '未见异常' ? '' : healthrecord.tongue_tie,
				teeth_pit: healthrecord.teeth_pit,
				teeth_pit_other: healthrecord.teeth_pit == '未见异常' ? '' : healthrecord.teeth_pit,
				plaque: healthrecord.plaque,
				plaque_other: healthrecord.plaque == '未见异常' ? '' : healthrecord.plaque,
				teeth_num: healthrecord.teeth_num == '0' ? '' : healthrecord.teeth_num,
				dental_caries: healthrecord.dental_caries,
				dental_caries_other: healthrecord.dental_caries == '未见异常' ? '' : healthrecord.dental_caries,
				limb: healthrecord.limb,
				limb_other: healthrecord.limb == '未见异常' ? '' : healthrecord.limb,
				ribs: healthrecord.ribs,
				ribs_other: healthrecord.ribs == '未见异常' ? '' : healthrecord.ribs,
				head: healthrecord.head,
				bregmatic: healthrecord.bregmatic,
				hip_joint: healthrecord.hip_joint,
				hip_joint_other: healthrecord.hip_joint == '未见异常' ? '' : healthrecord.hip_joint,
				torticollis: healthrecord.torticollis,
				torticollis_other: healthrecord.torticollis == '未见异常' ? '' : healthrecord.torticollis,
				genitalia: healthrecord.genitalia,
				genitalia_other: healthrecord.genitalia == '未见异常' ? '' : healthrecord.genitalia,
				anus: healthrecord.anus,
				anus_other: healthrecord.anus == '未见异常' ? '' : healthrecord.anus,
				neurodevelopment: healthrecord.neurodevelopment,
				neurodevelopment_other: healthrecord.neurodevelopment == '未见异常' ? '' : healthrecord.neurodevelopment,
				blood_routine_examination: healthrecord.bloodRoutineExamination,
				blood_routine_examination_other: healthrecord.bloodRoutineExamination == '未见异常' || healthrecord.bloodRoutineExamination == '贫血' || healthrecord.bloodRoutineExamination == '白细胞高值' ? '' : healthrecord.bloodRoutineExamination,
				routine_urine: healthrecord.routineUrine,
				routine_urine_other: healthrecord.routineUrine == '未见异常' ? '' : healthrecord.routineUrine,
				stool_routine_examination: healthrecord.stoolRoutineExamination,
				stool_routine_examination_other: healthrecord.stoolRoutineExamination == '未见异常' ? '' : healthrecord.stoolRoutineExamination,
				bone_density: healthrecord.boneDensity,
				bone_density_other: healthrecord.boneDensity == '未见异常' ? '' : healthrecord.boneDensity,
				BALP: healthrecord.BALP,
				BALP_other: healthrecord.BALP == '未见异常' ? '' : healthrecord.BALP,
				trace_element: healthrecord.traceElement,
				trace_element_other: healthrecord.traceElement == '未见异常' ? '' : healthrecord.traceElement,
				heavy_metal: healthrecord.heavyMetal,
				heavy_metal_other: healthrecord.heavyMetal == '未见异常' ? '' : healthrecord.heavyMetal,
				blood_type: healthrecord.bloodType,
				feeding: healthrecord.feeding,
				life: healthrecord.life,
				immunization: healthrecord.immunization,
				disease_prevention: healthrecord.diseasePrevention,
				answering_questions: healthrecord.answeringQuestions,
				record: healthrecord.record,
				review_date: healthrecord.reviewDate ? this.adminService.dateFormatHasWord(healthrecord.reviewDate) : healthrecord.reviewDate,
				review_date_num: new Date(todayDate).getTime(),
				review_date_text: healthrecord.reviewDate,
				files: healthrecord.files,
			}
			this.baseInfo = {
				height: healthrecord.height,
				medium_height: healthrecord.mediumHeight,
				weight: healthrecord.weight,
				medium_weight: healthrecord.mediumWeight,
				head_circum: healthrecord.headCircum,
				breast_circum: healthrecord.breastCircum,
				body_temperature: healthrecord.bodyTemperature,
				pulse: healthrecord.pulse,
				breathe: healthrecord.breathe,
				blood_pressure: healthrecord.bloodPressure,
				teeth_num: healthrecord.teeth_num,
			}
		}else if(this.editType=='create'){
			this.info = {
				id: '',
				child_id: doctorBooking.childId,
				booking_id: doctorBooking.bookingId,
				name: doctorBooking.childName,
				age: doctorBooking.age,
				check_date: this.adminService.getDayByDate(new Date()),
				height: null,
				medium_height: null,
				compare_height: null,
				weight: null,
				medium_weight: null,
				compare_weight: null,
				head_circum: null,
				breast_circum: null,
				body_temperature: null,
				pulse: null,
				breathe: null,
				blood_pressure: null,
				spirit: null,
				nutritional_status: null,
				skin: null,
				skin_other: '',
				oral_mucosa: null,
				oral_mucosa_other: '',
				hair: null,
				hair_other: '',
				lymph_node: null,
				lymph_node_other: '',
				heart: null,
				heart_other: '',
				thoracic: null,
				thoracic_other: '',
				lung: null,
				lung_other: '',
				liver_spleen: null,
				liver_spleen_other: '',
				kidney: null,
				kidney_other: '',
				abdomen: null,
				abdomen_other: '',
				ear: null,
				ear_other: '',
				nose: null,
				nose_other: '',
				throat: null,
				throat_other: '',
				tonsil: null,
				tonsil_other: '',
				eyes: null,
				eyes_other: '',
				vision: null,
				vision_other: '',
				gums: null,
				gums_other: '',
				tongue_tie: null,
				tongue_tie_other: '',
				teeth_pit: null,
				teeth_pit_other: '',
				plaque: null,
				plaque_other: '',
				teeth_num: null,
				dental_caries: null,
				dental_caries_other: '',
				limb: null,
				limb_other: '',
				ribs: null,
				ribs_other: '',
				head: null,
				bregmatic: null,
				hip_joint: null,
				hip_joint_other: '',
				torticollis: null,
				torticollis_other: '',
				genitalia: null,
				genitalia_other: '',
				anus: null,
				anus_other: '',
				neurodevelopment: null,
				neurodevelopment_other: '',
				blood_routine_examination: null,
				blood_routine_examination_other: '',
				routine_urine: null,
				routine_urine_other: '',
				stool_routine_examination: null,
				stool_routine_examination_other: '',
				bone_density: null,
				bone_density_other: '',
				BALP: null,
				BALP_other: '',
				trace_element: null,
				trace_element_other: '',
				heavy_metal: null,
				heavy_metal_other: '',
				blood_type: null,
				feeding: null,
				life: null,
				immunization: null,
				disease_prevention: null,
				answering_questions: null,
				record: null,
				review_date: '',
				review_date_num: new Date(todayDate).getTime(),
				review_date_text: '',
				files: [],
			}
			this.baseInfo = {
				height: null,
				medium_height: null,
				weight: null,
				medium_weight: null,
				head_circum: null,
				breast_circum: null,
				body_temperature: null,
				pulse: null,
				breathe: null,
				blood_pressure: null,
				teeth_num: null,
			}
			var doctorBookingRecordTemplet = JSON.parse(sessionStorage.getItem('doctorBookingRecordTemplet'));
			if(doctorBookingRecordTemplet != null){
				if(doctorBookingRecordTemplet.recordkeys.length > 0){
					for(var i = 0; i < doctorBookingRecordTemplet.recordkeys.length; i++){
						this.info[doctorBookingRecordTemplet.recordkeys[i].key] = '';
						this.baseInfo[doctorBookingRecordTemplet.recordkeys[i].key] = '';
						if(doctorBookingRecordTemplet.recordkeys[i].key=='medium_height'){
							if(childcontrast.info){
								this.info.medium_height = childcontrast.info.height;
							}else{
								this.info.medium_height = '';
							}
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='medium_weight'){
							if(childcontrast.info){
								this.info.medium_weight = childcontrast.info.weight;
							}else{
								this.info.medium_weight = '';
							}
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='skin'){
	                            this.info.skin = '未见异常';
	                    }
						if(doctorBookingRecordTemplet.recordkeys[i].key=='oral_mucosa'){
								this.info.oral_mucosa = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='hair'){
								this.info.hair = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='lymph_node'){
								this.info.lymph_node = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='heart'){
								this.info.heart = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='thoracic'){
								this.info.thoracic = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='lung'){
								this.info.lung = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='liver_spleen'){
								this.info.liver_spleen = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='kidney'){
								this.info.kidney = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='abdomen'){
								this.info.abdomen = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='ear'){
								this.info.ear = '未见明显畸形';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='nose'){
								this.info.nose = '未见明显畸形';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='throat'){
								this.info.throat = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='tonsil'){
								this.info.tonsil = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='eyes'){
								this.info.eyes = '未见明显畸形';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='vision'){
								this.info.vision = '未做';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='gums'){
								this.info.gums = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='tongue_tie'){
								this.info.tongue_tie = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='teeth_pit'){
								this.info.teeth_pit = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='plaque'){
								this.info.plaque = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='dental_caries'){
								this.info.dental_caries = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='limb'){
								this.info.limb = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='ribs'){
								this.info.ribs = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='hip_joint'){
								this.info.hip_joint = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='torticollis'){
								this.info.torticollis = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='genitalia'){
								this.info.genitalia = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='anus'){
								this.info.anus = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='neurodevelopment'){
								this.info.neurodevelopment = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='blood_routine_examination'){
								this.info.blood_routine_examination = '红细胞数：     ，白细胞总数：     ，血小板总数：     ，血红蛋白：     ';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='routine_urine'){
								this.info.routine_urine = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='stool_routine_examination'){
								this.info.stool_routine_examination = '隐血：\n镜检：';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='bone_density'){
								this.info.bone_density = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='BALP'){
								this.info.BALP = '未见异常';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='trace_element'){
								this.info.trace_element = '锌：     ，铁：     ，钙：     ，镁：     ，铜：     ';
						}
						if(doctorBookingRecordTemplet.recordkeys[i].key=='heavy_metal'){
								this.info.heavy_metal = '铅：     ，镉：     ，锰：     ';
						}
					}
				}
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
						}
					}
				});
			}
			// 获取病例，若是身高、体重、头围、体温等信息已存在，则直接使用
			if(this.info.height != null || this.info.weight != null || this.info.head_circum != null || this.info.body_temperature != null){
				var casehistoryUrl = this.url + '&booking_id=' + this.id;
				this.adminService.searchcasehistory(casehistoryUrl).then((data) => {
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
					}
				});
			}
		}
	}

	// 选择实际操作人
	selectOperator() {
		if(this.operator == ''){
			this.toastTab('请先选择实际操作人', 'error');
			return;
		}
		sessionStorage.setItem('actualOperator', this.operator);
	}

	// 历史记录
	showHistory() {
		this.modalTab = true;
		this.hasHistoryData = false;
		var urlOptions = this.url + '&child_id=' + this.booking.childId;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.historyList = results.weekbooks;
				this.hasHistoryData = true;
			}
		});
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
							}
							if(!this.adminService.isFalse(results.weekbooks[0].services[i].end)){
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace('-', '年');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace('-', '月');
								results.weekbooks[0].services[i].end = results.weekbooks[0].services[i].end.replace(' ', '日 ');
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
					sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
					this.initEdit();
				}
			}
		});
	}

	changeTab(_value, url) {
		sessionStorage.setItem('doctorBookingTab', _value);
		// pageType 空为医生接诊， history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
	}

	// 新增儿保记录
	addHealthrecord() {
		if(this.selectedTemplet == ''){
			this.toastTab('请先选择模板', 'error');
			return;
		}
		sessionStorage.setItem('doctorBookingRecordTemplet', this.selectedTemplet);
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		//this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId, childId: this.booking.childId, type: 'create'}});
		this.editType = 'create';
		this.initEdit();
	}

	// 修改儿保记录
	updateHealthrecord(healthrecord) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
		sessionStorage.setItem('doctorBooking', JSON.stringify(this.booking));
		sessionStorage.setItem('healthrecord', JSON.stringify(healthrecord));
		//this.router.navigate(['./admin/bookingHealthrecord'], {queryParams: {id: this.id, doctor: this.doctorId, childId: this.booking.childId, type: 'update'}});
		this.editType = 'update';
		this.initEdit();
		this.btnCanEdit = false;
	}

	// 身高对比
    changeHeight() {
        if(!this.adminService.isFalse(this.info.height) && parseFloat(this.info.height) < 0){
            this.toastTab('身高应大于0', 'error');
            return;
        }
        if(!this.adminService.isFalse(this.info.medium_height) && parseFloat(this.info.medium_height) < 0){
            this.toastTab('中等值应大于0', 'error');
            return;
        }
        if(this.adminService.isFalse(this.info.height) || this.adminService.isFalse(this.info.medium_height)){
            this.info.compare_height = '';
            return;
        }
        var compare = this.adminService.toDecimal2((parseFloat(this.info.height) - parseFloat(this.info.medium_height)) / parseFloat(this.info.medium_height) * 100);
        this.info.compare_height = (parseFloat(compare) < 0 ? '低' : '高') + (this.adminService.toDecimal2(parseFloat(compare) * (parseFloat(compare) < 0 ? -1 : 1))) + '%';
    }

    // 体重对比
    changeWeight() {
        if(!this.adminService.isFalse(this.info.weight) && parseFloat(this.info.weight) < 0){
            this.toastTab('体重应大于0', 'error');
            return;
        }
        if(!this.adminService.isFalse(this.info.medium_weight) && parseFloat(this.info.medium_weight) < 0){
            this.toastTab('中等值应大于0', 'error');
            return;
        }
        if(this.adminService.isFalse(this.info.weight) || this.adminService.isFalse(this.info.medium_weight)){
            this.info.compare_weight = '';
            return;
        }
        var compare = this.adminService.toDecimal2((parseFloat(this.info.weight) - parseFloat(this.info.medium_weight)) / parseFloat(this.info.medium_weight));
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

	validateNumber(type, info) {
		if(!this.adminService.isFalse(this.info[type]) && Number(this.info[type]) < 0){
			this.toastTab(info + '应大于0', 'error');
			return false;
		}
		return true;
	}

    // 选择日期
    changeDate(_value) {
        this.info.review_date = JSON.parse(_value).value;
    }

	cancel() {
		this.editType = 'view';
	}

    create(f) {
		if(this.actualOperator.use && this.operator == ''){
			this.toastTab('请选择实际操作人', 'error');
			return;
		}
        this.btnCanEdit = true;
        this.info.skin = this.adminService.trim(this.info.skin);
        this.info.skin_other = this.adminService.trim(this.info.skin_other);
        this.info.oral_mucosa = this.adminService.trim(this.info.oral_mucosa);
        this.info.oral_mucosa_other = this.adminService.trim(this.info.oral_mucosa_other);
        this.info.hair = this.adminService.trim(this.info.hair);
        this.info.hair_other = this.adminService.trim(this.info.hair_other);
        this.info.lymph_node = this.adminService.trim(this.info.lymph_node);
        this.info.lymph_node_other = this.adminService.trim(this.info.lymph_node_other);
        this.info.heart = this.adminService.trim(this.info.heart);
        this.info.heart_other = this.adminService.trim(this.info.heart_other);
        this.info.thoracic = this.adminService.trim(this.info.thoracic);
        this.info.thoracic_other = this.adminService.trim(this.info.thoracic_other);
        this.info.lung = this.adminService.trim(this.info.lung);
        this.info.lung_other = this.adminService.trim(this.info.lung_other);
        this.info.kidney = this.adminService.trim(this.info.kidney);
        this.info.kidney_other = this.adminService.trim(this.info.kidney_other);
        this.info.abdomen = this.adminService.trim(this.info.abdomen);
        this.info.abdomen_other = this.adminService.trim(this.info.abdomen_other);
        this.info.ear = this.adminService.trim(this.info.ear);
        this.info.ear_other = this.adminService.trim(this.info.ear_other);
        this.info.nose = this.adminService.trim(this.info.nose);
        this.info.nose_other = this.adminService.trim(this.info.nose_other);
        this.info.throat = this.adminService.trim(this.info.throat);
        this.info.throat_other = this.adminService.trim(this.info.throat_other);
        this.info.tonsil = this.adminService.trim(this.info.tonsil);
        this.info.tonsil_other = this.adminService.trim(this.info.tonsil_other);
        this.info.eyes = this.adminService.trim(this.info.eyes);
        this.info.eyes_other = this.adminService.trim(this.info.eyes_other);
        this.info.vision = this.adminService.trim(this.info.vision);
        this.info.vision_other = this.adminService.trim(this.info.vision_other);
        this.info.gums = this.adminService.trim(this.info.gums);
        this.info.gums_other = this.adminService.trim(this.info.gums_other);
        this.info.tongue_tie = this.adminService.trim(this.info.tongue_tie);
        this.info.tongue_tie_other = this.adminService.trim(this.info.tongue_tie_other);
        this.info.teeth_pit = this.adminService.trim(this.info.teeth_pit);
        this.info.teeth_pit_other = this.adminService.trim(this.info.teeth_pit_other);
        this.info.plaque = this.adminService.trim(this.info.plaque);
        this.info.plaque_other = this.adminService.trim(this.info.plaque_other);
        this.info.dental_caries = this.adminService.trim(this.info.dental_caries);
        this.info.dental_caries_other = this.adminService.trim(this.info.dental_caries_other);
        this.info.limb = this.adminService.trim(this.info.limb);
        this.info.limb_other = this.adminService.trim(this.info.limb_other);
        this.info.ribs = this.adminService.trim(this.info.ribs);
        this.info.ribs_other = this.adminService.trim(this.info.ribs_other);
        this.info.head = this.adminService.trim(this.info.head);
        this.info.bregmatic = this.adminService.trim(this.info.bregmatic);
        this.info.hip_joint = this.adminService.trim(this.info.hip_joint);
        this.info.hip_joint_other = this.adminService.trim(this.info.hip_joint_other);
        this.info.torticollis = this.adminService.trim(this.info.torticollis);
        this.info.torticollis_other = this.adminService.trim(this.info.torticollis_other);
        this.info.genitalia = this.adminService.trim(this.info.genitalia);
        this.info.genitalia_other = this.adminService.trim(this.info.genitalia_other);
        this.info.anus = this.adminService.trim(this.info.anus);
        this.info.anus_other = this.adminService.trim(this.info.anus_other);
        this.info.neurodevelopment = this.adminService.trim(this.info.neurodevelopment);
        this.info.neurodevelopment_other = this.adminService.trim(this.info.neurodevelopment_other);
        this.info.blood_routine_examination = this.adminService.trim(this.info.blood_routine_examination);
        this.info.blood_routine_examination_other = this.adminService.trim(this.info.blood_routine_examination_other);
        this.info.routine_urine = this.adminService.trim(this.info.routine_urine);
        this.info.routine_urine_other = this.adminService.trim(this.info.routine_urine_other);
        this.info.stool_routine_examination = this.adminService.trim(this.info.stool_routine_examination);
        this.info.stool_routine_examination_other = this.adminService.trim(this.info.stool_routine_examination_other);
        this.info.bone_density = this.adminService.trim(this.info.bone_density);
        this.info.bone_density_other = this.adminService.trim(this.info.bone_density_other);
        this.info.BALP = this.adminService.trim(this.info.BALP);
        this.info.BALP_other = this.adminService.trim(this.info.BALP_other);
        this.info.trace_element = this.adminService.trim(this.info.trace_element);
        this.info.trace_element_other = this.adminService.trim(this.info.trace_element_other);
        this.info.heavy_metal = this.adminService.trim(this.info.heavy_metal);
        this.info.heavy_metal_other = this.adminService.trim(this.info.heavy_metal_other);
        this.info.feeding = this.adminService.trim(this.info.feeding);
		this.info.blood_type = this.adminService.trim(this.info.blood_type);
        this.info.life = this.adminService.trim(this.info.life);
        this.info.immunization = this.adminService.trim(this.info.immunization);
        this.info.disease_prevention = this.adminService.trim(this.info.disease_prevention);
        this.info.answering_questions = this.adminService.trim(this.info.answering_questions);
        this.info.record = this.adminService.trim(this.info.record);
		if(!this.validateNumber('height', '身高')){
            this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('medium_height', '身高中等值')){
            this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('weight', '体重')){
            this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('medium_weight', '体重中等值')){
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
		if(!this.validateNumber('body_temperature', '体温')){
            this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('pulse', '脉搏')){
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
		if(!this.adminService.isFalse(this.info.teeth_num) && (Number(this.info.teeth_num) < 0 || parseFloat(this.info.teeth_num) % 1 != 0)){
			this.toastTab('出牙数应为大于0的整数', 'error');
            this.btnCanEdit = false;
			return false;
		}
		this.loadingShow = true;
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            child_id: this.info.child_id,
            booking_id: this.info.booking_id,
            check_date: this.adminService.dateFormatHasWord(this.booking.bookingDate),
            height: this.info.height == '' ? '0' : (this.info.height == null ? (this.baseInfo.height == null ? null : '0') : this.info.height),
            medium_height: this.info.medium_height == '' ? '0' : (this.info.medium_height == null ? (this.baseInfo.medium_height == null ? null : '0') : this.info.medium_height),
            compare_height: this.info.compare_height,
            weight: this.info.weight == '' ? '0' : (this.info.weight == null ? (this.baseInfo.weight == null ? null : '0') : this.info.weight),
            medium_weight: this.info.medium_weight == '' ? '0' : (this.info.medium_weight == null ? (this.baseInfo.medium_weight == null ? null : '0') : this.info.medium_weight),
            compare_weight: this.info.compare_weight,
            head_circum: this.info.head_circum == '' ? '0' : (this.info.head_circum == null ? (this.baseInfo.head_circum == null ? null : '0') : this.info.head_circum),
            breast_circum: this.info.breast_circum == '' ? '0' : (this.info.breast_circum == null ? (this.baseInfo.breast_circum == null ? null : '0') : this.info.breast_circum),
            body_temperature: this.info.body_temperature == '' ? '0' : (this.info.body_temperature == null ? (this.baseInfo.body_temperature == null ? null : '0') : this.info.body_temperature),
            pulse: this.info.pulse == '' ? '0' : (this.info.pulse == null ? (this.baseInfo.pulse == null ? null : '0') : this.info.pulse),
            breathe: this.info.breathe == '' ? '0' : (this.info.breathe == null ? (this.baseInfo.breathe == null ? null : '0') : this.info.breathe),
            blood_pressure: this.info.blood_pressure == '' ? '0' : (this.info.blood_pressure == null ? (this.baseInfo.blood_pressure == null ? null : '0') : this.info.blood_pressure),
            spirit: this.info.spirit,
            nutritional_status: this.info.nutritional_status,
            skin: this.info.skin != '' ? this.info.skin : this.info.skin_other,
            oral_mucosa: this.info.oral_mucosa != '' ? this.info.oral_mucosa : this.info.oral_mucosa_other,
            hair: this.info.hair != '' ? this.info.hair : this.info.hair_other,
            lymph_node: this.info.lymph_node != '' ? this.info.lymph_node : this.info.lymph_node_other,
            heart: this.info.heart != '' ? this.info.heart : this.info.heart_other,
			thoracic: this.info.thoracic != '' ? this.info.thoracic : this.info.thoracic_other,
            lung: this.info.lung != '' ? this.info.lung : this.info.lung_other,
            liver_spleen: this.info.liver_spleen != '' ? this.info.liver_spleen : this.info.liver_spleen_other,
            kidney: this.info.kidney != '' ? this.info.kidney : this.info.kidney_other,
            abdomen: this.info.abdomen != '' ? this.info.abdomen : this.info.abdomen_other,
            ear: this.info.ear != '' ? this.info.ear : this.info.ear_other,
            nose: this.info.nose != '' ? this.info.nose : this.info.nose_other,
            throat: this.info.throat != '' ? this.info.throat : this.info.throat_other,
            tonsil: this.info.tonsil != '' ? this.info.tonsil : this.info.tonsil_other,
            eyes: this.info.eyes != '' ? this.info.eyes : this.info.eyes_other,
            vision: this.info.vision != '' ? this.info.vision : this.info.vision_other,
            gums: this.info.gums != '' ? this.info.gums : this.info.gums_other,
            tongue_tie: this.info.tongue_tie != '' ? this.info.tongue_tie : this.info.tongue_tie_other,
            teeth_pit: this.info.teeth_pit != '' ? this.info.teeth_pit : this.info.teeth_pit_other,
            plaque: this.info.plaque != '' ? this.info.plaque : this.info.plaque_other,
			teeth_num: this.info.teeth_num == '' ? '0' : (this.info.teeth_num == null ? (this.baseInfo.teeth_num == null ? null : '0') : this.info.teeth_num),
            dental_caries: this.info.dental_caries != '' ? this.info.dental_caries : this.info.dental_caries_other,
            limb: this.info.limb != '' ? this.info.limb : this.info.limb_other,
            ribs: this.info.ribs != '' ? this.info.ribs : this.info.ribs_other,
            head: this.info.head,
            bregmatic: this.info.bregmatic,
            hip_joint: this.info.hip_joint != '' ? this.info.hip_joint : this.info.hip_joint_other,
            torticollis: this.info.torticollis != '' ? this.info.torticollis : this.info.torticollis_other,
            genitalia: this.info.genitalia != '' ? this.info.genitalia : this.info.genitalia_other,
            anus: this.info.anus != '' ? this.info.anus : this.info.anus_other,
            neurodevelopment: this.info.neurodevelopment != '' ? this.info.neurodevelopment : this.info.neurodevelopment_other,
            blood_routine_examination: this.info.blood_routine_examination != '' ? this.info.blood_routine_examination : this.info.blood_routine_examination_other,
            routine_urine: this.info.routine_urine != '' ? this.info.routine_urine : this.info.routine_urine_other,
            stool_routine_examination: this.info.stool_routine_examination != '' ? this.info.stool_routine_examination : this.info.stool_routine_examination_other,
            bone_density: this.info.bone_density != '' ? this.info.bone_density : this.info.bone_density_other,
            BALP: this.info.BALP != '' ? this.info.BALP : this.info.BALP_other,
            trace_element: this.info.trace_element != '' ? this.info.trace_element : this.info.trace_element_other,
            heavy_metal: this.info.heavy_metal != '' ? this.info.heavy_metal : this.info.heavy_metal_other,
            feeding: this.info.feeding,
			blood_type: this.info.blood_type,
            life: this.info.life,
            immunization: this.info.immunization,
            disease_prevention: this.info.disease_prevention,
            answering_questions: this.info.answering_questions,
            record: this.info.record,
            review_date: this.info.review_date == '' ? null : this.info.review_date,
			true_id: this.actualOperator.use ? JSON.parse(this.operator).id : null,
			true_name: this.actualOperator.use ? JSON.parse(this.operator).realName : null,
        }

        var urlOptions = '';
        if(this.editType == 'update'){
            urlOptions = '/' + this.info.id;
        }
        this.adminService.healthrecord(urlOptions, params).then((data) => {
            if(data.status == 'no'){
				this.loadingShow = false;
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
            }else{
                if(this.editType == 'create'){
					if(this.info.review_date == ''){
						this.uploadService.startUpload();
					}else{
						// 新增，并且复查日期不为空时，增加随访
						this.addFollowups();
					}
                }else{
					this.uploadService.startUpload();
                }
            }
        });
    }

	addFollowups() {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			booking_id: this.id,
			time: this.info.review_date,
			account: this.info.record,
			remarks: '',
			child_id: this.booking.childId,
		}
		this.adminService.userfollowup(params).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
                this.toastTab(data.errorMsg, 'error');
                this.btnCanEdit = false;
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.healthrecord_id = results.id;
				this.uploadService.startUpload();
			}
		});
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
		this.adminService.deletehrfile(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.modalConfirmTab = false;
				this.toastTab('文件删除成功', '');
				for(var i = 0; i < this.info.files.length; i++){
					if(JSON.parse(this.selectFile.file).fileId == this.info.files[i].fileId){
						if(this.healthrecordList.length > 0){
							this.healthrecordList[0].files.splice(i, 1);
						}
						this.info.files.splice(i, 1);
					}
				}
			}
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
						record_id: this.editType == 'create' ? this.healthrecord_id : JSON.parse(sessionStorage.getItem('healthrecord')).id,
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
				this.adminService.uploadhealthrecord(params).then((data) => {
					if(data.errorMsg == 'no'){
						this.loadingShow = false;
						this.toastTab(data.errorMsg, 'error');
						this.btnCanEdit = false;
					}else{
						this.complete();
					}
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
		this.toastTab(this.editType == 'create' ? '儿保创建成功' : '儿保修改成功', '');
		setTimeout(() => {
			this.router.navigate(['./admin/repage'], {queryParams: {from:'docbooking/healthrecord', id: this.id, doctorId: this.doctorId}});
			this.editType = 'view';
		}, 2000);
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
