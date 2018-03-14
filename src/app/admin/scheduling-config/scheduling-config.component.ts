import { Component, OnInit }                   from '@angular/core';
import { Router }                              from '@angular/router';
import { NgForm }                              from '@angular/forms';

import { AdminService }                        from '../admin.service';

@Component({
	selector: 'app-scheduling-config',
	templateUrl: './scheduling-config.component.html'
})
export class SchedulingConfigComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
	};
	dutytime: any[];
	dutylist: any[];
	config: {
		name: string,
		status: string,
	}
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	editType: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {
		this.dutytime = [
			{key: '08:00', value: '08:00'},
			{key: '08:30', value: '08:30'},
			{key: '09:00', value: '09:00'},
			{key: '09:30', value: '09:30'},
			{key: '10:00', value: '10:00'},
			{key: '10:30', value: '10:30'},
			{key: '11:00', value: '11:00'},
			{key: '11:30', value: '11:30'},
			{key: '12:00', value: '12:00'},
			{key: '12:30', value: '12:30'},
			{key: '13:00', value: '13:00'},
			{key: '13:30', value: '13:30'},
			{key: '14:00', value: '14:00'},
			{key: '14:30', value: '14:30'},
			{key: '15:00', value: '15:00'},
			{key: '15:30', value: '15:30'},
			{key: '16:00', value: '16:00'},
			{key: '16:30', value: '16:30'},
			{key: '17:00', value: '17:00'},
			{key: '17:30', value: '17:30'},
			{key: '18:00', value: '18:00'},
			{key: '18:30', value: '18:30'},
			{key: '19:00', value: '19:00'},
			{key: '19:30', value: '19:30'},
			{key: '20:00', value: '20:00'},
			{key: '20:30', value: '20:30'},
			{key: '21:00', value: '21:00'},
			{key: '21:30', value: '21:30'},
			{key: '22:00', value: '22:00'},
			{key: '22:30', value: '22:30'},
			{key: '23:00', value: '23:00'},
			{key: '23:30', value: '23:30'},
			{key: '00:00', value: '00:00'},
		];
		const duty = [{id: 1, use: true}];
		this.dutylist = duty;
	}

	ngOnInit(): void {
		this.topBar = {
			title: '排班配置',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.config = {
			name: '',
			status: '',
		}

		this.editType = 'create';
	}

	create(f: NgForm) {
		if(f.value.name == ''){
			this.toastTab('排班名不可为空', 'error');
			return;
		}
		var dutyDemo = [
			{key: 0, value: '08:00', use: true},
			{key: 1, value: '08:30', use: true},
			{key: 2, value: '09:00', use: true},
			{key: 3, value: '09:30', use: true},
			{key: 4, value: '10:00', use: true},
			{key: 5, value: '10:30', use: true},
			{key: 6, value: '11:00', use: true},
			{key: 7, value: '11:30', use: true},
			{key: 8, value: '12:00', use: true},
			{key: 9, value: '12:30', use: true},
			{key: 10, value: '13:00', use: true},
			{key: 11, value: '13:30', use: true},
			{key: 12, value: '14:00', use: true},
			{key: 13, value: '14:30', use: true},
			{key: 14, value: '15:00', use: true},
			{key: 15, value: '15:30', use: true},
			{key: 16, value: '16:00', use: true},
			{key: 17, value: '16:30', use: true},
			{key: 18, value: '17:00', use: true},
			{key: 19, value: '17:30', use: true},
			{key: 20, value: '18:00', use: true},
			{key: 21, value: '18:30', use: true},
			{key: 22, value: '19:00', use: true},
			{key: 23, value: '19:30', use: true},
			{key: 24, value: '20:00', use: true},
			{key: 25, value: '20:30', use: true},
			{key: 26, value: '21:00', use: true},
			{key: 27, value: '21:30', use: true},
			{key: 28, value: '22:00', use: true},
			{key: 29, value: '22:30', use: true},
			{key: 30, value: '23:00', use: true},
			{key: 31, value: '23:30', use: true},
			{key: 32, value: '00:00', use: true},
		]
		//构造时间段
		var dutylist = [];
		var dutyText = '';
		for(var i = 0; i < this.dutylist.length; i++){
			if(this.dutylist[i].use){
				//开始时间未选择
				if(f.value['duty'+i+'start'] == ''){
					this.toastTab('第' + (dutylist.length + 1) + '条排班时间，开始时间不可为空', 'error');
					return;
				}
				//结束时间未选择
				if(f.value['duty'+i+'end'] == ''){
					this.toastTab('第' + (dutylist.length + 1) + '条排班时间，结束时间不可为空', 'error');
					return;
				}
				if(Number(f.value['duty'+i+'end'].split(',')[1]) > Number(f.value['duty'+i+'start'].split(',')[1])){
					var duty = f.value['duty'+i+'start'].split(',')[0] + '-' + f.value['duty'+i+'end'].split(',')[0];
					dutylist.push(duty);
					dutyText += ' ' + duty;
				}else{
					//开始时间早于结束时间
					this.toastTab('第' + (dutylist.length + 1) + '条排班时间，开始时间应晚于结束时间', 'error');
					return;
				}
				//含有重叠时间段
				var start = Number(f.value['duty'+i+'start'].split(',')[1]);
				var end = Number(f.value['duty'+i+'end'].split(',')[1]);
				for(var j = start; j < end; j++){
					var hasBoolean = false;
					for(var k = 0; k < dutyDemo.length; k++){
						if(dutyDemo[k].use && dutyDemo[k].key == j){
							//所选时间，在已有时间中
							hasBoolean = true;
							dutyDemo[k].use = false;
						}
					}
					if(!hasBoolean){
						this.toastTab('时间段存在时间重合，请选择合理的时间段', 'error');
						return;
					}
				}
			}
		}
		if(this.editType != 'create' && f.value.status == ''){
			this.toastTab('状态不可为空', 'error');
			return;
		}
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			name: f.value.name,
			dutylist: dutylist,
			status: this.editType != 'create' ? f.value.status : '1',
			clinic_id: this.adminService.getUser().clinicId,
		}
		this.adminService.schedulingConfig(param).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('创建成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/schedulingConfigList']);
				}, 2000);
			}
		})
	}

	addDuty(index): void {
		const _index = index + 2;
		this.dutylist.push({id: _index, use: true});
	}

	delDuty(id): void{
		for(var i = 0; i < this.dutylist.length; i++){
			if(this.dutylist[i].id == id){
				this.dutylist[i].use = false;
			}
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
