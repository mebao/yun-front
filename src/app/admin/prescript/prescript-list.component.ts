import { Component, OnInit, ViewChild, ElementRef }  from '@angular/core';
import { Router }                                    from '@angular/router';

import { NzMessageService }                          from 'ng-zorro-antd';
import { ENgxPrintComponent }                        from 'e-ngx-print';

import { AdminService }                              from '../admin.service';

@Component({
	selector: 'app-prescript-list',
	templateUrl: './prescript-list.component.html',
	styleUrls: ['./prescript-list.component.scss', '../../../assets/css/ant-common.scss'],
})
export class PrescriptListComponent{
	@ViewChild('print1') printComponent1: ENgxPrintComponent;
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
		seeBack: boolean,
		seeSale: boolean,
		seeTcm: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	hasPrintData: boolean;
	list: any[];
	printList: any[];
	modalList: any[];
	modalConfirmTab: boolean;
	modalPrintConfirmTab: boolean;
	select: {
		id: string,
		text: string,
	}
	url: string;
	searchUrl: string;
	searchInfo: {
		isout: string,
		today: string,
		doctor_name: string,
		user_name: string,
		child_name: string,
	};
	_startDate = null;
	_endDate = null;
	printStyle:string;
	allChecked: boolean;
	indeterminate: boolean;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
		private elRef: ElementRef,
	) {
    this.printStyle =
        `
		body{
			margin:0px;
			font-size:14px;
			font-family:"黑体";
		}
		.main-container{
            height:264px;
            width:400px;
			line-height: 2em;
			transform:scale(1,1);
			page-break-before: always;
        }
        .flex{
            display: flex;
        }
        .flex-1{
            flex : 1;
        }
        .bold{
            font-weight: bold;
        }
        .img{
            height:20px;
            /*width:84px;*/
			margin-top: 2px;
        }
		.img-code{
			height:90px;
			margin-right:4px;
		}
		.main-content{
			padding:4px 0;
			border-top: 1px solid #333;
			border-bottom: 1px solid #333;
			min-height:94px;
		}
		.header{
			padding:4px 10px 4px 20px;
		}
		.font-big{
			font-size: 22px;
			font-weight: bold;
		}
		.font-mid{
			font-size: 22px;
			font-weight: bold;
		}
		.mt10{
			margin-top:5px;
		}
		.footer{
			background:#000;
			padding:0px 20px 0 20px;
		}
		.footer .tel{
			font-size:18px;
			font-weight:bold;
		}
		.color-white{
			color:#fff;
		}
		.head{
			padding:0 0 4px;
			min-height:62px;
		}
		.content{
			width:100%;
			height:100%;
		}
		.main-content-footer{
			min-height:63px;
		}
		.max210{
			max-width:210px;
		}
		.logo-text{
			font-family:'黑体';
			color:#fff;
			font-size:18px;
			font-weight:bold;
		}
        `;
}

	ngOnInit() {
		this.topBar = {
			title: '药方列表',
			back: false,
		}

		this.moduleAuthority = {
			see: false,
			edit: false,
			seeBack: false,
			seeSale: false,
			seeTcm: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.loadingShow = false;

		this.hasData = false;
		this.hasPrintData = false;

		this.list = [];
		this.printList = [];
		this.modalList = [];
		this.modalConfirmTab = false;
		this.modalPrintConfirmTab = false;
		this.select = {
			id: '',
			text: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&isout=1';

 		this.searchInfo = {
 			isout: '1',
 			today: '',
 			doctor_name: '',
 			user_name: '',
 			child_name: '',
 		}
        this._startDate = new Date();
        this._endDate = new Date();

		this.search();
		this.allChecked = true;
  		this.indeterminate = false;
	}

	printComplete() {

	}

	getData(urlOptions) {
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var prescriptList = [];
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						if(this.searchInfo.isout == '1' || this.searchInfo.isout == null || (this.searchInfo.isout == '' && results.list[i].outCode != 0)){
							results.list[i].infoLength = results.list[i].info.length;
							if(results.list[i].info.length > 0){
								for(var j = 0; j < results.list[i].info.length; j++){
									results.list[i].info[j].expiringDate = this.adminService.dateFormat(results.list[i].info[j].expiringDate);
									results.list[i].info[j].msExplain = '单次：' + results.list[i].info[j].oneNum + results.list[i].info[j].oneUnit + '，' + results.list[i].info[j].frequency + '，' + results.list[i].info[j].usage + '，共' + results.list[i].info[j].days + '天' + (results.list[i].info[j].remark != '' ? '，' + results.list[i].info[j].remark : '');
									results.list[i].info[j].msExplainPrint = '一次' + results.list[i].info[j].oneNum + results.list[i].info[j].oneUnit + '，' + results.list[i].info[j].usage + '，共' + results.list[i].info[j].days + '天';
									results.list[i].info[j].isCheck = true;
									results.list[i].info[j].printNum = results.list[i].info[j].num;
								}
							}
							prescriptList.push(results.list[i]);
						}
					}
				}
				this.list = prescriptList;
				this.hasData = true;
				this.hasPrintData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	search() {
		this.loadingShow = true;
		var urlOptions = this.url;
		// if(this.searchInfo.isout != ''){
		// 	urlOptions += ('&isout=' + this.searchInfo.isout);
		// }
		if(this.searchInfo.today != ''){
			urlOptions += ('&today=' + this.searchInfo.today);
		}
        if(this._startDate){
            urlOptions += '&b_time=' + this.adminService.getDayByDate(new Date(this._startDate));
        }
        if(this._endDate){
            urlOptions += '&l_time=' + this.adminService.getDayByDate(new Date(this._endDate));
        }
		if(this.searchInfo.doctor_name != ''){
			urlOptions += ('&doctor_name=' + this.searchInfo.doctor_name);
		}
		if(this.searchInfo.user_name != ''){
			urlOptions += ('&user_name=' + this.searchInfo.user_name);
		}
		if(this.searchInfo.child_name != ''){
			urlOptions += ('&child_name=' + this.searchInfo.child_name);
		}
		this.searchUrl = urlOptions;
		this.getData(urlOptions);
	}

    _disabledStartDate = (startValue) => {
        if (!startValue || !this._endDate) {
            return false;
        }
        return startValue.getTime() > this._endDate.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this._startDate) {
            return false;
        }
        return endValue.getTime() < this._startDate.getTime();
    };

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	selectPrescript(_id) {
		this.select.id = _id;
		this.select.text = '确认药品出库';
		this.modalConfirmTab = true;
	}

	closePrintConfirm() {
		this.modalPrintConfirmTab = false;
	}

	selectPrint(){
		this.modalList = JSON.parse(JSON.stringify(this.list));
		var pList = [];
		if(this.modalList.length > 0){
			for(var i = 0; i < this.modalList.length; i++){
				var priscript = {};
				priscript = JSON.parse(JSON.stringify(this.modalList[i]));
				priscript['info'] = [];
				if(this.modalList[i].info.length > 0){
					for(var j = 0; j < this.modalList[i].info.length; j++){
						if(this.modalList[i].info[j].isOut != '0'){
							priscript['info'].push(this.modalList[i].info[j]);
						}
					}
				}
				if(priscript['info'].length>0){
					pList.push(priscript);
				}
			}
		}
		this.modalList = pList;
		this.modalPrintConfirmTab = true;
	}

	customPrint(){
		this.printList = JSON.parse(JSON.stringify(this.modalList));
		var pList = [];
		if(this.printList.length > 0){
			for(var i = 0; i < this.printList.length; i++){
				var print = {};
				print = JSON.parse(JSON.stringify(this.printList[i]));
				print['info'] = [];
				if(this.printList[i].info.length > 0){
					for(var j = 0; j < this.printList[i].info.length; j++){
						if(this.printList[i].info[j].isCheck){
							print['info'].push(this.printList[i].info[j]);
						}
					}
				}
				if(print['info'].length>0){
					pList.push(print);
				}
			}
		}
		this.printList = pList;
        this.printComponent1.print();
	}

	selectChange(pid,event){
		var checkAll = true;
		var unCheckAll = true;
		this.modalList.forEach(function(info){
			if(info.info){
			   info.info.forEach(function(item){
				   if(item.isCheck === false){
					   checkAll = false;
				   }
				   if(item.isCheck === true){
					   unCheckAll = false;
				   }
			   });
			}
		});
		if(checkAll){
			this.allChecked = true;
			this.indeterminate = false;
		}else{
			this.indeterminate = true;
		}
		if(unCheckAll){
			this.allChecked = false;
			this.indeterminate = false;
		}else{
			this.indeterminate = true;
		}
		// if (this.modalList.every(item => item.checked === false)) {
		// 	this.allChecked = false;
		// 	this.indeterminate = false;
		// } else if (this.modalList.every(item => item.checked === true)) {
		// 	this.allChecked = true;
		// 	this.indeterminate = false;
		// } else {
		// 	this.indeterminate = true;
		// }
	}

	updateAllChecked() {
		this.indeterminate = false;
		if (this.allChecked) {
		  this.modalList.forEach(function(info){
			  if(info.info){
				 info.info.forEach(function(item){
					 item.isCheck = true;
				 });
			  }
		  });
		} else {
			this.modalList.forEach(function(info){
			  if(info.info){
				 info.info.forEach(function(item){
					 item.isCheck = false;
				 });
			  }
		  });
		}
	}

	confirm() {
		this.modalConfirmTab = false;

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
		}

		this.adminService.outmedicine(this.select.id, params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this._message.success('药品出库成功');
				this.getData(this.searchUrl);
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	range(num){
		return new Array(parseInt(num));
	}
}
