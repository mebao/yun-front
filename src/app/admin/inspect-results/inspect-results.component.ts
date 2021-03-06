import { Component, OnInit }                 from '@angular/core';
import { Router, ActivatedRoute }            from '@angular/router';
import { Observable }                        from 'rxjs';

import { NzMessageService }                  from 'ng-zorro-antd';

import { DialogService }                     from '../dialog.service';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-inspect-resutls',
	templateUrl: './inspect-results.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class InspectResultsComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	loadingShow: boolean;
	// modal-img
	modalImg: {
		url: string,
		showImg: number,
	}
	id: string;
	checkProjectList: any[];
	checkProjectListOld: any;
	// 默认选择模块
	selectTab: string;
	bookingInfo: {
		imageUrl: string,
		childName: string,
		userName: string,
		doctorName: string,
		time: string,
	};
	buttonType: string;
	// 上传图片token
	token: string;
	// 不可连续点击
	btnCanEdit: boolean;
	firstClick: boolean;
	intervalObj: any;
	printCSS: any;
	printStyle: any;

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private route: ActivatedRoute,
		private router: Router,
		private dialogService: DialogService,
	) {
		this.printCSS = ['../../../../assets/css/pure.min.css','../../../../assets/css/_flex.scss'];
		this.printStyle =
		`
		.container{
			width:100%;
		}
		table{
			width:100%;
			font-size:14px!important;
		}
		table th{
			font-weight:bold;
		}
		.title{
			font-size: 24px;
		}
		img{
			height: 100px;
		}
		.text-center{
			text-align:center;
		}
		.mb10{
			margin-bottom:10px;
		}
		.mr10{
			margin-right:10px;
		}
		.w10{
			width:10%!important;
		}
		.w20{
			width:20%!important;
		}
		.w30{
			width:30%!important;
		}
		.mt10{
			margin-top:10px;
		}
		`;
	}

	ngOnInit() {
		this.topBar = {
			title: '检查',
			back: true,
		};
		// modal-img
		this.modalImg = {
			url: '',
			showImg: 0,
		}
		this.checkProjectList = [];
		this.selectTab = '';
		this.bookingInfo = {
			imageUrl: '',
			childName: '',
			userName: '',
			doctorName: '',
			time: '',
		}
		this.buttonType = 'update';

		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
		});

		this.loadingShow = true;

		// 获取上传图片权限
		this.token = '';
		//获取头像上传token
		var tokenUrl  = '?type=static';
		this.adminService.qiniutoken(tokenUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this.token = JSON.parse(JSON.stringify(data)).uptoken;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });

		this.getData('');

		this.btnCanEdit = false;
		this.firstClick = false;
		sessionStorage.setItem('canDeactivate', 'inspectResults');
	}

	canDeactivate(): Observable<boolean> | boolean {

    	// Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
		if(this.checkProjectListOld.length>0){
			for(var i=0;i<this.checkProjectListOld.length;i++){
				if(this.checkProjectListOld[i].id == this.selectTab){
					if (JSON.stringify(this.checkProjectList[i]) == JSON.stringify(this.checkProjectListOld[i])) {
						return true;
					}
				}
			}
		}

    	// Otherwise ask the user with the dialog service and return its
    	// observable which resolves to true or false when the user decides
    	if(sessionStorage.getItem('canDeactivate') == 'inspectResults_canDeactivate'){
			return true;
		}else{
    		return this.dialogService.confirm('数据尚未保存，是否离开?');
		}
  	}


	getData(_selectTab) {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&booking_id=' + this.id
			 + '&today=1';

		this.adminService.usercheckprojectinfo(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					this.bookingInfo = {
						imageUrl: results.list[0].imageUrl,
						childName: results.list[0].childName,
						userName: results.list[0].userName,
						doctorName: results.list[0].doctorName,
						time: results.list[0].time,
					}
					for(var i = 0; i < results.list.length; i++){
						results.list[i].resultListNum = results.list[i].resultList.length;
						if(results.list[i].resultList.length > 0){
							var hasValues = false;
							// 创建时，用于判断是否存在移除项
							results.list[i].hasRemoveResult = false;
							for(var j = 0; j < results.list[i].resultList.length; j++){
								if(results.list[i].resultList[j].values == null){
									results.list[i].resultList[j].values = '';
								}
								if(results.list[i].resultList[j].compare == null){
									results.list[i].resultList[j].compare = '';
								}
								// 新建时，可以通过移除、添加相关选项
								results.list[i].resultList[j].use = true;
								if(results.list[i].resultList[0].values && results.list[i].resultList[0].values != ''){
									hasValues = true;
								}
								// 用于判断上传为图片，还是pdf文件
								results.list[i].resultList[j].isImg = true;
								if(results.list[i].resultList[j].values && results.list[i].resultList[j].values.indexOf('pdf') != -1){
									results.list[i].resultList[j].isImg = false;
								}
							}
							if(hasValues){
								results.list[i].editType = 'update';
								if(!this.adminService.isFalse(results.list[i].remark)){
									results.list[i].remark = results.list[i].remark.replace(/;/g, '\n');
								}
							}else{
								results.list[i].editType = 'create';
								// 创建时，如果检查项目是
								if(results.list[i].checkName == '过敏源点刺检测 （粉尘螨）'){
									results.list[i].remark = '皮肤指数（SI)=粉尘螨过敏原面积/阳性组胺面积\n'
										+ '阳性\n'
										+ '一级：“＋”=0.25＜SI＜0.5\n'
										+ '二级：“＋＋”=0.5≤SI＜1.0\n'
										+ '三级：“＋＋＋”=1.0≤SI＜2.0\n'
										+ '四级：“＋＋＋＋”=2.0≤SI';
								}
							}
						}

						// 获取最新检查结果
						if(_selectTab != '' && _selectTab == results.list[i].id){
							this.buttonType = 'update';
							this.changeTab(results.list[i],'isNew');
						}
					}
					if(_selectTab == ''){
						this.buttonType = 'update';
						this.changeTab(results.list[0],'');
					}
				}
				this.checkProjectList = results.list;
				this.loadingShow = false;
				this.checkProjectListOld = JSON.parse(JSON.stringify(this.checkProjectList));
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	selectedFile(_file, checkId) {
		var fff = [];
    	var fileJson = _file.target['files'];
    	for(var index in fileJson){
    		if(fileJson[index]['name'] && fileJson[index]['size']){
	    		var file = fileJson[index];
		        var formData = new FormData();
		        formData.append('file', file);
		        formData.append('name', file.name);
		        formData.append('type', file.type);
		        formData.append('lastModifiedDate', file.lastModifiedDate);
		        formData.append('size', file.size);
		        formData.append('token', this.token);// the qiniu upload accessKey.
		        formData.append('key', (new Date()).getTime() + Math.floor(Math.random() * 100)+'.'+file.name.substr(file.name.lastIndexOf('.')+1));

		        var reader = new FileReader();
		        var imgEle = document.getElementById('imgEle_' + checkId);
		        var fileEle = document.getElementById('fileEle_' + checkId);
		        reader.readAsDataURL(file);
		        reader.onload = function(f) {
					if(file.type.indexOf('image') != -1){
		        		imgEle.setAttribute('src', reader.result);
						fileEle.setAttribute('style', 'display: none');
						imgEle.removeAttribute('style');
					}
		        }

		        var xhr = new XMLHttpRequest();
		        xhr.open('post', 'http://upload.qiniu.com/', false);
		        xhr.onreadystatechange = function () {
		            if (xhr.readyState == 4) {
		                if (xhr.status == 200) {
		                    var fileValueEle = document.getElementById('file_' + checkId);
		                    fileValueEle.setAttribute('value', JSON.parse(xhr.responseText).key);
							if(JSON.parse(xhr.responseText).key.indexOf('pdf') != -1){
								fileEle.innerHTML = JSON.parse(xhr.responseText).key;
								imgEle.setAttribute('style', 'display: none');
								fileEle.removeAttribute('style');
							}
		                } else {

		                }
		            }
		        };
		        xhr.send(formData);
    		}
    	}
    }

	changeTab(check,type) {
		if(type=="isNew"){
			this.firstClick = false;
		}
		//console.log(this.checkProjectListOld,this.checkProjectList,this.selectTab);
		if(this.firstClick){
			if(this.checkProjectListOld.length>0){
				for(var i=0;i<this.checkProjectListOld.length;i++){
					if(this.checkProjectListOld[i].id == this.selectTab){
						if (JSON.stringify(this.checkProjectList[i]) != JSON.stringify(this.checkProjectListOld[i])) {
							if(window.confirm('数据尚未保存，是否离开?')){
								if(this.buttonType == 'save'){
									this.getData(check.id);
									// this.buttonType = 'update';
								}
								this.buttonType = 'save';
								if(check.resultList.length > 0){
									for(var j = 0; j < check.resultList.length; j++){
										if(check.resultList[j].values && check.resultList[j].values != ''){
											this.buttonType = 'update';
										}
									}
								}
								this.selectTab = check.id;
								return false;
							}
						}else{
							if(this.buttonType == 'save'){
								this.getData(check.id);
								// this.buttonType = 'update';
							}
							this.buttonType = 'save';
							if(check.resultList.length > 0){
								for(var j = 0; j < check.resultList.length; j++){
									if(check.resultList[j].values && check.resultList[j].values != ''){
										this.buttonType = 'update';
									}
								}
							}
							this.selectTab = check.id;
							return false;
						}
					 }
				}
			}
		}else{
			if(this.buttonType == 'save'){
				this.getData(check.id);
				// this.buttonType = 'update';
			}
			this.buttonType = 'save';
			if(check.resultList.length > 0){
				for(var i = 0; i < check.resultList.length; i++){
					if(check.resultList[i].values && check.resultList[i].values != ''){
						this.buttonType = 'update';
					}
				}
			}
			this.selectTab = check.id;
			this.firstClick = true;
		}
	}

	changeButton() {
		this.buttonType = 'save';
	}

	changeResult(result, indexCheck, indexResult) {
		// 是否为数字范围类型
		if(result.isNum){
			// 判断是否为空
			if(!this.adminService.isFalse(result.values)){
				if(parseFloat(result.values) < 0){
					this._message.error(result.checkInfoKey + '检查结果应大于等于0');
					return;
                }
                this.checkProjectList[indexCheck].resultList[indexResult].compare = '';
				if(result.low && parseFloat(result.values) < parseFloat(result.low)){
					this.checkProjectList[indexCheck].resultList[indexResult].compare = 'low';
				}
				if(result.high && parseFloat(result.values) > parseFloat(result.high)){
					this.checkProjectList[indexCheck].resultList[indexResult].compare = 'high';
				}
			}else{
				this.checkProjectList[indexCheck].resultList[indexResult].compare = '';
			}
		}
	}

	// 创建时，可移除相关项
	removeItem(indexCheck, indexResult) {
		this.checkProjectList[indexCheck].hasRemoveResult = true;
		this.checkProjectList[indexCheck].resultList[indexResult].use = false;
	}

	// 创建时，添加相关项
	addItem(indexCheck, indexResult) {
		this.checkProjectList[indexCheck].resultList[indexResult].use = true;
		var hasRemoveResult = false;
		for(var i = 0; i < this.checkProjectList[indexCheck].resultList.length; i++){
			if(this.checkProjectList[indexCheck].resultList[i].use == false){
				hasRemoveResult = true;
			}
		}
		this.checkProjectList[indexCheck].hasRemoveResult = hasRemoveResult;
	}

	// 放大图片
	enlargeImg(ele, type, values) {
		if(type == 'image'){
			this.modalImg = {
				url: ele.src,
				showImg: this.modalImg.showImg == 0 ? 1 : 0,
			}
		}else{
			if(this.buttonType == 'update'){
				window.open(values);
			}
		}
	}

	closeImg() {
		this.modalImg.showImg = 0;
	}

	save(indexCheck) {
		this.btnCanEdit = true;
		if(this.checkProjectList[indexCheck].resultListNum > 0){
			var resultList = [];
			for(var i = 0; i < this.checkProjectList[indexCheck].resultListNum; i++){
				var result = {
					user_cid: this.checkProjectList[indexCheck].id,
					check_info_id: '',
					check_info_key: '',
					values: '',
					remark: '',
					compare: '',
				}
				this.checkProjectList[indexCheck].resultList[i].values = this.adminService.trim(this.checkProjectList[indexCheck].resultList[i].values);
				// 判断该项是否使用
				if(this.checkProjectList[indexCheck].resultList[i].use){
					// 图片判断
					if(this.checkProjectList[indexCheck].resultList[i].isUpload == '1'){
						var imgName = document.getElementById('file_' + this.checkProjectList[indexCheck].resultList[i].checkInfoId).getAttribute('value');
						// 是否选择图片
						if(imgName == ''){
							// 存在图片未修改
							if(!this.adminService.isFalse(this.checkProjectList[indexCheck].resultList[i].values) && this.checkProjectList[indexCheck].resultList[i].values != ''){
								result.values = this.checkProjectList[indexCheck].resultList[i].values;
							}else{
								this._message.error(this.checkProjectList[indexCheck].resultList[i].checkInfoKey + '检查结果不可为空');
								this.btnCanEdit = false;
								return;
							}
						}else{
							result.values = 'http://static.meb168.com/' + imgName;
						}
					}else{
						// 非空判断
						if(this.adminService.isFalse(this.checkProjectList[indexCheck].resultList[i].values)){
							this._message.error(this.checkProjectList[indexCheck].resultList[i].checkInfoKey + '检查结果不可为空');
							this.btnCanEdit = false;
							return;
						}
						// 若是数字类型，则大于0
						if(this.checkProjectList[indexCheck].resultList[i].isNum && !this.adminService.isFalse(this.checkProjectList[indexCheck].resultList[i].values) && parseFloat(this.checkProjectList[indexCheck].resultList[i].values) < 0){
							this._message.error(this.checkProjectList[indexCheck].resultList[i].checkInfoKey + '检查结果应大于0');
							this.btnCanEdit = false;
							return;
						}
						result.values = this.checkProjectList[indexCheck].resultList[i].values;
					}
					result.check_info_id = this.checkProjectList[indexCheck].resultList[i].checkInfoId;
					result.check_info_key = this.checkProjectList[indexCheck].resultList[i].checkInfoKey;
					result.remark = this.checkProjectList[indexCheck].resultList[i].remark;
					result.compare = this.checkProjectList[indexCheck].resultList[i].compare;
					resultList.push(result);
				}
			}
			var params = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				values: resultList,
				remark: this.adminService.isFalse(this.checkProjectList[indexCheck].remark) ? '' : this.checkProjectList[indexCheck].remark.replace(/[\r\n]/g,";"),
			}
			if(this.checkProjectList[indexCheck].editType == 'create'){
				this.adminService.usercheckresult(this.checkProjectList[indexCheck].id, params).then((data) => {
					if(data.status == 'no'){
						this._message.error(data.errorMsg);
						this.btnCanEdit = false;
					}else{
						this.getData(this.selectTab);
						this._message.success('检查结果添加成功');
						this.buttonType = 'update';
						this.btnCanEdit = false;
						this.checkProjectListOld = JSON.parse(JSON.stringify(this.checkProjectList));
					}
				}).catch(() => {
	                this._message.error('服务器错误');
					this.btnCanEdit = false;
	            });
			}else{
				this.adminService.updatecheckresult(this.checkProjectList[indexCheck].id, params).then((data) => {
					if(data.status == 'no'){
						this._message.error(data.errorMsg);
					}else{
						this.getData(this.selectTab);
						this._message.success('检查结果修改成功');
						this.buttonType = 'update';
						this.btnCanEdit = false;
						this.checkProjectListOld = JSON.parse(JSON.stringify(this.checkProjectList));
					}
				}).catch(() => {
	                this._message.error('服务器错误');
	            });
			}
		}
	}

	print(check) {
		window.open('./admin/inspectResults/print?id=' + check.id + '&layout=all');
	}
}
