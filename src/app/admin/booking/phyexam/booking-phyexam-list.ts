import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { AdminService } from '../../admin.service';

@Component({
	selector: 'app-booking-phyexam-list',
	templateUrl: './booking-phyexam-list.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})

export class BookingPhyexamList {
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
	}
	url: string;
	loadingShow: boolean;
	bookingPhyexamList: any[];
	hasData: boolean;
	searchInfo: {
		package_name: string,
		child_name: string,
        is_finish: string,
        date_big: Date,
        date_less: Date,
	}

	constructor(
		private _message: NzMessageService,
		private as: AdminService,
		private router: Router,
	) { }

	ngOnInit() {
		this.topBar = {
			title: '体检预约列表',
			back: false,
		}

		this.moduleAuthority = {
			see: false,
			edit: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.as.getUser().role == '0' || this.as.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.url = '?username=' + this.as.getUser().username
			+ '&token=' + this.as.getUser().token
			+ '&clinic_id=' + this.as.getUser().clinicId;
		this.loadingShow = false;
		this.bookingPhyexamList = [];
		this.hasData = false;

        this.searchInfo = {
            package_name: '',
            child_name: '',
            is_finish: '',
            date_big: new Date(),
            date_less: new Date(),
        }
        var sessionSearch = JSON.parse(sessionStorage.getItem('search-bookingPhyexamList'));
		if(sessionSearch){
			this.searchInfo = {
				package_name: sessionSearch.package_name,
				child_name: sessionSearch.child_name,
				is_finish: sessionSearch.is_finish,
                date_big: sessionSearch.date_big ? new Date(sessionSearch.date_big) : null,
                date_less: sessionSearch.date_less ? new Date(sessionSearch.date_less) : null,
			}
		}
		this.search();
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-bookingPhyexamList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if (this.searchInfo.package_name && this.searchInfo.package_name != '') {
			urlOptions += '&package_name=' + this.searchInfo.package_name;
		}
		if (this.searchInfo.child_name && this.searchInfo.child_name != '') {
			urlOptions += '&child_name=' + this.searchInfo.child_name;
		}
		if (this.searchInfo.is_finish && this.searchInfo.is_finish != '') {
			urlOptions += '&is_finish=' + this.searchInfo.is_finish;
		}
        if(this.searchInfo.date_big){
            urlOptions += '&bdate_big=' + this.as.getDayByDate(new Date(this.searchInfo.date_big));
        }
        if(this.searchInfo.date_less){
            urlOptions += '&bdate_less=' + this.as.getDayByDate(new Date(this.searchInfo.date_less));
        }
		this.getData(urlOptions);
	}

    _disabledStartDate = (startValue) => {
        if (!startValue || !this.searchInfo.date_less) {
            return false;
        }
        return startValue.getTime() > this.searchInfo.date_less.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this.searchInfo.date_big) {
            return false;
        }
        return endValue.getTime() < this.searchInfo.date_big.getTime();
    };

	getData(urlOptions) {
		this.as.bookingphypage(urlOptions).then((data) => {
			if (data.status == 'no') {
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			} else {
				var results = JSON.parse(JSON.stringify(data.results));
				this.bookingPhyexamList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		})
	}

	exam(phyexam) {
		this.router.navigate(['./admin/booking/phyexam'], { queryParams: { id: phyexam.id, childId: phyexam.childId, bookingId: phyexam.bookingId } });
	}
}
