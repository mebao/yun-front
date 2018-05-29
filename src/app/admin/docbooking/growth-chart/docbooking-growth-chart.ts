import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../../admin.service';
import { DoctorService }                      from '../../doctor/doctor.service';

import { UploadService }                      from '../../../common/nll-upload/upload.service';

@Component({
	selector: 'admin-docbooking-growth-chart',
	templateUrl: './docbooking-growth-chart.html',
	styleUrls: ['../casehistory/docbooking-casehistory.component.scss'],
})
export class DocbookingGrowthChart implements OnInit{
	topBar: {
		title: string,
		back: boolean,
		back_url: string,
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
	hasBookingData: boolean;
	canEdit: boolean;
	// pageType 空为医生接诊, history为查看
	pageType: string;
	healthrecord_id: string;
	modalConfirmTab: boolean;
	// 实际操作人
	actualOperator: {
		use: boolean,
		name: string,
	}
	operator: string;
	// 宝宝成长曲线
	heightGrowth: any;
	weightGrowth: any;

	constructor(
		private _message: NzMessageService,
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
			back_url: './admin/bookingReceive',
		}
		this.loadingShow = true;

		this.id = '';
		this.doctorId = '';

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
		this.hasBookingData = false;

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
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					this.doctorInfo = results.adminlist[0];
				}
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.doctorId = params.doctorId;
            //this.editType = params.type;
        });

		// 若是登录账号为'嘉宝体检'，则需要选定操作人
		this.actualOperator = {
			use: this.adminService.getUser().realname == '嘉宝体检',
			name: sessionStorage.getItem('actualOperator'),
		}
		this.operator = this.adminService.isFalse(this.actualOperator.name) ? '' : this.actualOperator.name;

		this.healthrecord_id = '';
		this.modalConfirmTab = false;
	}

	// 选择实际操作人
	selectOperator(_value) {
		this.operator = _value;
	}

	initEdit(){
		var doctorBooking = JSON.parse(sessionStorage.getItem('doctorBooking'));
		if(doctorBooking == null){
			return;
		}
	}

	getBookingData() {
		//获取预约信息
		var urlOptions = this.url + '&id=' + this.id;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
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
					this.hasBookingData = true;
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

					// 获取宝宝成长曲线图
					this.getChildgrowthchart();
				}
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	changeTab(_value, url) {
		sessionStorage.setItem('doctorBookingTab', _value);
		// pageType 空为医生接诊， history为查看
		if(this.pageType == 'history'){
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId, pageType: this.pageType}});
		}else{
			this.loadingShow = true;
			this.router.navigate(['./admin/' + url], {queryParams: {id: this.id, doctorId: this.doctorId}});
		}
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	getChildgrowthchart() {
		var urlOptions = this.url + '&child_id=' + this.booking.childId;
		this.adminService.childgrowthchart(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				var heightDataList = [];
				var heightNinetySevenDataList = [];
				var heightEightyFiveDataList = [];
				var heightFiftyDataList = [];
				var heightFifteenDataList = [];
				var heightThreeDataList = [];
				var heightActualDataList = [];
				if(results.height.length > 0){
					for(var i = 0; i < results.height.length; i++){
						heightDataList.push(results.height[i].age);
						heightNinetySevenDataList.push(results.height[i].ninetySeven);
						heightEightyFiveDataList.push(results.height[i].eightyFive);
						heightFiftyDataList.push(results.height[i].fifty);
						heightFifteenDataList.push(results.height[i].fifteen);
						heightThreeDataList.push(results.height[i].three);
						heightActualDataList.push(results.height[i].childHeight);
					}
				}
				var weightDataList = [];
				var weightNinetySevenDataList = [];
				var weightEightyFiveDataList = [];
				var weightFiftyDataList = [];
				var weightFifteenDataList = [];
				var weightThreeDataList = [];
				var weightActualDataList = [];
				if(results.weight.length > 0){
					for(var i = 0; i < results.weight.length; i++){
						weightDataList.push(results.weight[i].age);
						weightNinetySevenDataList.push(results.weight[i].ninetySeven);
						weightEightyFiveDataList.push(results.weight[i].eightyFive);
						weightFiftyDataList.push(results.weight[i].fifty);
						weightFifteenDataList.push(results.weight[i].fifteen);
						weightThreeDataList.push(results.weight[i].three);
						weightActualDataList.push(results.weight[i].childWeight);
					}
				}

				this.heightGrowth = {
					title: {
						text: '宝宝身高成长曲线',
					},
				    color: ['red', 'green', '#66FFFF', 'blue','#FF7F50','black'],

				    tooltip: {
				        trigger: 'axis',
				    },
				    legend: {
				        data:['97th', '85th', '50th', '15th', '3rd', '宝宝身高']
				    },
				    grid: {
				        top: 70,
				        bottom: 50
				    },
				    xAxis:{
			            type: 'category',
			            boundaryGap: true,
			            data: heightDataList
			        },
				    yAxis: [
				        {
							name: '身高(cm)',
				            type: 'value'
				        }
				    ],
				    series: [
				        {
				            name:'97th',
				            type:'line',
				            smooth: true,
				            data: heightNinetySevenDataList
				        },
						{
				            name:'85th',
				            type:'line',
				            smooth: true,
				            data: heightEightyFiveDataList
				        },
						{
				            name:'50th',
				            type:'line',
				            smooth: true,
				            data: heightFiftyDataList
				        },
						{
				            name:'15th',
				            type:'line',
				            smooth: true,
				            data: heightFifteenDataList
				        },
						{
				            name:'3rd',
				            type:'line',
				            smooth: true,
				            data: heightThreeDataList
				        },
				        {
				            name:'宝宝身高',
				            type:'line',
				            smooth: true,
				            data: heightActualDataList
				        }
				    ]
				};

				this.weightGrowth = {
					title: {
						text: '宝宝体重成长曲线',
					},
				    color: ['red', 'green', '#66FFFF', 'blue','#FF7F50','black'],

				    tooltip: {
				        trigger: 'axis',
				    },
				    legend: {
				        data:['97th', '85th', '50th', '15th', '3rd', '宝宝体重']
				    },
				    grid: {
				        top: 70,
				        bottom: 50
				    },
				    xAxis:{
			            type: 'category',
			            boundaryGap: true,
			            data: weightDataList
				    },
				    yAxis: [
				        {
							name: '体重(kg)',
				            type: 'value'
				        }
				    ],
				    series: [
						{
				            name:'97th',
				            type:'line',
				            smooth: true,
				            data: weightNinetySevenDataList
				        },
						{
				            name:'85th',
				            type:'line',
				            smooth: true,
				            data: weightEightyFiveDataList
				        },
						{
				            name:'50th',
				            type:'line',
				            smooth: true,
				            data: weightFiftyDataList
				        },
						{
				            name:'15th',
				            type:'line',
				            smooth: true,
				            data: weightFifteenDataList
				        },
						{
				            name:'3rd',
				            type:'line',
				            smooth: true,
				            data: weightThreeDataList
				        },
				        {
				            name:'宝宝体重',
				            type:'line',
				            smooth: true,
				            data: weightActualDataList
				        }
				    ]
				};
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}
}
