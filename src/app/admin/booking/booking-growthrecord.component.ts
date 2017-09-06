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
		height: string,
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
		review_date: string,
	};
	id: string;
	doctorId: string;
	childId: string;
	editType: string;

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
				height: growthrecord.height,
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
				prescription: prescription,
				blood_routine_examination: growthrecord.bloodRoutineExamination,
				blood_routine_examination_other: growthrecord.bloodRoutineExamination,
				routine_urine: growthrecord.routineUrine,
				routine_urine_other: growthrecord.routineUrine,
				bone_density: growthrecord.boneDensity,
				BALP: growthrecord.BALP,
				BALP_other: growthrecord.BALP,
				trace_element: growthrecord.traceElement,
				trace_element_other: growthrecord.traceElement,
				check_date: growthrecord.checkDate,
				review_date: growthrecord.reviewDate,
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
				height: '',
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
				prescription: prescription,
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
				review_date: '',
			}
		}
	}

	//redio切换
	changeRedio(_value, _key) {
		if(_key == 'blood_routine_examination_other'){
			this.info.blood_routine_examination = '';
			return;
		}
		if(_key == 'routine_urine_other'){
			this.info.routine_urine = '';
			return;
		}
		if(_key == 'BALP_other'){
			this.info.BALP = '';
			return;
		}
		if(_key == 'trace_element_other'){
			this.info.trace_element = '';
			return;
		}
		this.info[_key] = _value;
	}

	create(f) {
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
			height: f.value.height == '' ? null : f.value.height,
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
			check_date: f.value.check_date == '' ? null : f.value.check_date,
			review_date: f.value.review_date == '' ? null : f.value.review_date,
		}

		if(this.editType == 'create'){
			this.adminService.childgrowthrecord('', params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('成长记录创建成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
					}, 2000);
				}
			});
		}else{
			this.adminService.childgrowthrecord('/' + JSON.parse(sessionStorage.getItem('growthrecord')).id, params).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('成长记录修改成功', '');
					setTimeout(() => {
						this.router.navigate(['./admin/doctorBooking'], {queryParams: {id: this.id, doctorId: this.doctorId}});
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