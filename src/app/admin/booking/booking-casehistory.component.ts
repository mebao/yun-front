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
		type: string,
	};
	loadingShow: boolean;
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
		physical_check: string,
		body_temperature: string,
		breathe: string,
		blood_pressure: string,
		face_neck: string,
		face_neck_other: string,
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
    }
	id: string;
	doctorId: string;
	status: string;
	childId: string;
	editType: string;
	// 主诉模板
	cprtemplateList: any[];
	cprtemplate: string;
	// 体格检查详情
	showExamination: boolean;
	// 不可连续点击
	btnCanEdit: boolean;
	// 是否可以修改药方
	canUpdatePrescript: boolean;
	url: string;

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

		var casehistory = JSON.parse(sessionStorage.getItem('casehistory'));

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
			this.doctorId = params.doctorId;
			this.status = params.status;
			this.childId = params.childId;
			this.editType = params.type;
		});

		this.canUpdatePrescript = false;

		var prescription = '';
		if(sessionStorage.getItem('prescript') != ''){
			var prescript = JSON.parse(sessionStorage.getItem('prescript'));
			if(prescript.info.length > 0){
				for(var i = 0; i < prescript.info.length; i++){
					prescription += prescript.info[i].pname + prescript.info[i].batch + '批次: ' + prescript.info[i].frequency
						 + '，一次' + prescript.info[i].oneNum + prescript.info[i].oneUnit
						 + '，' + prescript.info[i].usage
						 + '，需服用' + prescript.info[i].days + '天'
						 + '，共开' + prescript.info[i].num + prescript.info[i].unit + '。\n';
				}
			}

			if(this.status != '5' && !prescript.apotId){
				this.canUpdatePrescript = true;
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

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
				physical_check: casehistory.physicalCheck,
				body_temperature: casehistory.bodyTemperature,
				breathe: casehistory.breathe,
				blood_pressure: casehistory.bloodPressure,
				face_neck: casehistory.faceNeck,
				face_neck_other: casehistory.faceNeck == '未见异常' ? '' : casehistory.faceNeck,
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
				prescription: prescription,
				advise: casehistory.advise,
				time: casehistory.time,
				timeText: casehistory.time,
				checkList: casehistory.checkList,
			}
			this.baseInfo = {
                height: casehistory.height,
                mid_height: casehistory.height,
                weight: casehistory.weight,
                mid_weight: casehistory.midWeight,
                head_circum: casehistory.headCircum,
                breast_circum: casehistory.breastCircum,
                body_temperature: casehistory.bodyTemperature,
                breathe: casehistory.breathe,
                blood_pressure: casehistory.bloodPressure,
				teeth: casehistory.teeth,
            }
		}else{
			this.info = {
				name: JSON.parse(sessionStorage.getItem('doctorBooking')).childName,
				age: JSON.parse(sessionStorage.getItem('doctorBooking')).age,
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
				prescription: prescription,
				advise: null,
				time: '',
				timeText: '',
				checkList: [],
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
			var doctorBookingCaseTemplet = JSON.parse(sessionStorage.getItem('doctorBookingCaseTemplet'));
			var childcontrast = JSON.parse(sessionStorage.getItem('childcontrast'));
			if(doctorBookingCaseTemplet != null){
            if(doctorBookingCaseTemplet.casekeys.length > 0){
                for(var i = 0; i < doctorBookingCaseTemplet.casekeys.length; i++){
                    this.info[doctorBookingCaseTemplet.casekeys[i].key] = '';
                    this.baseInfo[doctorBookingCaseTemplet.casekeys[i].key] = '';
                    if(doctorBookingCaseTemplet.casekeys[i].key=='mid_weight'){
						if(childcontrast.info){
                            this.info.mid_height = childcontrast.info.height;
                        }else{
                            this.info.mid_height = '';
                        }
                    }
                    if(doctorBookingCaseTemplet.casekeys[i].key=='mid_weight'){
						if(childcontrast.info){
                            this.info.mid_weight = childcontrast.info.weight;
                        }else{
                            this.info.mid_weight = '';
                        }
                    }
					if(doctorBookingCaseTemplet.casekeys[i].key=='face_neck'){
                            this.info.face_neck = '未见异常';
                    }
					if(doctorBookingCaseTemplet.casekeys[i].key=='heart_lung'){
                            this.info.heart_lung = '未见异常';
                    }
					if(doctorBookingCaseTemplet.casekeys[i].key=='abdomen'){
                            this.info.abdomen = '未见异常';
                    }
					if(doctorBookingCaseTemplet.casekeys[i].key=='limbs'){
                            this.info.limbs = '未见异常';
                    }
					if(doctorBookingCaseTemplet.casekeys[i].key=='nervous_system'){
                            this.info.nervous_system = '未见异常';
                    }
                }
            }
			}
			// 新增时，因为没有检查项目，所以需要请求
			//this.getBookingCheckList();
		}

		this.loadingShow = true;

		// 主诉模板
		this.cprtemplateList = [];
		this.cprtemplate = '';
		this.adminService.cprtemplate(this.url).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.template.length > 0){
					for(var i = 0; i < results.template.length; i++){
						results.template[i].string = JSON.stringify(results.template[i]);
					}
				}
				this.cprtemplateList = results.template;
				this.loadingShow = false;
			}
		});

		this.showExamination = false;

		this.btnCanEdit = false;
	}

	getBookingCheckList(){
		var urlOptions = this.url + '&booking_id=' + this.id + '&today=1';
		this.adminService.usercheckprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.info.checkList = results.list;
			}
		});
	}

    // 身高对比
    changeHeight() {
		if(!this.adminService.isFalse(this.info.height) && parseFloat(this.info.height) <= 0){
			this.toastTab('身高应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(this.info.mid_height) && parseFloat(this.info.mid_height) <= 0){
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
		if(!this.adminService.isFalse(this.info.weight) && parseFloat(this.info.weight) <= 0){
			this.toastTab('体重应大于0', 'error');
			return;
		}
		if(!this.adminService.isFalse(this.info.mid_weight) && parseFloat(this.info.mid_weight) <= 0){
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

	changeExamination() {
		this.showExamination = !this.showExamination;
	}

	// 日期
	changeDate(_value) {
		this.info.time = JSON.parse(_value).value;
	}

	validateNumber(type, info) {
		if(!this.adminService.isFalse(this.info[type]) && Number(this.info[type]) <= 0){
			this.toastTab(info + '应大于0', 'error');
			return false;
		}
		return true;
	}

	// 去修改药方
	updatePrescript() {
		if(sessionStorage.getItem('prescript') != ''){
			var prescript = JSON.parse(sessionStorage.getItem('prescript'));
			this.router.navigate(['./admin/doctorPrescript'], {queryParams: {id: this.id, doctorId: this.doctorId, prescriptId: prescript.id}});
		}
	}

	create() {
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
		if(!this.validateNumber('teeth', '出牙数')){
			this.btnCanEdit = false;
			return;
		}
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
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			child_id: this.childId,
			booking_id: this.id,
			weight: this.info.weight == '' ? '0' : this.info.weight,
			mid_weight: this.info.mid_weight == '' ? '0' : this.info.mid_weight,
			compare_weight: this.info.compare_weight,
			height: this.info.height == '' ? '0' : this.info.height,
			mid_height: this.info.mid_height == '' ? '0' : this.info.mid_height,
			compare_height: this.info.compare_height,
			head_circum: this.info.head_circum == '' ? '0' : this.info.head_circum,
			breast_circum: this.info.breast_circum == '' ? '0' : this.info.breast_circum,
			teeth: this.info.teeth == '' ? '0' : this.info.teeth,
			topic_comment: this.info.topic_comment,
			check_result: this.info.check_result,
			present_illness: this.info.present_illness,
			previous_history: this.info.previous_history,
			allergy: this.info.allergy,
			family_history: this.info.family_history,
			breed_history: this.info.breed_history,
			growth_history: this.info.growth_history,
			physical_check: this.info.physical_check,
			body_temperature: this.info.body_temperature == '' ? '0' : this.info.body_temperature,
			breathe: this.info.breathe == '' ? '0' : this.info.breathe,
			blood_pressure: this.info.blood_pressure == '' ? '0' : this.info.blood_pressure,
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
			time: this.info.time == '' ? this.adminService.getDayByDate(new Date()) : this.info.time,
		}

		if(this.editType == 'create'){
			this.adminService.casehistory('', params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('病历创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/docbooking/casehistory'], {queryParams: {id: this.id, doctorId: this.doctorId}});
					}, 2000);
				}
			});
		}else{
			this.adminService.casehistory('/' + JSON.parse(sessionStorage.getItem('casehistory')).id, params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('病历修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/docbooking/casehistory'], {queryParams: {id: this.id, doctorId: this.doctorId}});
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
