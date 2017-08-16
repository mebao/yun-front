import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-doctor-prescript',
	templateUrl: './doctor-prescript.component.html',
	styleUrls: ['./doctor-prescript.component.scss'],
})
export class DoctorPrescriptComponent{
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	url: string;
	id: string;
	canEdit: boolean;
	bookingInfo: {
		age: string,
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
	};
	plist: any[];
	medicalSupplies: any[];

	constructor(
		public adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.bookingInfo = {
			age: '',
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
		};

		this.plist = [];
		this.plist.push({key: 1, show: true, use: true});

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;

		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if((new Date().getTime() - 24*60*60*1000) > new Date(results.weekbooks[0].bookingDate).getTime()){
					this.canEdit = false;
				}else{
					this.canEdit = true;
				}
				this.bookingInfo = results.weekbooks[0];
			}
		})

		//查看库存
		var searchsuppliesUrl = this.url;
		this.adminService.searchsupplies(searchsuppliesUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].string = JSON.stringify(results.list[i]);
					}
				}
				this.medicalSupplies = results.list;
			}
		})
	}

	showMs(_key) {
		if(this.plist.length > 0){
			for(var i = 0; i < this.plist.length; i++){
				if(this.plist[i].key == _key){
					this.plist[i].show = !this.plist[i].show;
				}
			}
		}
	}

	addMs() {
		this.plist.push({key: this.plist.length + 1, show: true, use: true});
	}

	deleteMs(_key) {
		if(this.plist.length > 0){
			for(var i = 0; i < this.plist.length; i++){
				if(this.plist[i].key == _key){
					this.plist[i].use = false;
				}
			}
		}
	}

	create(f) {
		var plist = [];
		var num = 0;
		var feeAll = 0;
		if(this.plist.length > 0){
			for(var i = 0; i < this.plist.length; i++){
				//判断可用
				if(this.plist[i].use){
					num++;
					var p = {
						sinfo_id: '',
						name: '',
						unit: '',
						num: '',
					};
					if(f.value['ms_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条药单不可为空', 'error');
						return;
					}
					p.sinfo_id = JSON.parse(f.value['ms_' + this.plist[i].key]).id;
					p.name = JSON.parse(f.value['ms_' + this.plist[i].key]).name;
					p.unit = JSON.parse(f.value['ms_' + this.plist[i].key]).unit;
					if(f.value['num_' + this.plist[i].key] == ''){
						this.toastTab('第' + num + '条药单数量不可为空', 'error');
						return;
					}
					p.num = f.value['num_' + this.plist[i].key];
					plist.push(p);
					feeAll += Number(JSON.parse(f.value['ms_' + this.plist[i].key]).price) * Number(p.num); 
				}
			}
		}

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			booking_id: this.bookingInfo.bookingId,
			doctor_id: this.bookingInfo.services[0].userDoctorId,
			doctor_name: this.bookingInfo.services[0].userDoctorName,
			user_id: this.bookingInfo.creatorId,
			user_name: this.bookingInfo.creatorName,
			child_id: this.bookingInfo.childId,
			child_name: this.bookingInfo.childName,
			name: f.value.name,
			plist: JSON.stringify(plist),
			remark: f.value.remark,
			fee: feeAll,
		}

		this.adminService.doctorprescript(params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('开方成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/bookingInfo'], {queryParams: {id: this.id}});
				}, 2000);
			}
		})
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