import { Component, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }             from '@angular/router';

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
	canEdit: boolean;
	// pageType 空为医生接诊, history为查看
	pageType: string;
	// 就诊记录
	historyHealthRList: any[];
	historyHealthR: any[];
	selectedHistoryHealthRTab: string;
	historyList: any[];
	hasHistoryData: boolean;
	modalTab: boolean;

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
	searchInfo: {
		doctor_id: string;
		service_id: string;
		bdate_less: string,
		bdate_less_num: number,
		bdate_less_text: string,
		bdate_big: string,
		bdate_big_num: number,
		bdate_big_text: string,
	};
	doctorlist: any[];
	servicelist: [{}];
	// 宝宝成长曲线
	heightGrowth: any;
	weightGrowth: any;

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
			back_url: './admin/bookingReceive',
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			bdate_less: '',
			bdate_less_num: 0,
			bdate_less_text: '',
			bdate_big: '',
			bdate_big_num: 0,
			bdate_big_text: '',
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
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.adminlist.length > 0){
					this.doctorInfo = results.adminlist[0];
				}
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});

		this.historyList = [];
		this.hasHistoryData = false;
		this.modalTab = false;

		this.historyHealthRList = [];
		this.historyHealthR = [];
		this.selectedHistoryHealthRTab = '1';

        this.route.queryParams.subscribe((params) => {
            this.id = params.id;
            this.doctorId = params.doctorId;
            //this.editType = params.type;
        });

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
		this.getDoctorList();
		this.getServiceList();
	}

	initEdit(){
		var doctorBooking = JSON.parse(sessionStorage.getItem('doctorBooking'));
		if(doctorBooking == null){
			return;
		}
	}

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&clinic_id='
			 + this.adminService.getUser().clinicId + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
				this.doctorlist.unshift({id: '', realName: '请选择医生'});
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.servicelist = results.servicelist;
				this.servicelist.unshift({fee: '', id: '', serviceId: '', serviceName: '请选择科室'});
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	getHistoryHealthRList() {
		var urlOptions = this.url + '&child_id=' + this.booking.childId + '&latestEarliest=1';
		this.adminService.searchhealthrecord(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].bookingDate = this.adminService.dateFormat(results.list[i].bookingDate);
					}
					this.historyHealthR.push(results.list[0]);
				}
				this.historyHealthRList = results.list;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	// 搜索历史记录
	searhShowHistory(urlOptions) {
		this.modalTab = true;
		this.hasHistoryData = false;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.historyList = results.weekbooks;
				this.hasHistoryData = true;
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
		});
	}

	//查询
	showHistory() {
		//列表
		var urlOptionsList = this.url + '&child_id=' + this.booking.childId + '&statuslist=1,2,3,4,5,11';;
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptionsList += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptionsList += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.bdate_less && this.searchInfo.bdate_less != ''){
			urlOptionsList += '&bdate_less=' + this.searchInfo.bdate_less;
		}
		if(this.searchInfo.bdate_big && this.searchInfo.bdate_big != ''){
			urlOptionsList += '&bdate_big=' + this.searchInfo.bdate_big;
		}
		this.searhShowHistory(urlOptionsList);
	}

	// 选择日期
	changeDates(_value, key) {
		this.searchInfo[key] = JSON.parse(_value).value;
		this.searchInfo[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
		this.searchInfo[key + '_text'] = this.adminService.dateFormat(JSON.parse(_value).value);
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

					// 获取小孩儿保记录
					this.getHistoryHealthRList();
					// 获取宝宝成长曲线图
					this.getChildgrowthchart();
				}
			}
		}).catch(() => {
			this.toastTab('服务器错误', 'error');
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

	changeHistoryHealthRTab(_value) {
		this.historyHealthR = [];
		if(_value == '1'){
			if(this.historyHealthRList.length > 0){
				this.historyHealthR.push(this.historyHealthRList[0]);
			}
		}else{
			if(this.historyHealthRList.length > 0){
				this.historyHealthR.push(this.historyHealthRList[this.historyHealthRList.length - 1]);
			}
		}
		this.selectedHistoryHealthRTab = _value;
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

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	getChildgrowthchart() {
		var urlOptions = this.url + '&child_id=' + this.booking.childId;
		this.adminService.childgrowthchart(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
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
			this.toastTab('服务器错误', 'error');
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
