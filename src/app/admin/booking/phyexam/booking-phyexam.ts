import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';

import { NzMessageService, UploadFile } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

import { UploadService } from '../../../common/nll-upload/upload.service';

@Component({
    selector: 'app-booking-phyexam',
    templateUrl: './booking-phyexam.html',
    styleUrls: ['../../../../assets/css/ant-common.scss', './booking-phyexam.scss']
})

export class BookingPhyexam {
    topBar: {
        title: string,
        back: boolean,
    };
    params: {
        id: string,
        childId: string,
        bookingId: string,
    }
    url: string;
    loadingShow: boolean;
    isLoadingSave: boolean;
    info: {
        id: string,
        production_status: string,
        production_way: string,
        gestational_weeks: string,
        allergic_history: string,
        feeding_way: string,
        daily_milk: string,
        is_vaccinate: string,
        fhohd: string,
        vaccinate_name: string,
        // 用于记录原始数据
        vaccinate_date: Date,
        production_status_text: string,
        production_way_text: string,
        gestational_weeks_text: string,
        allergic_history_text: string,
        feeding_way_text: string,
        daily_milk_text: string,
        is_vaccinate_text: string,
        fhohd_text: string,
        vaccinate_name_text: string,
        vaccinate_date_text: string,
    }
    editTypeHealth: string;
    editTypePhyexam: string;
    selectedIndex: number;
    menuList: any[];
    doc: Document;
    target: Element = null;
    textareaRows: number = 2;
    isSaveLoading: boolean;
    // 图片上传
    hasFileNum: number = 0;
    successFile: number = 0;
    qiniuToken: string;
    upload_multiple: boolean;
    acceptType: string;
    fileList: UploadFile[] = [];
    modalImg: {
        url: string,
        showImg: number,
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private _message: NzMessageService,
        private as: AdminService,
        private uploadService: UploadService,
        @Inject(DOCUMENT) doc: any
    ) {
        this.doc = doc;
    }

    ngOnInit() {
        this.topBar = {
            title: '体检套餐',
            back: true,
        }

        this.route.queryParams.subscribe((params) => {
            this.params = {
                id: params.id,
                childId: params.childId,
                bookingId: params.bookingId,
            };
        });
        this.url = '?username=' + this.as.getUser().username
            + '&token=' + this.as.getUser().token
            + '&clinic_id=' + this.as.getUser().clinicId;
        // this.loadingShow = true;
        this.isLoadingSave = false;
        this.info = {
            id: '',
            production_status: '',
            production_way: '',
            gestational_weeks: '',
            allergic_history: '',
            feeding_way: '',
            daily_milk: '',
            is_vaccinate: '',
            fhohd: '',
            vaccinate_name: '',
            vaccinate_date: null,
            production_status_text: '',
            production_way_text: '',
            gestational_weeks_text: '',
            allergic_history_text: '',
            feeding_way_text: '',
            daily_milk_text: '',
            is_vaccinate_text: '',
            fhohd_text: '',
            vaccinate_name_text: '',
            vaccinate_date_text: '',
        }
        this.editTypeHealth = '';
        this.editTypePhyexam = 'edit';
        this.selectedIndex = 0;
        this.menuList = [];
        this.target = this.doc.querySelector('.right-content');
        this.isSaveLoading = false;

        // 获取健康档案数据，id存在，则根据id查询，id不存在，则获取最新数据填充
        this.getHealthData();

        this.qiniuToken = '';
        this.upload_multiple = true;
        this.acceptType = 'image/*, application/pdf';
        this.getQiniuToken();

        this.modalImg = {
            url: '',
            showImg: 0,
        }
    }

    getHealthData() {
        this.loadingShow = true;
        var urlOptions = this.url + '&booking_id=' + this.params.bookingId;
        this.as.childhealths(urlOptions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                if (results.list.length > 0) {
                    this.info = {
                        id: results.list[0].id,
                        production_status: results.list[0].productionStatus,
                        production_way: results.list[0].productionWay,
                        gestational_weeks: results.list[0].gestationalWeeks,
                        allergic_history: results.list[0].allergicHistory,
                        feeding_way: results.list[0].feedingWay,
                        daily_milk: results.list[0].dailyMilk,
                        is_vaccinate: results.list[0].isVaccinate,
                        fhohd: results.list[0].fhohd,
                        vaccinate_name: results.list[0].vaccinateName,
                        vaccinate_date: results.list[0].vaccinateDate ? new Date(results.list[0].vaccinateDate) : null,
                        production_status_text: results.list[0].productionStatus,
                        production_way_text: results.list[0].productionWay,
                        gestational_weeks_text: results.list[0].gestationalWeeks,
                        allergic_history_text: results.list[0].allergicHistory,
                        feeding_way_text: results.list[0].feedingWay,
                        daily_milk_text: results.list[0].dailyMilk,
                        is_vaccinate_text: results.list[0].isVaccinate,
                        fhohd_text: results.list[0].fhohd,
                        vaccinate_name_text: results.list[0].vaccinateName,
                        vaccinate_date_text: results.list[0].vaccinateDate ? this.as.getDayByDate(new Date(results.list[0].vaccinateDate)) : '',
                    }
                    this.editTypeHealth = 'view';
                } else {
                    urlOptions = this.url + '&child_id=' + this.params.childId + '&new=1';
                    // 获取该小孩最新一条数据
                    this.as.childhealths(urlOptions).then((data) => {
                        if (data.status == 'no') {
                            this.loadingShow = false;
                            this._message.error(data.errorMsg);
                        } else {
                            var results = JSON.parse(JSON.stringify(data.results));
                            if (results.list.length > 0) {
                                this.info = {
                                    id: null,
                                    production_status: results.list[0].productionStatus,
                                    production_way: results.list[0].productionWay,
                                    gestational_weeks: results.list[0].gestationalWeeks,
                                    allergic_history: results.list[0].allergicHistory,
                                    feeding_way: results.list[0].feedingWay,
                                    daily_milk: results.list[0].dailyMilk,
                                    is_vaccinate: results.list[0].isVaccinate,
                                    fhohd: results.list[0].fhohd,
                                    vaccinate_name: results.list[0].vaccinateName,
                                    vaccinate_date: results.list[0].vaccinateDate ? new Date() : null,
                                    production_status_text: results.list[0].productionStatus,
                                    production_way_text: results.list[0].productionWay,
                                    gestational_weeks_text: results.list[0].gestationalWeeks,
                                    allergic_history_text: results.list[0].allergicHistory,
                                    feeding_way_text: results.list[0].feedingWay,
                                    daily_milk_text: results.list[0].dailyMilk,
                                    is_vaccinate_text: results.list[0].isVaccinate,
                                    fhohd_text: results.list[0].fhohd,
                                    vaccinate_name_text: results.list[0].vaccinateName,
                                    vaccinate_date_text: results.list[0].vaccinateDate ? this.as.getDayByDate(new Date(results.list[0].vaccinateDate)) : null,
                                }
                                this.editTypeHealth = 'view';
                            } else {
                                this.editTypeHealth = 'edit';
                            }
                            this.loadingShow = false;
                        }
                    }).catch(() => {
                        this.loadingShow = false;
                        this._message.error('服务器错误');
                    });
                }
                this.loadingShow = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    changeIndex(index) {
        if (index == 1 && this.menuList.length == 0) {
            this.loadingShow = true;
            this.getPhyInfo();
        } else {
            this.selectedIndex = index;
        }
    }

    changeTypeHealth() {
        this.editTypeHealth = 'edit';
    }

    cancelHealth() {
        this.info.production_status = this.info.production_status_text;
        this.info.production_way = this.info.production_way_text;
        this.info.gestational_weeks = this.info.gestational_weeks_text;
        this.info.allergic_history = this.info.allergic_history_text;
        this.info.feeding_way = this.info.feeding_way_text;
        this.info.daily_milk = this.info.daily_milk_text;
        this.info.is_vaccinate = this.info.is_vaccinate_text;
        this.info.fhohd = this.info.fhohd_text;
        this.info.vaccinate_name = this.info.vaccinate_name_text;
        this.info.vaccinate_date = this.info.vaccinate_date_text ? new Date(this.info.vaccinate_date_text) : null;
        this.editTypeHealth = 'view';
    }

    saveHealth() {
        if (this.info.production_status == '') {
            this._message.error('生产状态不可为空');
            return;
        }
        if (this.info.production_way == '') {
            this._message.error('生产方式不可为空');
            return;
        }
        if (this.info.gestational_weeks == '') {
            this._message.error('孕周不可为空');
            return;
        }
        if (this.info.allergic_history == '') {
            this._message.error('过敏史不可为空');
            return;
        }
        if (this.info.feeding_way == '') {
            this._message.error('喂养方式不可为空');
            return;
        }
        if (this.info.daily_milk == '') {
            this._message.error('每日奶量不可为空');
            return;
        }
        if (this.info.is_vaccinate == '') {
            this._message.error('是否接种不可为空');
            return;
        }
        if (this.info.fhohd == '') {
            this._message.error('家族遗传疾病史不可为空');
            return;
        }
        this.loadingShow = true;
        this.isSaveLoading = true;
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            booking_id: this.params.bookingId,
            child_id: this.params.childId,
            production_status: this.info.production_status,
            production_way: this.info.production_way,
            gestational_weeks: this.info.gestational_weeks,
            allergic_history: this.info.allergic_history,
            feeding_way: this.info.feeding_way,
            daily_milk: this.info.daily_milk,
            is_vaccinate: this.info.is_vaccinate,
            vaccinate_name: this.info.vaccinate_name,
            vaccinate_date: this.info.vaccinate_date ? this.as.getDayByDate(new Date(this.info.vaccinate_date)) : null,
            fhohd: this.info.fhohd,
            id: this.info.id,
        }
        this.as.childhealth(params).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this.isSaveLoading = false;
                this._message.error(data.errorMsg);
            } else {
                this.info.production_status_text = this.info.production_status;
                this.info.production_way_text = this.info.production_way;
                this.info.gestational_weeks_text = this.info.gestational_weeks;
                this.info.allergic_history_text = this.info.allergic_history;
                this.info.feeding_way_text = this.info.feeding_way;
                this.info.daily_milk_text = this.info.daily_milk;
                this.info.is_vaccinate_text = this.info.is_vaccinate;
                this.info.fhohd_text = this.info.fhohd;
                this.info.vaccinate_name_text = this.info.vaccinate_name;
                this.info.vaccinate_date_text = this.info.vaccinate_date ? this.as.getDayByDate(new Date(this.info.vaccinate_date)) : null;
                this.editTypeHealth = 'view';
                this.getPhyInfo();
                this.isSaveLoading = false;
            }
        }).catch(() => {
            this.loadingShow = false;
            this.isSaveLoading = false;
            this._message.error('服务器错误');
        });
    }

    _disabledDate = (startValue) => {
        if (!startValue || !new Date()) {
            return false;
        }
        return startValue.getTime() > new Date().getTime();
    };

    getPhyInfo() {
        this.hasFileNum = 0;
        var urlOptions = this.params.id + this.url + '&id=' + this.params.id;
        this.as.bookingphyinfo(urlOptions).then((data) => {
            if (data.status == 'no') {
                this.loadingShow = false;
                this._message.error(data.errorMsg);
            } else {
                var results = JSON.parse(JSON.stringify(data.results));
                if (results.list.length > 0) {
                    if (results.list[0].infos.length > 0) {
                        var firstExam = true;
                        for (var i = 0; i < results.list[0].infos.length; i++) {
                            if(results.list[0].infos[i].examName != '健康档案'){
                                if(firstExam){
                                    firstExam = false;
                                    results.list[0].infos[i].selected = true;
                                }else{
                                    results.list[0].infos[i].selected = false;
                                }
                                if (results.list[0].infos[i].exam && results.list[0].infos[i].exam.length > 0) {
                                    for (var j = 0; j < results.list[0].infos[i].exam.length; j++) {
                                        if(results.list[0].infos[i].exam[j].result != ''){
                                            this.editTypePhyexam = 'view';
                                        }
                                        results.list[0].infos[i].exam[j].rowNum = 1;
                                        // input含有默认值
                                        if (results.list[0].infos[i].exam[j].inputType == 'defaultinput' && results.list[0].infos[i].exam[j].result == '') {
                                            results.list[0].infos[i].exam[j].result = results.list[0].infos[i].exam[j].inputValue;
                                        }else if (results.list[0].infos[i].exam[j].inputType == 'radio_input') {
                                            // radio
                                            results.list[0].infos[i].exam[j].inputValue = JSON.parse(results.list[0].infos[i].exam[j].inputValue);
                                        }else if (results.list[0].infos[i].exam[j].inputType == 'file') {
                                            // file
                                            this.hasFileNum++;
                                        }
                                    }
                                }
                            }
                        }
                        sessionStorage.setItem('bookingPhyexamData', JSON.stringify(results.list[0].infos));
                        this.menuList = results.list[0].infos;
                        console.log(this.menuList);
                    }
                }
                this.loadingShow = false;
                this.selectedIndex = 1;
            }
        }).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        });
    }

    selectMenu(index) {
        for(var i = 0; i < this.menuList.length; i++){
            this.menuList[i].selected = false;
        }
        this.menuList[index].selected = true;
    }

    // textarea enter增加row
    changeRow($event, indexMenu, indexItem) {
        if ($event.key == 'Enter' && this.menuList[indexMenu].exam[indexItem].rowNum < 4) {
            this.menuList[indexMenu].exam[indexItem].rowNum++;
        }
        if (this.menuList[indexMenu].exam[indexItem].result.trim() == '') {
            this.menuList[indexMenu].exam[indexItem].rowNum = 1;
        }
    }

    // number result变化时，添加compare
    changeNumResult(indexMenu, indexItem) {
        if (this.menuList[indexMenu].exam[indexItem].type && this.menuList[indexMenu].exam[indexItem].type == 'number') {
            if (parseFloat(this.menuList[indexMenu].exam[indexItem].result) > parseFloat(this.menuList[indexMenu].exam[indexItem].scopeMax)) {
                this.menuList[indexMenu].exam[indexItem].compare = 'height';
            } else if (parseFloat(this.menuList[indexMenu].exam[indexItem].result) < parseFloat(this.menuList[indexMenu].exam[indexItem].scopeMin)) {
                this.menuList[indexMenu].exam[indexItem].compare = 'lower';
            } else {
                this.menuList[indexMenu].exam[indexItem].compare = '';
            }
        }
    }

    getQiniuToken() {
        //获取头像上传token
        var tokenUrl = '?type=static';
        this.as.qiniutoken(tokenUrl).then((data) => {
            if (data.status == 'no') {
                this._message.error(data.errorMsg);
            } else {
                this.qiniuToken = JSON.parse(JSON.stringify(data)).uptoken;
            }
        }).catch(() => {
            this._message.error('服务器错误');
        });
    }

    successUpload($event, indexMenu, indexItem) {
        var fileList = $event.fileList;
        if (fileList.length > 0) {
            var flist = [];
            for (var i = 0; i < fileList.length; i++) {
                if (fileList[i].uploadStatus == 'success') {
                    this.menuList[indexMenu].exam[indexItem].result = 'http://static.meb168.com/' + fileList[i].key;
                    this.successFile++;
                } else {
                    this.loadingShow = false;
                    this.isSaveLoading = false;
                    this._message.error(this.menuList[indexMenu].exam[indexItem].infoName + '文件上传失败，若多次上传失败，可先删除文件，先保存其他项目结果。');
                }
            }
        } else {
            this.successFile++;
        }
        if (this.successFile == this.hasFileNum) {
            this.saveResult();
        }
    }

    errorUpload($event) {
        this.loadingShow = false;
        this.isSaveLoading = false;
        this._message.error($event.errorMsg);
    }

    changeTypePhyexam() {
        this.editTypePhyexam = 'edit';
    }

    cancelPhyexam(indexMenu) {
        this.menuList = JSON.parse(sessionStorage.getItem('bookingPhyexamData'));
        this.selectMenu(indexMenu);
        this.editTypePhyexam = 'view';
    }

    saveUpload() {
        this.loadingShow = true;
        this.isSaveLoading = true;
        if(this.hasFileNum > 0){
            this.successFile = 0;
            this.uploadService.startUpload();
        }else{
            this.saveResult();
        }
    }

    saveResult() {
        var list = [];
        if (this.menuList.length > 0) {
            for (var i = 0; i < this.menuList.length; i++) {
                if (this.menuList[i].exam && this.menuList[i].exam.length > 0) {
                    for (var j = 0; j < this.menuList[i].exam.length; j++) {
                        var itemResult = {
                            info_id: this.menuList[i].exam[j].infoId,
                            result: this.menuList[i].exam[j].result,
                            compare: this.menuList[i].exam[j].compare,
                        }
                        list.push(itemResult);
                    }
                }
            }
        }
        var params = {
            username: this.as.getUser().username,
            token: this.as.getUser().token,
            clinic_id: this.as.getUser().clinicId,
            id: this.params.id,
            list: list,
        }
        this.as.phypackresult(params).then((data) => {
            this.loadingShow = false;
            this.isSaveLoading = false;
            if (data.status == 'no') {
                this._message.error(data.errorMsg);
            } else {
                this._message.success('结果填写成功');
                sessionStorage.setItem('bookingPhyexamData', JSON.stringify(this.menuList));
                this.editTypePhyexam = 'view';
            }
        }).catch(() => {
            this.loadingShow = false;
            this.isSaveLoading = false;
            this._message.error('服务器错误');
        });
    }

    showFile(file) {
		if(file.indexOf('pdf') == -1){
			this.modalImg.url = file;
			this.modalImg.showImg = 1;
		}else{
			window.open(file);
		}
    }

    closeImg() {
        this.modalImg.showImg = 0;
    }
}
