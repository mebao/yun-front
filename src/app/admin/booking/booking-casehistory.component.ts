import { Component }                          from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-booking-casehistory',
	templateUrl: './booking-casehistory.component.html',
	styleUrls: ['./booking-casehistory.component.scss'],
})
export class BookingCasehistoryComponent{
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
		body_temperature: string,
		breathe: string,
		blood_pressure: string,
		face_neck: string,
		heart_lung: string,
		abdomen: string,
		limbs: string,
		nervous_system: string,
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
		checkList: any[],
	};
	id: string;
	doctorId: string;
	childId: string;
	editType: string;
	// 主诉模板
	cprtemplateList: any[];
	cprtemplate: string;
	// 体格检查详情
	showExamination: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '病历',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
			this.doctorId = params.doctorId;
			this.childId = params.childId;
			this.editType = params.type;
		});

		var prescription = '';
		if(sessionStorage.getItem('prescript') != ''){
			var prescript = JSON.parse(sessionStorage.getItem('prescript'));
			if(prescript.info.length > 0){
				for(var i = 0; i < prescript.info.length; i++){
					prescription += prescript.info[i].pname + ': ' + prescript.info[i].frequency
						 + '，一次' + prescript.info[i].oneNum + prescript.info[i].oneUnit
						 + '，' + prescript.info[i].usage
						 + '，需服用' + prescript.info[i].days + '天'
						 + '，共开' + prescript.info[i].num + prescript.info[i].unit + '。';
				}
			}
		}
		if(this.editType == 'update'){
			var casehistory = JSON.parse(sessionStorage.getItem('casehistory'));
			this.info = {
				name: JSON.parse(sessionStorage.getItem('doctorBooking')).childName,
				age: JSON.parse(sessionStorage.getItem('doctorBooking')).age,
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
				body_temperature: casehistory.bodyTemperature,
				breathe: casehistory.breathe,
				blood_pressure: casehistory.bloodPressure,
				face_neck: casehistory.faceNeck,
				heart_lung: casehistory.heartLung,
				abdomen: casehistory.abdomen,
				limbs: casehistory.limbs,
				nervous_system: casehistory.nervousSystem,
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
				prescription: prescription,
				advise: casehistory.advise,
				time: casehistory.time,
				checkList: casehistory.checkList,
			}
		}else{
			this.info = {
				name: JSON.parse(sessionStorage.getItem('doctorBooking')).childName,
				age: JSON.parse(sessionStorage.getItem('doctorBooking')).age,
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
				body_temperature: '',
				breathe: '',
				blood_pressure: '',
				face_neck: '',
				heart_lung: '',
				abdomen: '',
				limbs: '',
				nervous_system: '',
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
				prescription: prescription,
				advise: '',
				time: '',
				checkList: [],
			}
		}

		// 主诉模板
		this.cprtemplateList = [];
		this.cprtemplate = '';
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.cprtemplate(urlOptions).then((data) => {
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
		});

		this.showExamination = false;
	}

    // 身高对比
    changeHeight() {
        if(this.adminService.isFalse(this.info.height) || this.adminService.isFalse(this.info.mid_height)){
            this.info.compare_height = '';
            return;
        }
        if(parseFloat(this.info.height) <= 0){
            this.toastTab('身高应大于0', 'error');
            return;
        }
        if(parseFloat(this.info.mid_height) <= 0){
            this.toastTab('身高同年龄中等值应大于0', 'error');
            return;
        }
        var compare = this.adminService.toDecimal2((parseFloat(this.info.height) - parseFloat(this.info.mid_height)) / parseFloat(this.info.mid_height) * 100);
        this.info.compare_height = (parseFloat(compare) < 0 ? '低' : '高') + (this.adminService.toDecimal2(parseFloat(compare) * (parseFloat(compare) < 0 ? -1 : 1))) + '%';
    }

    // 体重对比
    changeWeight() {
        if(this.adminService.isFalse(this.info.weight) || this.adminService.isFalse(this.info.mid_weight)){
            this.info.compare_weight = '';
            return;
        }
        if(parseFloat(this.info.weight) <= 0){
            this.toastTab('体重应大于0', 'error');
            return;
        }
        if(parseFloat(this.info.mid_weight) <= 0){
            this.toastTab('体重同年龄中等值应大于0', 'error');
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
		this.info.topic_comment = JSON.parse(this.cprtemplate).action;
		this.info.check_result = JSON.parse(this.cprtemplate).peValue;
	}

	changeExamination() {
		this.showExamination = !this.showExamination;
	}

	create(f) {
		if(!this.adminService.isFalse(f.value.weight) && Number(f.value.weight) <= 0){
			this.toastTab('体重应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.mid_weight) && Number(f.value.mid_weight) <= 0){
			this.toastTab('体重同年龄中等值应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.height) && Number(f.value.height) <= 0){
			this.toastTab('身高应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.mid_height) && Number(f.value.mid_height) <= 0){
			this.toastTab('身高同年龄中等值应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.head_circum) && Number(f.value.head_circum) <= 0){
			this.toastTab('头围应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.breast_circum) && Number(f.value.breast_circum) <= 0){
			this.toastTab('胸围应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.teeth) && Number(f.value.teeth) <= 0){
			this.toastTab('牙齿应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(f.value.body_temperature) && Number(f.value.body_temperature) <= 0){
			this.toastTab('体温应大于0', 'error');
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
			child_id: this.childId,
			booking_id: this.id,
			weight: f.value.weight == '' ? null : f.value.weight,
			mid_weight: f.value.mid_weight == '' ? null : f.value.mid_weight,
			compare_weight: this.info.compare_weight,
			height: f.value.height == '' ? null : f.value.height,
			mid_height: f.value.mid_height == '' ? null : f.value.mid_height,
			compare_height: this.info.compare_height,
			head_circum: f.value.head_circum == '' ? null : f.value.head_circum,
			breast_circum: f.value.breast_circum == '' ? null : f.value.breast_circum,
			teeth: f.value.teeth,
			topic_comment: f.value.topic_comment,
			check_result: f.value.check_result,
			present_illness: f.value.present_illness,
			previous_history: f.value.previous_history,
			allergy: f.value.allergy,
			family_history: f.value.family_history,
			breed_history: f.value.breed_history,
			growth_history: f.value.growth_history,
			body_temperature: f.value.body_temperature == '' ? null : f.value.body_temperature,
			breathe: f.value.breathe,
			blood_pressure: f.value.blood_pressure,
			face_neck: f.value.face_neck,
			heart_lung: f.value.heart_lung,
			abdomen: f.value.abdomen,
			limbs: f.value.limbs,
			nervous_system: f.value.nervous_system,
			blood_routine_examination: this.info.blood_routine_examination == '' ? this.info.blood_routine_examination_other : this.info.blood_routine_examination,
			routine_urine: this.info.routine_urine == '' ? this.info.routine_urine_other : this.info.routine_urine,
			bone_density: this.info.bone_density,
			BALP: this.info.BALP == '' ? this.info.BALP_other : this.info.BALP,
			trace_element: this.info.trace_element == '' ? this.info.trace_element_other : this.info.trace_element,
			diagnosis: f.value.diagnosis,
			advise: f.value.advise,
			time: f.value.time == '' ? null : f.value.time,
		}

		if(this.editType == 'create'){
			this.adminService.casehistory('', params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('病历创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBookingCasehistory'], {queryParams: {id: this.id, doctorId: this.doctorId}});
					}, 2000);
				}
			});
		}else{
			this.adminService.casehistory('/' + JSON.parse(sessionStorage.getItem('casehistory')).id, params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('病历修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBookingCasehistory'], {queryParams: {id: this.id, doctorId: this.doctorId}});
					}, 2000);
				}
			});
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
