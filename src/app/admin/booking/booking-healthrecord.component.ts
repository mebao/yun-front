import { Component }                      from '@angular/core';
import { Router, ActivatedRoute }         from '@angular/router';

import { AdminService }                   from '../admin.service';

@Component({
    selector: 'admin-booking-healthrecord',
    templateUrl: './booking-healthrecord.component.html',
    styleUrls: ['./booking-healthrecord.component.scss'],
})
export class BookingHealthrecordComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
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
        dental_caries: string,
        dental_caries_other: string,
        limb: string,
        limb_other: string,
        ribs: string,
        ribs_other: string,
        head: string,
        head_other: string,
        bregmatic: string,
        bregmatic_other: string,
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
        BALP: string,
        trace_element: string,
        trace_element_other: string,
        heavy_metal: string,
        heavy_metal_other: string,
        feeding: string,
        life: string,
        immunization: string,
        disease_prevention: string,
        answering_questions: string,
        record: string,
        review_date: string,
    }
    id: string;
    doctorId: string;
    editType: string;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '儿保记录',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

        var doctorBooking = JSON.parse(sessionStorage.getItem('doctorBooking'));
        var healthrecord = JSON.parse(sessionStorage.getItem('healthrecord'));

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.doctorId = params.doctorId;
            this.editType = params.type;
        });

        if(this.editType == 'update'){
            this.info = {
                id: healthrecord.id,
                child_id: doctorBooking.childId,
                booking_id: doctorBooking.bookingId,
                name: doctorBooking.childName,
                age: doctorBooking.age,
                check_date: healthrecord.checkDate,
                height: healthrecord.height,
                medium_height: healthrecord.mediumHeight,
                compare_height: healthrecord.compareHeight,
                weight: healthrecord.weight,
                medium_weight: healthrecord.mediumWeight,
                compare_weight: healthrecord.compareWeight,
                head_circum: healthrecord.headCircum,
                breast_circum: healthrecord.breastCircum,
                body_temperature: healthrecord.bodyTemperature,
                pulse: healthrecord.pulse,
                breathe: healthrecord.breathe,
                blood_pressure: healthrecord.bloodPressure,
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
                lung: healthrecord.lung,
                lung_other: healthrecord.lung == '未见异常' ? '' : healthrecord.lung,
                liver_spleen: healthrecord.liverSpleen,
                liver_spleen_other: healthrecord.liverSpleen == '未见异常' ? '' : healthrecord.liverSpleen,
                kidney: healthrecord.kidney,
                kidney_other: healthrecord.kidney == '未见异常' ? '' : healthrecord.kidney,
                abdomen: healthrecord.abdomen,
                abdomen_other: healthrecord.abdomen == '未见异常' ? '' : healthrecord.abdomen,
                ear: healthrecord.ear,
                ear_other: healthrecord.ear == '未见异常' ? '' : healthrecord.ear,
                nose: healthrecord.nose,
                nose_other: healthrecord.nose == '未见异常' ? '' : healthrecord.nose,
                throat: healthrecord.throat,
                throat_other: healthrecord.throat == '未见异常' ? '' : healthrecord.throat,
                tonsil: healthrecord.tonsil,
                tonsil_other: healthrecord.tonsil == '未见异常' ? '' : healthrecord.tonsil,
                eyes: healthrecord.eyes,
                eyes_other: healthrecord.eyes == '未见异常' ? '' : healthrecord.eyes,
                vision: healthrecord.vision,
                vision_other: healthrecord.vision == '未见异常' ? '' : healthrecord.vision,
                gums: healthrecord.gums,
                gums_other: healthrecord.gums == '未见异常' ? '' : healthrecord.gums,
                tongue_tie: healthrecord.tongue_tie,
                tongue_tie_other: healthrecord.tongue_tie == '未见异常' ? '' : healthrecord.tongue_tie,
                teeth_pit: healthrecord.teeth_pit,
                teeth_pit_other: healthrecord.teeth_pit == '未见异常' ? '' : healthrecord.teeth_pit,
                plaque: healthrecord.plaque,
                plaque_other: healthrecord.plaque == '未见异常' ? '' : healthrecord.plaque,
                dental_caries: healthrecord.dental_caries,
                dental_caries_other: healthrecord.dental_caries == '未见异常' ? '' : healthrecord.dental_caries,
                limb: healthrecord.limb,
                limb_other: healthrecord.limb == '未见异常' ? '' : healthrecord.limb,
                ribs: healthrecord.ribs,
                ribs_other: healthrecord.ribs == '未见异常' ? '' : healthrecord.ribs,
                head: healthrecord.head,
                head_other: healthrecord.head == '未见异常' ? '' : healthrecord.head,
                bregmatic: healthrecord.bregmatic,
                bregmatic_other: healthrecord.bregmatic == '未见异常' ? '' : healthrecord.bregmatic,
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
                BALP: healthrecord.BALP,
                trace_element: healthrecord.traceElement,
                trace_element_other: healthrecord.traceElement == '未见异常' ? '' : healthrecord.traceElement,
                heavy_metal: healthrecord.heavyMetal,
                heavy_metal_other: healthrecord.heavyMetal == '未见异常' ? '' : healthrecord.heavyMetal,
                feeding: healthrecord.feeding,
                life: healthrecord.life,
                immunization: healthrecord.immunization,
                disease_prevention: healthrecord.diseasePrevention,
                answering_questions: healthrecord.answeringQuestions,
                record: healthrecord.record,
                review_date: healthrecord.reviewDate,
            }
        }else{
            this.info = {
                id: '',
                child_id: doctorBooking.childId,
                booking_id: doctorBooking.bookingId,
                name: doctorBooking.childName,
                age: doctorBooking.age,
                check_date: this.adminService.getDayByDate(new Date()),
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
                dental_caries: '',
                dental_caries_other: '',
                limb: '',
                limb_other: '',
                ribs: '',
                ribs_other: '',
                head: '',
                head_other: '',
                bregmatic: '',
                bregmatic_other: '',
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
                BALP: '',
                trace_element: '',
                trace_element_other: '',
                heavy_metal: '',
                heavy_metal_other: '',
                feeding: '',
                life: '',
                immunization: '',
                disease_prevention: '',
                answering_questions: '',
                record: '',
                review_date: '',
            }
        }
    }

    // 身高对比
    changeHeight() {
        if(this.adminService.isFalse(this.info.height) || this.adminService.isFalse(this.info.medium_height)){
            this.info.compare_height = '';
            return;
        }
        if(parseFloat(this.info.height) <= 0){
            this.toastTab('身高应大于0', 'error');
            return;
        }
        if(parseFloat(this.info.medium_height) <= 0){
            this.toastTab('身高同年龄中等值应大于0', 'error');
            return;
        }
        var compare = this.adminService.toDecimal2((parseFloat(this.info.height) - parseFloat(this.info.medium_height)) / parseFloat(this.info.medium_height) * 100);
        this.info.compare_height = (parseFloat(compare) < 0 ? '低' : '高') + (this.adminService.toDecimal2(parseFloat(compare) * (parseFloat(compare) < 0 ? -1 : 1))) + '%';
    }

    // 体重对比
    changeWeight() {
        if(this.adminService.isFalse(this.info.weight) || this.adminService.isFalse(this.info.medium_weight)){
            this.info.compare_weight = '';
            return;
        }
        if(parseFloat(this.info.weight) <= 0){
            this.toastTab('体重应大于0', 'error');
            return;
        }
        if(parseFloat(this.info.medium_weight) <= 0){
            this.toastTab('体重同年龄中等值应大于0', 'error');
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

    create(f) {
        if(this.info.check_date == ''){
            this.toastTab('检查日期不可为空', 'error');
            return;
        }
		if(!this.adminService.isFalse(f.value.height) && Number(f.value.height) <= 0){
			this.toastTab('身高应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.medium_height) && Number(f.value.medium_height) <= 0){
			this.toastTab('身高同年龄中等值应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.head_circum) && Number(f.value.head_circum) <= 0){
			this.toastTab('头围应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.weight) && Number(f.value.weight) <= 0){
			this.toastTab('体重应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.medium_weight) && Number(f.value.medium_weight) <= 0){
			this.toastTab('体重同年龄中等值应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.breast_circum) && Number(f.value.breast_circum) <= 0){
			this.toastTab('胸围应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.body_temperature) && Number(f.value.body_temperature) <= 0){
			this.toastTab('体温应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.pulse) && Number(f.value.pulse) <= 0){
			this.toastTab('脉搏应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.breathe) && Number(f.value.breathe) <= 0){
			this.toastTab('呼吸应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.blood_pressure) && Number(f.value.blood_pressure) <= 0){
			this.toastTab('血压应大于0', 'error');
			return;
		}
        var params = {
            username: this.adminService.getUser().username,
            token: this.adminService.getUser().token,
            clinic_id: this.adminService.getUser().clinicId,
            child_id: this.info.child_id,
            booking_id: this.info.booking_id,
            check_date: this.info.check_date,
            height: this.info.height == '' ? null : this.info.height,
            medium_height: this.info.medium_height == '' ? null : this.info.medium_height,
            compare_height: this.info.compare_height,
            weight: this.info.weight == '' ? null : this.info.weight,
            medium_weight: this.info.medium_weight == '' ? null : this.info.medium_weight,
            compare_weight: this.info.compare_weight,
            head_circum: this.info.head_circum == '' ? null : this.info.head_circum,
            breast_circum: this.info.breast_circum == '' ? null : this.info.breast_circum,
            body_temperature: this.info.body_temperature,
            pulse: this.info.pulse,
            breathe: this.info.breathe,
            blood_pressure: this.info.blood_pressure,
            skin: this.info.skin != '' ? this.info.skin : this.info.skin_other,
            oral_mucosa: this.info.oral_mucosa != '' ? this.info.oral_mucosa : this.info.oral_mucosa_other,
            hair: this.info.hair != '' ? this.info.hair : this.info.hair_other,
            lymph_node: this.info.lymph_node != '' ? this.info.lymph_node : this.info.lymph_node_other,
            heart: this.info.heart != '' ? this.info.heart : this.info.heart_other,
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
            dental_caries: this.info.dental_caries != '' ? this.info.dental_caries : this.info.dental_caries_other,
            limb: this.info.limb != '' ? this.info.limb : this.info.limb_other,
            ribs: this.info.ribs != '' ? this.info.ribs : this.info.ribs_other,
            head: this.info.head != '' ? this.info.head : this.info.head_other,
            bregmatic: this.info.bregmatic != '' ? this.info.bregmatic : this.info.bregmatic_other,
            hip_joint: this.info.hip_joint != '' ? this.info.hip_joint : this.info.hip_joint_other,
            torticollis: this.info.torticollis != '' ? this.info.torticollis : this.info.torticollis_other,
            genitalia: this.info.genitalia != '' ? this.info.genitalia : this.info.genitalia_other,
            anus: this.info.anus != '' ? this.info.anus : this.info.anus_other,
            neurodevelopment: this.info.neurodevelopment != '' ? this.info.neurodevelopment : this.info.neurodevelopment_other,
            blood_routine_examination: this.info.blood_routine_examination != '' ? this.info.blood_routine_examination : this.info.blood_routine_examination_other,
            routine_urine: this.info.routine_urine != '' ? this.info.routine_urine : this.info.routine_urine_other,
            stool_routine_examination: this.info.stool_routine_examination != '' ? this.info.stool_routine_examination : this.info.stool_routine_examination_other,
            bone_density: this.info.bone_density,
            BALP: this.info.BALP,
            trace_element: this.info.trace_element != '' ? this.info.trace_element : this.info.trace_element_other,
            heavy_metal: this.info.heavy_metal != '' ? this.info.heavy_metal : this.info.heavy_metal_other,
            feeding: this.info.feeding,
            life: this.info.life,
            immunization: this.info.immunization,
            disease_prevention: this.info.disease_prevention,
            answering_questions: this.info.answering_questions,
            record: this.info.record,
            review_date: this.info.review_date == '' ? null : this.info.review_date,
        }

        var urlOptions = '';
        if(this.editType == 'update'){
            urlOptions = '/' + this.info.id;
        }
        this.adminService.healthrecord(urlOptions, params).then((data) => {
            if(data.status == 'no'){
                this.toastTab(data.errorMsg, 'error');
            }else{
                if(this.editType == 'create'){
                    this.toastTab('儿保记录创建成功', '');
                }else{
                    this.toastTab('儿保记录修改成功', '');
                }
                setTimeout(() => {
                    this.router.navigate(['./admin/doctorBookingHealthrecord'], {queryParams: {id: this.id, doctorId: this.doctorId}});
                }, 2000);
            }
        });
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
