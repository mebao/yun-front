import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NzMessageService }                from 'ng-zorro-antd';

import { AdminService }                    from '../../admin.service';

@Component({
    selector: 'docbooking-left',
    templateUrl: './docbooking-left.html',
    styleUrls: ['../../../../assets/css/ant-common.scss', './docbooking-left.scss']
})

export class DocbookingLeft{
    @Input() booking: any;
    @Input() doctorInfo: any;
    @Input() actualOperator: any;
    @Input() pageType: string;
	@Output() selectedOperator = new EventEmitter<string>();
    doctorList: any[];
    serviceList: any[];
    url: string;
	searchInfo: {
		doctor_id: string;
		service_id: string;
		bdate_less: Date,
		bdate_big: Date,
	};
    // 就诊记录
    _isSpinning: boolean;
	modalTab: boolean;
	hasHistoryData: boolean;
	historyList: any[];
	// 儿保记录
    selectedHistoryHealthRTab: string;
    historyHealthRList: any[];
	historyHealthR: any[];
	historyHealthRBookingFirst: any[];
	historyHealthRBookingLast: any[];
    // 展示图片
	modalImg: {
		url: string,
		showImg: number,
	}
    // 实际操作人
    adminList: any[];
    operator: string;

    constructor(
        private _message: NzMessageService,
        private adminService: AdminService,
    ) {

    }

    ngOnInit() {
        this.url = '?username=' + this.adminService.getUser().username
            + '&token=' + this.adminService.getUser().token
            + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.searchInfo = {
			doctor_id: '',
			service_id: '',
			bdate_less: new Date(),
			bdate_big: new Date(),
		}
        this._isSpinning = false;
		this.modalTab = false;
        this.hasHistoryData = false;
		this.historyList = [];

        this.selectedHistoryHealthRTab = '1';
		this.historyHealthRList = [];
		this.historyHealthR = [];
		this.historyHealthRBookingFirst = [];
		this.historyHealthRBookingLast = [];

        this.doctorList = [];
        this.serviceList = [];
		this.getDoctorList();
        this.getServiceList();

		this.modalImg = {
			url: '',
			showImg: 0,
		}
		this.operator = this.adminService.isFalse(this.actualOperator.name) ? '' : this.actualOperator.name;
		this.adminList = [];
        if(this.actualOperator.use){
			// 获取护士列表
			var adminlistUrl = this.url + '&role=3';
			this.adminService.adminlist(adminlistUrl).then((data) => {
				if(data.status == 'no'){
					this._message.error(data.errorMsg);
				}else{
					var results = JSON.parse(JSON.stringify(data.results));
					if(results.adminlist.length > 0){
						for(var i = 0; i < results.adminlist.length; i++){
							var admin = {
								key: JSON.stringify({
									id: results.adminlist[i].id,
									realName: results.adminlist[i].realName,
								}),
								value: results.adminlist[i].realName,
							}
							this.adminList.push(admin);
						}
					}
				}
			}).catch(() => {
				this._message.error('服务器错误');
			});
		}

        this.getHistoryHealthRList();
    }

	//医生列表
	getDoctorList(){
		var adminlistUrl = this.url + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.doctorList = results.adminlist;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
	}

	//科室列表
	getServiceList() {
		var urlOptions = this.url;
		this.adminService.servicelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.serviceList = results.servicelist;
			}
		}).catch(() => {
			this._message.error('服务器错误');
		});
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

	getHistoryHealthRList() {
		var urlOptions = this.url + '&child_id=' + this.booking.childId + '&latestEarliest=1';
		this.adminService.searchhealthrecord(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
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
			this._message.error('服务器错误');
		});
	}

	//查询
	showHistory() {
		//列表
		var urlOptionsList = this.url + '&child_id=' + this.booking.childId + '&statuslist=1,2,3,4,5,11';
		if(this.searchInfo.doctor_id && this.searchInfo.doctor_id != ''){
			urlOptionsList += '&doctor_id=' + this.searchInfo.doctor_id;
		}
		if(this.searchInfo.service_id && this.searchInfo.service_id != ''){
			urlOptionsList += '&service_id=' + this.searchInfo.service_id;
		}
		if(this.searchInfo.bdate_less){
			urlOptionsList += '&bdate_less=' + this.adminService.getDayByDate(new Date(this.searchInfo.bdate_less));
		}
		if(this.searchInfo.bdate_big){
			urlOptionsList += '&bdate_big=' + this.adminService.getDayByDate(new Date(this.searchInfo.bdate_big));
		}
		this.searhShowHistory(urlOptionsList);
	}

    _disabledStartDate = (startValue) => {
        if (!startValue || !this.searchInfo.bdate_big) {
            return false;
        }
        return startValue.getTime() > this.searchInfo.bdate_big.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this.searchInfo.bdate_less) {
            return false;
        }
        return endValue.getTime() < this.searchInfo.bdate_less.getTime();
    };

	// 搜索历史记录
	searhShowHistory(urlOptions) {
		this.modalTab = true;
        this._isSpinning = true;
		this.adminService.searchbooking(urlOptions).then((data) => {
			if(data.status == 'no'){
                this._isSpinning = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.historyList = results.weekbooks;
				this.hasHistoryData = true;
                this._isSpinning = false;
			}
		}).catch(() => {
            this._isSpinning = false;
			this._message.error('服务器错误');
		});
	}

	close() {
		this.modalTab = false;
	}

	showFile(file) {
		if(file.mimeType == 'image'){
			this.modalImg.url = file.fileUrl;
			this.modalImg.showImg = 1;
		}else{
			window.open(file.fileUrl);
		}
	}

	closeImg() {
		this.modalImg.showImg = 0;
	}

	// 选择实际操作人
	selectOperator() {
		this.selectedOperator.emit(this.operator);
		sessionStorage.setItem('actualOperator', this.operator);
	}

	goHistory(history) {
		window.open('./admin/docbooking?id=' + history.bookingId + '&doctorId=' + history.services[0].userDoctorId + '&pageType=history');
	}
}
