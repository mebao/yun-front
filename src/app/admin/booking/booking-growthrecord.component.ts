import { Component }                          from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-booking-growthrecord',
	templateUrl: './booking-growthrecord.component.html',
	styleUrls: ['./booking-growthrecord.component.scss'],
})
export class BookingGrowthrecordComponent{
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
		personal_history: string,
		feeding_way: string,
		feeding_volume: string,
		allergy: string,
		blood_pressure: string,
		weight: string,
		mid_weight: string,
		compare_weight: string,
		height: string,
		mid_height: string,
		compare_height: string,
		head_circum: string,
		breast_circum: string,
		teeth: string,
		fontanelle: string,
		mental_state: string,
		heart_lung: string,
		liver: string,
		spleen: string,
		torticollis_screening: string,
		hip_screening: string,
		genital: string,
		nervous_system: string,
		other: string,
		prescription: string,
		blood_routine_examination: string,
		blood_routine_examination_other: string,
		routine_urine: string,
		routine_urine_other: string,
		bone_density: string,
		BALP: string,
		BALP_other: string,
		trace_element: string,
		trace_element_other: string,
		check_date: string,
		check_date_text: string,
		review_date: string,
		review_date_text: string,
	};
	id: string;
	doctorId: string;
	childId: string;
	editType: string;
	// 药方信息
	prescription: string;
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '成长记录',
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

		// 获取药方

		this.prescription = '';

		if(sessionStorage.getItem('prescript') != ''){
			var prescript = JSON.parse(sessionStorage.getItem('prescript'));
			if(prescript.info.length > 0){
				for(var i = 0; i < prescript.info.length; i++){
					this.prescription += prescript.info[i].pname + prescript.info[i].batch + '批次: ' + prescript.info[i].frequency
						 + '，一次' + prescript.info[i].oneNum + prescript.info[i].oneUnit
						 + '，' + prescript.info[i].usage
						 + '，需服用' + prescript.info[i].days + '天'
						 + '，共开' + prescript.info[i].num + prescript.info[i].unit + '。\n';
				}
			}
		}
		// 药方获取最新信息
		this.initData();

		this.btnCanEdit = false;
	}

	initData() {
		if(this.editType == 'update'){
			var growthrecord = JSON.parse(sessionStorage.getItem('growthrecord'));
			this.info = {
				name: JSON.parse(sessionStorage.getItem('doctorBooking')).childName,
				age: JSON.parse(sessionStorage.getItem('doctorBooking')).age,
				personal_history: growthrecord.personalHistory,
				feeding_way: growthrecord.feedingWay,
				feeding_volume: growthrecord.feedingVolume,
				allergy: growthrecord.allergy,
				blood_pressure: growthrecord.bloodPressure,
				weight: growthrecord.weight,
				mid_weight: growthrecord.midWeight,
				compare_weight: growthrecord.compareWeight,
				height: growthrecord.height,
				mid_height: growthrecord.midHeight,
				compare_height: growthrecord.compareHeight,
				head_circum: growthrecord.headCircum,
				breast_circum: growthrecord.breastCircum,
				teeth: growthrecord.teeth,
				fontanelle: growthrecord.fontanelle,
				mental_state: growthrecord.mentalState,
				heart_lung: growthrecord.heartLung,
				liver: growthrecord.liver,
				spleen: growthrecord.spleen,
				torticollis_screening: growthrecord.torticollisScreening,
				hip_screening: growthrecord.hipScreening,
				genital: growthrecord.genital,
				nervous_system: growthrecord.nervous_system,
				other: growthrecord.other,
				prescription: this.prescription,
				blood_routine_examination: growthrecord.bloodRoutineExamination,
				blood_routine_examination_other: growthrecord.bloodRoutineExamination == '正常' || growthrecord.bloodRoutineExamination == '贫血' || growthrecord.bloodRoutineExamination == '白细胞高值' ? '' : growthrecord.bloodRoutineExamination,
				routine_urine: growthrecord.routineUrine,
				routine_urine_other: growthrecord.routineUrine == '正常' ? '' : growthrecord.routineUrine,
				bone_density: growthrecord.boneDensity,
				BALP: growthrecord.BALP,
				BALP_other: growthrecord.BALP == '正常' ? '' : growthrecord.BALP,
				trace_element: growthrecord.traceElement,
				trace_element_other: growthrecord.traceElement == '正常' ? '' : growthrecord.traceElement,
				check_date: growthrecord.checkDate ? this.adminService.dateFormatHasWord(growthrecord.checkDate) : growthrecord.checkDate,
				check_date_text: growthrecord.checkDate,
				review_date: growthrecord.reviewDate ? this.adminService.dateFormatHasWord(growthrecord.reviewDate) : growthrecord.reviewDate,
				review_date_text: growthrecord.reviewDate,
			}
		}else{
			this.info = {
				name: JSON.parse(sessionStorage.getItem('doctorBooking')).childName,
				age: JSON.parse(sessionStorage.getItem('doctorBooking')).age,
				personal_history: '',
				feeding_way: '',
				feeding_volume: '',
				allergy: '',
				blood_pressure: '',
				weight: '',
				mid_weight: '',
				compare_weight: '',
				height: '',
				mid_height: '',
				compare_height: '',
				head_circum: '',
				breast_circum: '',
				teeth: '',
				fontanelle: '',
				mental_state: '',
				heart_lung: '',
				liver: '',
				spleen: '',
				torticollis_screening: '',
				hip_screening: '',
				genital: '',
				nervous_system: '',
				other: '',
				prescription: this.prescription,
				blood_routine_examination: '',
				blood_routine_examination_other: '',
				routine_urine: '',
				routine_urine_other: '',
				bone_density: '',
				BALP: '',
				BALP_other: '',
				trace_element: '',
				trace_element_other: '',
				check_date: '',
				check_date_text: '',
				review_date: '',
				review_date_text: '',
			}
		}
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

	validateNumber(type, info) {
		if(!this.adminService.isFalse(this.info[type]) && Number(this.info[type]) <= 0){
			this.toastTab(info + '应大于0', 'error');
			return false;
		}
		return true;
	}

	// 选择日期
	changeDate(_value, key) {
		this.info[key] = JSON.parse(_value).value;
	}

	create(f) {
		this.btnCanEdit = true;
		this.info.personal_history = this.adminService.trim(this.info.personal_history);
		this.info.feeding_way = this.adminService.trim(this.info.feeding_way);
		this.info.allergy = this.adminService.trim(this.info.allergy);
		this.info.mental_state = this.adminService.trim(this.info.mental_state);
		this.info.heart_lung = this.adminService.trim(this.info.heart_lung);
		this.info.liver = this.adminService.trim(this.info.liver);
		this.info.spleen = this.adminService.trim(this.info.spleen);
		this.info.torticollis_screening = this.adminService.trim(this.info.torticollis_screening);
		this.info.hip_screening = this.adminService.trim(this.info.hip_screening);
		this.info.genital = this.adminService.trim(this.info.genital);
		this.info.nervous_system = this.adminService.trim(this.info.nervous_system);
		this.info.other = this.adminService.trim(this.info.other);
		this.info.blood_routine_examination = this.adminService.trim(this.info.blood_routine_examination);
		this.info.blood_routine_examination_other = this.adminService.trim(this.info.blood_routine_examination_other);
		this.info.routine_urine = this.adminService.trim(this.info.routine_urine);
		this.info.routine_urine_other = this.adminService.trim(this.info.routine_urine_other);
		this.info.bone_density = this.adminService.trim(this.info.bone_density);
		this.info.BALP = this.adminService.trim(this.info.BALP);
		this.info.BALP_other = this.adminService.trim(this.info.BALP_other);
		this.info.trace_element = this.adminService.trim(this.info.trace_element);
		this.info.trace_element_other = this.adminService.trim(this.info.trace_element_other);
		if(!this.validateNumber('feeding_volume', '奶量')){
			this.btnCanEdit = false;
			return;
		}
		if(!this.validateNumber('blood_pressure', '血压')){
			this.btnCanEdit = false;
			return;
		}
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
		if(!this.validateNumber('fontanelle', '卤门')){
			this.btnCanEdit = false;
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			child_id: this.childId,
			booking_id: this.id,
			personal_history: f.value.personal_history,
			feeding_way: this.info.feeding_way,
			feeding_volume: f.value.feeding_volume,
			allergy: f.value.allergy,
			blood_pressure: f.value.blood_pressure,
			weight: f.value.weight == '' ? null : f.value.weight,
			mid_weight: this.info.mid_weight == '' ? null : this.info.mid_weight,
			compare_weight: this.info.compare_weight,
			height: f.value.height == '' ? null : f.value.height,
			mid_height: this.info.mid_height == '' ? null : this.info.mid_height,
			compare_height: this.info.compare_height,
			head_circum: f.value.head_circum == '' ? null : f.value.head_circum,
			breast_circum: f.value.breast_circum == '' ? null : f.value.breast_circum,
			teeth: f.value.teeth,
			fontanelle: f.value.fontanelle == '' ? null : f.value.fontanelle,
			mental_state: f.value.mental_state,
			heart_lung: f.value.heart_lung,
			liver: f.value.liver,
			spleen: f.value.spleen,
			torticollis_screening: f.value.torticollis_screening,
			hip_screening: f.value.hip_screening,
			genital: f.value.genital,
			nervous_system: f.value.nervous_system,
			other: f.value.other,
			blood_routine_examination: this.info.blood_routine_examination == '' ? this.info.blood_routine_examination_other : this.info.blood_routine_examination,
			routine_urine: this.info.routine_urine == '' ? this.info.routine_urine_other : this.info.routine_urine,
			bone_density: this.info.bone_density,
			BALP: this.info.BALP == '' ? this.info.BALP_other : this.info.BALP,
			trace_element: this.info.trace_element == '' ? this.info.trace_element_other : this.info.trace_element,
			check_date: this.info.check_date == '' ? this.adminService.getDayByDate(new Date()) : this.info.check_date,
			review_date: this.info.review_date == '' ? null : this.info.review_date,
		}

		if(this.editType == 'create'){
			this.adminService.childgrowthrecord('', params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('成长记录创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBookingGrowthrecords'], {queryParams: {id: this.id, doctorId: this.doctorId}});
					}, 2000);
				}
			});
		}else{
			this.adminService.childgrowthrecord('/' + JSON.parse(sessionStorage.getItem('growthrecord')).id, params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
					this.btnCanEdit = false;
				}else{
					this.toastTab('成长记录修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBookingGrowthrecords'], {queryParams: {id: this.id, doctorId: this.doctorId}});
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
