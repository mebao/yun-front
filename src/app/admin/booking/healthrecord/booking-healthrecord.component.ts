// import { Component }                      from '@angular/core';
// import { Router, ActivatedRoute }         from '@angular/router';
//
// import { AdminService }                   from '../../admin.service';
//
// @Component({
//     selector: 'admin-booking-healthrecord',
//     templateUrl: './booking-healthrecord.component.html',
//     styleUrls: ['./booking-healthrecord.component.scss'],
// })
// export class BookingHealthrecordComponent{
// 	topBar: {
// 		title: string,
// 		back: boolean,
// 	};
// 	toast: {
// 		show: number,
// 		text: string,
// 		type:  string,
// 	};
//     info: {
//         id: string,
//         child_id: string,
//         booking_id: string,
//         name: string,
//         age: string,
//         check_date: string,
//         height: string,
//         medium_height: string,
//         compare_height: string,
//         weight: string,
//         medium_weight: string,
//         compare_weight: string,
//         head_circum: string,
//         breast_circum: string,
//         body_temperature: string,
//         pulse: string,
//         breathe: string,
//         blood_pressure: string,
//         skin: string,
//         skin_other: string,
//         oral_mucosa: string,
//         oral_mucosa_other: string,
//         hair: string,
//         hair_other: string,
//         lymph_node: string,
//         lymph_node_other: string,
//         heart: string,
//         heart_other: string,
//         lung: string,
//         lung_other: string,
//         liver_spleen: string,
//         liver_spleen_other: string,
//         kidney: string,
//         kidney_other: string,
//         abdomen: string,
//         abdomen_other: string,
//         ear: string,
//         ear_other: string,
//         nose: string,
//         nose_other: string,
//         throat: string,
//         throat_other: string,
//         tonsil: string,
//         tonsil_other: string,
//         eyes: string,
//         eyes_other: string,
//         vision: string,
//         vision_other: string,
//         gums: string,
//         gums_other: string,
//         tongue_tie: string,
//         tongue_tie_other: string,
//         teeth_pit: string,
//         teeth_pit_other: string,
//         plaque: string,
//         plaque_other: string,
//         dental_caries: string,
//         dental_caries_other: string,
//         limb: string,
//         limb_other: string,
//         ribs: string,
//         ribs_other: string,
//         head: string,
//         head_other: string,
//         bregmatic: string,
//         bregmatic_other: string,
//         hip_joint: string,
//         hip_joint_other: string,
//         torticollis: string,
//         torticollis_other: string,
//         genitalia: string,
//         genitalia_other: string,
//         anus: string,
//         anus_other: string,
//         neurodevelopment: string,
//         neurodevelopment_other: string,
//         blood_routine_examination: string,
//         blood_routine_examination_other: string,
//         routine_urine: string,
//         routine_urine_other: string,
//         stool_routine_examination: string,
//         stool_routine_examination_other: string,
//         bone_density: string,
//         bone_density_other: string,
//         BALP: string,
//         BALP_other: string,
//         trace_element: string,
//         trace_element_other: string,
//         heavy_metal: string,
//         heavy_metal_other: string,
//         feeding: string,
//         life: string,
//         immunization: string,
//         disease_prevention: string,
//         answering_questions: string,
//         record: string,
//         review_date: string,
//         review_date_text: string,
//     }
//     // 用于判断input-number类型，因为当输入框被清空时，value会变成null导致输入框消失
//     baseInfo: {
//         height: string,
//         medium_height: string,
//         weight: string,
//         medium_weight: string,
//         head_circum: string,
//         breast_circum: string,
//         body_temperature: string,
//         pulse: string,
//         breathe: string,
//         blood_pressure: string,
//     }
//     id: string;
//     doctorId: string;
//     editType: string;
// 	// 不可连续点击
// 	btnCanEdit: boolean;
//
// 	constructor(
// 		public adminService: AdminService,
// 		private route: ActivatedRoute,
// 		private router: Router,
// 	) {}
//
// 	ngOnInit(): void {
// 		this.topBar = {
// 			title: '儿保记录',
// 			back: true,
// 		}
// 		this.toast = {
// 			show: 0,
// 			text: '',
// 			type: '',
// 		};
//
//         var doctorBooking = JSON.parse(sessionStorage.getItem('doctorBooking'));
//         var healthrecord = JSON.parse(sessionStorage.getItem('healthrecord'));
//         var childcontrast = JSON.parse(sessionStorage.getItem('childcontrast'));
//
//         this.route.queryParams.subscribe((params) => {
//             this.id = params.id;
//             this.doctorId = params.doctorId;
//             this.editType = params.type;
//         });
//
//         if(this.editType == 'update'){
//             this.info = {
//                 id: healthrecord.id,
//                 child_id: doctorBooking.childId,
//                 booking_id: doctorBooking.bookingId,
//                 name: doctorBooking.childName,
//                 age: doctorBooking.age,
//                 check_date: healthrecord.checkDate,
//                 height: healthrecord.height,
//                 medium_height: healthrecord.mediumHeight,
//                 compare_height: healthrecord.compareHeight,
//                 weight: healthrecord.weight,
//                 medium_weight: healthrecord.mediumWeight,
//                 compare_weight: healthrecord.compareWeight,
//                 head_circum: healthrecord.headCircum,
//                 breast_circum: healthrecord.breastCircum,
//                 body_temperature: healthrecord.bodyTemperature,
//                 pulse: healthrecord.pulse,
//                 breathe: healthrecord.breathe,
//                 blood_pressure: healthrecord.bloodPressure,
//                 skin: healthrecord.skin,
//                 skin_other: healthrecord.skin == '未见异常' ? '' : healthrecord.skin,
//                 oral_mucosa: healthrecord.oralMucosa,
//                 oral_mucosa_other: healthrecord.oralMucosa == '未见异常' ? '' : healthrecord.oralMucosa,
//                 hair: healthrecord.hair,
//                 hair_other: healthrecord.hair == '未见异常' ? '' : healthrecord.hair,
//                 lymph_node: healthrecord.lymphNode,
//                 lymph_node_other: healthrecord.lymphNode == '未见异常' ? '' : healthrecord.lymphNode,
//                 heart: healthrecord.heart,
//                 heart_other: healthrecord.heart == '未见异常' ? '' : healthrecord.heart,
//                 lung: healthrecord.lung,
//                 lung_other: healthrecord.lung == '未见异常' ? '' : healthrecord.lung,
//                 liver_spleen: healthrecord.liverSpleen,
//                 liver_spleen_other: healthrecord.liverSpleen == '未见异常' ? '' : healthrecord.liverSpleen,
//                 kidney: healthrecord.kidney,
//                 kidney_other: healthrecord.kidney == '未见异常' ? '' : healthrecord.kidney,
//                 abdomen: healthrecord.abdomen,
//                 abdomen_other: healthrecord.abdomen == '未见异常' ? '' : healthrecord.abdomen,
//                 ear: healthrecord.ear,
//                 ear_other: healthrecord.ear == '未见异常' ? '' : healthrecord.ear,
//                 nose: healthrecord.nose,
//                 nose_other: healthrecord.nose == '未见异常' ? '' : healthrecord.nose,
//                 throat: healthrecord.throat,
//                 throat_other: healthrecord.throat == '未见异常' ? '' : healthrecord.throat,
//                 tonsil: healthrecord.tonsil,
//                 tonsil_other: healthrecord.tonsil == '未见异常' ? '' : healthrecord.tonsil,
//                 eyes: healthrecord.eyes,
//                 eyes_other: healthrecord.eyes == '未见异常' ? '' : healthrecord.eyes,
//                 vision: healthrecord.vision,
//                 vision_other: healthrecord.vision == '未见异常' ? '' : healthrecord.vision,
//                 gums: healthrecord.gums,
//                 gums_other: healthrecord.gums == '未见异常' ? '' : healthrecord.gums,
//                 tongue_tie: healthrecord.tongue_tie,
//                 tongue_tie_other: healthrecord.tongue_tie == '未见异常' ? '' : healthrecord.tongue_tie,
//                 teeth_pit: healthrecord.teeth_pit,
//                 teeth_pit_other: healthrecord.teeth_pit == '未见异常' ? '' : healthrecord.teeth_pit,
//                 plaque: healthrecord.plaque,
//                 plaque_other: healthrecord.plaque == '未见异常' ? '' : healthrecord.plaque,
//                 dental_caries: healthrecord.dental_caries,
//                 dental_caries_other: healthrecord.dental_caries == '未见异常' ? '' : healthrecord.dental_caries,
//                 limb: healthrecord.limb,
//                 limb_other: healthrecord.limb == '未见异常' ? '' : healthrecord.limb,
//                 ribs: healthrecord.ribs,
//                 ribs_other: healthrecord.ribs == '未见异常' ? '' : healthrecord.ribs,
//                 head: healthrecord.head,
//                 head_other: healthrecord.head == '未见异常' ? '' : healthrecord.head,
//                 bregmatic: healthrecord.bregmatic,
//                 bregmatic_other: healthrecord.bregmatic == '未见异常' ? '' : healthrecord.bregmatic,
//                 hip_joint: healthrecord.hip_joint,
//                 hip_joint_other: healthrecord.hip_joint == '未见异常' ? '' : healthrecord.hip_joint,
//                 torticollis: healthrecord.torticollis,
//                 torticollis_other: healthrecord.torticollis == '未见异常' ? '' : healthrecord.torticollis,
//                 genitalia: healthrecord.genitalia,
//                 genitalia_other: healthrecord.genitalia == '未见异常' ? '' : healthrecord.genitalia,
//                 anus: healthrecord.anus,
//                 anus_other: healthrecord.anus == '未见异常' ? '' : healthrecord.anus,
//                 neurodevelopment: healthrecord.neurodevelopment,
//                 neurodevelopment_other: healthrecord.neurodevelopment == '未见异常' ? '' : healthrecord.neurodevelopment,
//                 blood_routine_examination: healthrecord.bloodRoutineExamination,
//                 blood_routine_examination_other: healthrecord.bloodRoutineExamination == '未见异常' || healthrecord.bloodRoutineExamination == '贫血' || healthrecord.bloodRoutineExamination == '白细胞高值' ? '' : healthrecord.bloodRoutineExamination,
//                 routine_urine: healthrecord.routineUrine,
//                 routine_urine_other: healthrecord.routineUrine == '未见异常' ? '' : healthrecord.routineUrine,
//                 stool_routine_examination: healthrecord.stoolRoutineExamination,
//                 stool_routine_examination_other: healthrecord.stoolRoutineExamination == '未见异常' ? '' : healthrecord.stoolRoutineExamination,
//                 bone_density: healthrecord.boneDensity,
//                 bone_density_other: healthrecord.boneDensity == '未见异常' ? '' : healthrecord.boneDensity,
//                 BALP: healthrecord.BALP,
//                 BALP_other: healthrecord.BALP == '未见异常' ? '' : healthrecord.BALP,
//                 trace_element: healthrecord.traceElement,
//                 trace_element_other: healthrecord.traceElement == '未见异常' ? '' : healthrecord.traceElement,
//                 heavy_metal: healthrecord.heavyMetal,
//                 heavy_metal_other: healthrecord.heavyMetal == '未见异常' ? '' : healthrecord.heavyMetal,
//                 feeding: healthrecord.feeding,
//                 life: healthrecord.life,
//                 immunization: healthrecord.immunization,
//                 disease_prevention: healthrecord.diseasePrevention,
//                 answering_questions: healthrecord.answeringQuestions,
//                 record: healthrecord.record,
//                 review_date: healthrecord.reviewDate ? this.adminService.dateFormatHasWord(healthrecord.reviewDate) : healthrecord.reviewDate,
//                 review_date_text: healthrecord.reviewDate,
//             }
//             this.baseInfo = {
//                 height: healthrecord.height,
//                 medium_height: healthrecord.mediumHeight,
//                 weight: healthrecord.weight,
//                 medium_weight: healthrecord.mediumWeight,
//                 head_circum: healthrecord.headCircum,
//                 breast_circum: healthrecord.breastCircum,
//                 body_temperature: healthrecord.bodyTemperature,
//                 pulse: healthrecord.pulse,
//                 breathe: healthrecord.breathe,
//                 blood_pressure: healthrecord.bloodPressure,
//             }
//         }else{
//             this.info = {
//                 id: '',
//                 child_id: doctorBooking.childId,
//                 booking_id: doctorBooking.bookingId,
//                 name: doctorBooking.childName,
//                 age: doctorBooking.age,
//                 check_date: this.adminService.getDayByDate(new Date()),
//                 height: null,
//                 medium_height: null,
//                 compare_height: null,
//                 weight: null,
//                 medium_weight: null,
//                 compare_weight: null,
//                 head_circum: null,
//                 breast_circum: null,
//                 body_temperature: null,
//                 pulse: null,
//                 breathe: null,
//                 blood_pressure: null,
//                 skin: null,
//                 skin_other: '',
//                 oral_mucosa: null,
//                 oral_mucosa_other: '',
//                 hair: null,
//                 hair_other: '',
//                 lymph_node: null,
//                 lymph_node_other: '',
//                 heart: null,
//                 heart_other: '',
//                 lung: null,
//                 lung_other: '',
//                 liver_spleen: null,
//                 liver_spleen_other: '',
//                 kidney: null,
//                 kidney_other: '',
//                 abdomen: null,
//                 abdomen_other: '',
//                 ear: null,
//                 ear_other: '',
//                 nose: null,
//                 nose_other: '',
//                 throat: null,
//                 throat_other: '',
//                 tonsil: null,
//                 tonsil_other: '',
//                 eyes: null,
//                 eyes_other: '',
//                 vision: null,
//                 vision_other: '',
//                 gums: null,
//                 gums_other: '',
//                 tongue_tie: null,
//                 tongue_tie_other: '',
//                 teeth_pit: null,
//                 teeth_pit_other: '',
//                 plaque: null,
//                 plaque_other: '',
//                 dental_caries: null,
//                 dental_caries_other: '',
//                 limb: null,
//                 limb_other: '',
//                 ribs: null,
//                 ribs_other: '',
//                 head: null,
//                 head_other: '',
//                 bregmatic: null,
//                 bregmatic_other: '',
//                 hip_joint: null,
//                 hip_joint_other: '',
//                 torticollis: null,
//                 torticollis_other: '',
//                 genitalia: null,
//                 genitalia_other: '',
//                 anus: null,
//                 anus_other: '',
//                 neurodevelopment: null,
//                 neurodevelopment_other: '',
//                 blood_routine_examination: null,
//                 blood_routine_examination_other: '',
//                 routine_urine: null,
//                 routine_urine_other: '',
//                 stool_routine_examination: null,
//                 stool_routine_examination_other: '',
//                 bone_density: null,
//                 bone_density_other: '',
//                 BALP: null,
//                 BALP_other: '',
//                 trace_element: null,
//                 trace_element_other: '',
//                 heavy_metal: null,
//                 heavy_metal_other: '',
//                 feeding: null,
//                 life: null,
//                 immunization: null,
//                 disease_prevention: null,
//                 answering_questions: null,
//                 record: null,
//                 review_date: '',
//                 review_date_text: '',
//             }
//             this.baseInfo = {
//                 height: null,
//                 medium_height: null,
//                 weight: null,
//                 medium_weight: null,
//                 head_circum: null,
//                 breast_circum: null,
//                 body_temperature: null,
//                 pulse: null,
//                 breathe: null,
//                 blood_pressure: null,
//             }
//             var doctorBookingRecordTemplet = JSON.parse(sessionStorage.getItem('doctorBookingRecordTemplet'));
//             if(doctorBookingRecordTemplet.recordkeys.length > 0){
//                 for(var i = 0; i < doctorBookingRecordTemplet.recordkeys.length; i++){
//                     this.info[doctorBookingRecordTemplet.recordkeys[i].key] = '';
//                     this.baseInfo[doctorBookingRecordTemplet.recordkeys[i].key] = '';
//                     if(doctorBookingRecordTemplet.recordkeys[i].key=='medium_height'){
//                         if(childcontrast.info){
//                             this.info.medium_height = childcontrast.info.height;
//                         }else{
//                             this.info.medium_height = '';
//                         }
//                     }
//                     if(doctorBookingRecordTemplet.recordkeys[i].key=='medium_weight'){
//                         if(childcontrast.info){
//                             this.info.medium_weight = childcontrast.info.weight;
//                         }else{
//                             this.info.medium_weight = '';
//                         }
//                     }
//                 }
//             }
//         }
//
//         this.btnCanEdit = false;
//     }
//
//     // 身高对比
//     changeHeight() {
//         if(!this.adminService.isFalse(this.info.height) && parseFloat(this.info.height) <= 0){
//             this.toastTab('身高应大于0', 'error');
//             return;
//         }
//         if(!this.adminService.isFalse(this.info.medium_height) && parseFloat(this.info.medium_height) <= 0){
//             this.toastTab('中等值应大于0', 'error');
//             return;
//         }
//         if(this.adminService.isFalse(this.info.height) || this.adminService.isFalse(this.info.medium_height)){
//             this.info.compare_height = '';
//             return;
//         }
//         var compare = this.adminService.toDecimal2((parseFloat(this.info.height) - parseFloat(this.info.medium_height)) / parseFloat(this.info.medium_height) * 100);
//         this.info.compare_height = (parseFloat(compare) < 0 ? '低' : '高') + (this.adminService.toDecimal2(parseFloat(compare) * (parseFloat(compare) < 0 ? -1 : 1))) + '%';
//     }
//
//     // 体重对比
//     changeWeight() {
//         if(!this.adminService.isFalse(this.info.weight) && parseFloat(this.info.weight) <= 0){
//             this.toastTab('体重应大于0', 'error');
//             return;
//         }
//         if(!this.adminService.isFalse(this.info.medium_weight) && parseFloat(this.info.medium_weight) <= 0){
//             this.toastTab('中等值应大于0', 'error');
//             return;
//         }
//         if(this.adminService.isFalse(this.info.weight) || this.adminService.isFalse(this.info.medium_weight)){
//             this.info.compare_weight = '';
//             return;
//         }
//         var compare = this.adminService.toDecimal2((parseFloat(this.info.weight) - parseFloat(this.info.medium_weight)) / parseFloat(this.info.medium_weight));
//         this.info.compare_weight = (parseFloat(compare) < 0 ? '低' : '高') + (this.adminService.toDecimal2(parseFloat(compare) * 100 * (parseFloat(compare) < 0 ? -1 : 1))) + '%';
//     }
//
// 	//redio切换
// 	changeRedio(_value, _key) {
//         if(_key.indexOf('_other') != -1){
//             this.info[_key.slice(0, _key.indexOf('_other'))] = '';
//             return;
//         }
//         this.info[_key + '_other'] = '';
// 		this.info[_key] = _value;
// 	}
//
// 	validateNumber(type, info) {
// 		if(!this.adminService.isFalse(this.info[type]) && Number(this.info[type]) <= 0){
// 			this.toastTab(info + '应大于0', 'error');
// 			return false;
// 		}
// 		return true;
// 	}
//
//     // 选择日期
//     changeDate(_value) {
//         this.info.review_date = JSON.parse(_value).value;
//     }
//
//     create(f) {
//         this.btnCanEdit = true;
//         this.info.skin = this.adminService.trim(this.info.skin);
//         this.info.skin_other = this.adminService.trim(this.info.skin_other);
//         this.info.oral_mucosa = this.adminService.trim(this.info.oral_mucosa);
//         this.info.oral_mucosa_other = this.adminService.trim(this.info.oral_mucosa_other);
//         this.info.hair = this.adminService.trim(this.info.hair);
//         this.info.hair_other = this.adminService.trim(this.info.hair_other);
//         this.info.lymph_node = this.adminService.trim(this.info.lymph_node);
//         this.info.lymph_node_other = this.adminService.trim(this.info.lymph_node_other);
//         this.info.heart = this.adminService.trim(this.info.heart);
//         this.info.heart_other = this.adminService.trim(this.info.heart_other);
//         this.info.lung = this.adminService.trim(this.info.lung);
//         this.info.lung_other = this.adminService.trim(this.info.lung_other);
//         this.info.kidney = this.adminService.trim(this.info.kidney);
//         this.info.kidney_other = this.adminService.trim(this.info.kidney_other);
//         this.info.abdomen = this.adminService.trim(this.info.abdomen);
//         this.info.abdomen_other = this.adminService.trim(this.info.abdomen_other);
//         this.info.ear = this.adminService.trim(this.info.ear);
//         this.info.ear_other = this.adminService.trim(this.info.ear_other);
//         this.info.nose = this.adminService.trim(this.info.nose);
//         this.info.nose_other = this.adminService.trim(this.info.nose_other);
//         this.info.throat = this.adminService.trim(this.info.throat);
//         this.info.throat_other = this.adminService.trim(this.info.throat_other);
//         this.info.tonsil = this.adminService.trim(this.info.tonsil);
//         this.info.tonsil_other = this.adminService.trim(this.info.tonsil_other);
//         this.info.eyes = this.adminService.trim(this.info.eyes);
//         this.info.eyes_other = this.adminService.trim(this.info.eyes_other);
//         this.info.vision = this.adminService.trim(this.info.vision);
//         this.info.vision_other = this.adminService.trim(this.info.vision_other);
//         this.info.gums = this.adminService.trim(this.info.gums);
//         this.info.gums_other = this.adminService.trim(this.info.gums_other);
//         this.info.tongue_tie = this.adminService.trim(this.info.tongue_tie);
//         this.info.tongue_tie_other = this.adminService.trim(this.info.tongue_tie_other);
//         this.info.teeth_pit = this.adminService.trim(this.info.teeth_pit);
//         this.info.teeth_pit_other = this.adminService.trim(this.info.teeth_pit_other);
//         this.info.plaque = this.adminService.trim(this.info.plaque);
//         this.info.plaque_other = this.adminService.trim(this.info.plaque_other);
//         this.info.dental_caries = this.adminService.trim(this.info.dental_caries);
//         this.info.dental_caries_other = this.adminService.trim(this.info.dental_caries_other);
//         this.info.limb = this.adminService.trim(this.info.limb);
//         this.info.limb_other = this.adminService.trim(this.info.limb_other);
//         this.info.ribs = this.adminService.trim(this.info.ribs);
//         this.info.ribs_other = this.adminService.trim(this.info.ribs_other);
//         this.info.head = this.adminService.trim(this.info.head);
//         this.info.head_other = this.adminService.trim(this.info.head_other);
//         this.info.bregmatic = this.adminService.trim(this.info.bregmatic);
//         this.info.bregmatic_other = this.adminService.trim(this.info.bregmatic_other);
//         this.info.hip_joint = this.adminService.trim(this.info.hip_joint);
//         this.info.hip_joint_other = this.adminService.trim(this.info.hip_joint_other);
//         this.info.torticollis = this.adminService.trim(this.info.torticollis);
//         this.info.torticollis_other = this.adminService.trim(this.info.torticollis_other);
//         this.info.genitalia = this.adminService.trim(this.info.genitalia);
//         this.info.genitalia_other = this.adminService.trim(this.info.genitalia_other);
//         this.info.anus = this.adminService.trim(this.info.anus);
//         this.info.anus_other = this.adminService.trim(this.info.anus_other);
//         this.info.neurodevelopment = this.adminService.trim(this.info.neurodevelopment);
//         this.info.neurodevelopment_other = this.adminService.trim(this.info.neurodevelopment_other);
//         this.info.blood_routine_examination = this.adminService.trim(this.info.blood_routine_examination);
//         this.info.blood_routine_examination_other = this.adminService.trim(this.info.blood_routine_examination_other);
//         this.info.routine_urine = this.adminService.trim(this.info.routine_urine);
//         this.info.routine_urine_other = this.adminService.trim(this.info.routine_urine_other);
//         this.info.stool_routine_examination = this.adminService.trim(this.info.stool_routine_examination);
//         this.info.stool_routine_examination_other = this.adminService.trim(this.info.stool_routine_examination_other);
//         this.info.bone_density = this.adminService.trim(this.info.bone_density);
//         this.info.bone_density_other = this.adminService.trim(this.info.bone_density_other);
//         this.info.BALP = this.adminService.trim(this.info.BALP);
//         this.info.BALP_other = this.adminService.trim(this.info.BALP_other);
//         this.info.trace_element = this.adminService.trim(this.info.trace_element);
//         this.info.trace_element_other = this.adminService.trim(this.info.trace_element_other);
//         this.info.heavy_metal = this.adminService.trim(this.info.heavy_metal);
//         this.info.heavy_metal_other = this.adminService.trim(this.info.heavy_metal_other);
//         this.info.feeding = this.adminService.trim(this.info.feeding);
//         this.info.life = this.adminService.trim(this.info.life);
//         this.info.immunization = this.adminService.trim(this.info.immunization);
//         this.info.disease_prevention = this.adminService.trim(this.info.disease_prevention);
//         this.info.answering_questions = this.adminService.trim(this.info.answering_questions);
//         this.info.record = this.adminService.trim(this.info.record);
// 		if(!this.validateNumber('height', '身高')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('medium_height', '身高中等值')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('weight', '体重')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('medium_weight', '体重中等值')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('head_circum', '头围')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('breast_circum', '胸围')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('body_temperature', '体温')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('pulse', '脉搏')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('breathe', '呼吸')){
//             this.btnCanEdit = false;
// 			return;
// 		}
// 		if(!this.validateNumber('blood_pressure', '血压')){
//             this.btnCanEdit = false;
// 			return;
// 		}
//         var params = {
//             username: this.adminService.getUser().username,
//             token: this.adminService.getUser().token,
//             clinic_id: this.adminService.getUser().clinicId,
//             child_id: this.info.child_id,
//             booking_id: this.info.booking_id,
//             check_date: this.adminService.getDayByDate(new Date()),
//             height: this.info.height == '' ? '0' : this.info.height,
//             medium_height: this.info.medium_height == '' ? '0' : this.info.medium_height,
//             compare_height: this.info.compare_height,
//             weight: this.info.weight == '' ? '0' : this.info.weight,
//             medium_weight: this.info.medium_weight == '' ? '0' : this.info.medium_weight,
//             compare_weight: this.info.compare_weight,
//             head_circum: this.info.head_circum == '' ? '0' : this.info.head_circum,
//             breast_circum: this.info.breast_circum == '' ? '0' : this.info.breast_circum,
//             body_temperature: this.info.body_temperature,
//             pulse: this.info.pulse,
//             breathe: this.info.breathe,
//             blood_pressure: this.info.blood_pressure,
//             skin: this.info.skin != '' ? this.info.skin : this.info.skin_other,
//             oral_mucosa: this.info.oral_mucosa != '' ? this.info.oral_mucosa : this.info.oral_mucosa_other,
//             hair: this.info.hair != '' ? this.info.hair : this.info.hair_other,
//             lymph_node: this.info.lymph_node != '' ? this.info.lymph_node : this.info.lymph_node_other,
//             heart: this.info.heart != '' ? this.info.heart : this.info.heart_other,
//             lung: this.info.lung != '' ? this.info.lung : this.info.lung_other,
//             liver_spleen: this.info.liver_spleen != '' ? this.info.liver_spleen : this.info.liver_spleen_other,
//             kidney: this.info.kidney != '' ? this.info.kidney : this.info.kidney_other,
//             abdomen: this.info.abdomen != '' ? this.info.abdomen : this.info.abdomen_other,
//             ear: this.info.ear != '' ? this.info.ear : this.info.ear_other,
//             nose: this.info.nose != '' ? this.info.nose : this.info.nose_other,
//             throat: this.info.throat != '' ? this.info.throat : this.info.throat_other,
//             tonsil: this.info.tonsil != '' ? this.info.tonsil : this.info.tonsil_other,
//             eyes: this.info.eyes != '' ? this.info.eyes : this.info.eyes_other,
//             vision: this.info.vision != '' ? this.info.vision : this.info.vision_other,
//             gums: this.info.gums != '' ? this.info.gums : this.info.gums_other,
//             tongue_tie: this.info.tongue_tie != '' ? this.info.tongue_tie : this.info.tongue_tie_other,
//             teeth_pit: this.info.teeth_pit != '' ? this.info.teeth_pit : this.info.teeth_pit_other,
//             plaque: this.info.plaque != '' ? this.info.plaque : this.info.plaque_other,
//             dental_caries: this.info.dental_caries != '' ? this.info.dental_caries : this.info.dental_caries_other,
//             limb: this.info.limb != '' ? this.info.limb : this.info.limb_other,
//             ribs: this.info.ribs != '' ? this.info.ribs : this.info.ribs_other,
//             head: this.info.head != '' ? this.info.head : this.info.head_other,
//             bregmatic: this.info.bregmatic != '' ? this.info.bregmatic : this.info.bregmatic_other,
//             hip_joint: this.info.hip_joint != '' ? this.info.hip_joint : this.info.hip_joint_other,
//             torticollis: this.info.torticollis != '' ? this.info.torticollis : this.info.torticollis_other,
//             genitalia: this.info.genitalia != '' ? this.info.genitalia : this.info.genitalia_other,
//             anus: this.info.anus != '' ? this.info.anus : this.info.anus_other,
//             neurodevelopment: this.info.neurodevelopment != '' ? this.info.neurodevelopment : this.info.neurodevelopment_other,
//             blood_routine_examination: this.info.blood_routine_examination != '' ? this.info.blood_routine_examination : this.info.blood_routine_examination_other,
//             routine_urine: this.info.routine_urine != '' ? this.info.routine_urine : this.info.routine_urine_other,
//             stool_routine_examination: this.info.stool_routine_examination != '' ? this.info.stool_routine_examination : this.info.stool_routine_examination_other,
//             bone_density: this.info.bone_density != '' ? this.info.bone_density : this.info.bone_density_other,
//             BALP: this.info.BALP != '' ? this.info.BALP : this.info.BALP_other,
//             trace_element: this.info.trace_element != '' ? this.info.trace_element : this.info.trace_element_other,
//             heavy_metal: this.info.heavy_metal != '' ? this.info.heavy_metal : this.info.heavy_metal_other,
//             feeding: this.info.feeding,
//             life: this.info.life,
//             immunization: this.info.immunization,
//             disease_prevention: this.info.disease_prevention,
//             answering_questions: this.info.answering_questions,
//             record: this.info.record,
//             review_date: this.info.review_date == '' ? null : this.info.review_date,
//         }
//
//         var urlOptions = '';
//         if(this.editType == 'update'){
//             urlOptions = '/' + this.info.id;
//         }
//         this.adminService.healthrecord(urlOptions, params).then((data) => {
//             if(data.status == 'no'){
//                 this.toastTab(data.errorMsg, 'error');
//                 this.btnCanEdit = false;
//             }else{
//                 if(this.editType == 'create'){
//                     this.toastTab('儿保记录创建成功', '');
//                 }else{
//                     this.toastTab('儿保记录修改成功', '');
//                 }
//                 setTimeout(() => {
//                     this.router.navigate(['./admin/docbooking/healthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId}});
//                 }, 2000);
//             }
//         }).catch(() => {
            //     this.toastTab('服务器错误', 'error');
            //     this.btnCanEdit = false;
            // });
//     }
//
// 	toastTab(text, type) {
// 		this.toast = {
// 			show: 1,
// 			text: text,
// 			type: type,
// 		}
// 		setTimeout(() => {
// 	    	this.toast = {
// 				show: 0,
// 				text: '',
// 				type: '',
// 			}
// 	    }, 2000);
// 	}
// }
