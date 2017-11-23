import { Component, EventEmitter, Input, Output }                        from '@angular/core';

@Component({
    selector: 'select-date',
    templateUrl: './select-date.component.html',
    styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent{
    @Input() title: string;
    @Input() type: string;
	@Output() onVoted = new EventEmitter<string>();
    @Input() disabled = false;
    @Input() showClear = false;
    showDateTab: boolean;
    dayList: any[];
    dayInfo: {
        day: string,
        month: string,
        year: string,
        date: string,
    }
    showTab: string;
    monthList: any[];
    yearList: any[];
    selectInfo: {
        month: string,
        year: string,
        date: string,
    }
    // 已选择，在进入修改时，应显示清除
    @Input() dateText = '';
    today: string;

    ngOnInit() {
        this.showDateTab = false;
        this.dayList = [];
        this.dayInfo = {
            day: '',
            month: '',
            year: '',
            date: '',
        }
        this.showTab = 'day';
        this.monthList = [];
        this.yearList = [];
        this.selectInfo = {
            month: '',
            year: '',
            date: '',
        }

        if(this.selectInfo.date != ''){
            this.getDate(this.selectInfo.date);
        }else{
            this.getDate(new Date());
        }

        // 用于标识今天
        this.today = this.getDateString(new Date());

        this.getYear();
        this.getMonth();
    }

    getYear() {
        this.yearList = [];
        for(var i = Number(this.dayInfo.year) - 4; i < Number(this.dayInfo.year) + 5; i++){
            var year = {
                key: i,
            }
            this.yearList.push(year);
        }
    }

    getMonth() {
        for(var i = 1; i < 13; i++){
            var month = {
                key: i,
            }
            this.monthList.push(month);
        }
    }

    getDate(date){
        var nowDate = new Date(date);
        // 当前年份及月份
        var nowYear = nowDate.getFullYear();
        var nowMonth = nowDate.getMonth() + 1;
        var nowDay = nowDate.getDate();
        this.dayInfo = {
            day: nowDay.toString(),
            month: nowMonth.toString(),
            year: nowYear.toString(),
            date: nowYear + '-' + (nowMonth < 10 ? (nowMonth + 1) : nowMonth) + '-' + (nowDay < 10 ? (nowDay + 1) : nowDay),
        }
        // 重置年份
        this.getYear();
        this.selectInfo.month = nowMonth.toString();
        this.selectInfo.year = nowYear.toString();
        // 获取当月第一天
        var nowFirstDay = new Date(nowYear + '-' + nowMonth + '-01');
        // 获取当月第一天，在该周第几天
        var firstDay = (nowFirstDay.getDay() == 0 ? 7 : nowFirstDay.getDay());
        // 获取当月第一天，该周周一日期
        var weekFirst = new Date(nowFirstDay.getTime() - (firstDay - 1) * 24 * 60 * 60 * 1000);
        // 获取当月最后一天
        var nowLastDay = new Date((nowMonth + 1 > 12 ? (nowYear + 1) : nowYear) + '-' + ((nowMonth + 1) > 12 ? 1 : (nowMonth + 1)) + '-' + '01');
        // 获取当月最后一天，在该周第几天
        var lastDay = (nowLastDay.getDay() == 0 ? 7 : nowLastDay.getDay());
        // 获取当月最后一天，该周周日日期
        var weekLast = new Date(nowLastDay.getTime() + (7 - lastDay) * 24 * 60 * 60 * 1000);
        // 需要展示的天数
        var days = (weekLast.getTime() - weekFirst.getTime()) / (24 * 60 * 60 * 1000);
        var dayList = [];
        for(var i = 0; i < days; i++){
            var dayDate = new Date(weekFirst.getTime() + (i * 24 * 60 * 60 * 1000));
            var dayItem = {
                day: dayDate.getDate(),
                month: dayDate.getMonth() + 1,
                year: dayDate.getFullYear(),
                nowMonth: nowMonth,
                date: this.getDateString(dayDate),
                canUse: '',
            }
            dayList.push(dayItem);
        }
        this.dayList = dayList;
    }

    changeTab(_value) {
        this.showTab = _value;
    }

    selectYear(_value) {
        this.selectInfo.year = _value;
        this.showTab = 'month';
    }

    selectMonth(_value) {
        this.selectInfo.month = _value;
        this.showTab = 'day';
        this.getDate(this.selectInfo.year + '-' + this.selectInfo.month + '-01');
    }

    goDate(type, goType) {
        if(type == 'year'){
            // 展示年是，前后年跨度为9
            var yearStep = (this.showTab == 'year' ? 9 : 1);
            this.selectInfo.year = (goType == 'plus' ? (Number(this.selectInfo.year) + yearStep) : (Number(this.selectInfo.year) - yearStep)).toString();
        }else{
            if(goType == 'plus'){
                this.selectInfo.year = (this.selectInfo.month == '12' ? (Number(this.selectInfo.year) + 1).toString() : this.selectInfo.year);
                this.selectInfo.month = (this.selectInfo.month == '12' ? '1' : (Number(this.selectInfo.month) + 1) .toString());
            }else{
                this.selectInfo.year = (this.selectInfo.month == '1' ? (Number(this.selectInfo.year) - 1).toString() : this.selectInfo.year);
                this.selectInfo.month = (this.selectInfo.month == '1' ? '12' : (Number(this.selectInfo.month) - 1) .toString());
            }
        }
        this.getDate(this.selectInfo.year + '-' + this.selectInfo.month + '-01');
    }

    selectDay(_value) {
		var v = _value.split('-');
		v = v[0] + '年' + v[1] + '月' + v[2] + '日';
        this.selectInfo.date = _value;
        this.dateText = v;
        this.showTab = 'day';
        this.showDateTab = false;
        var returnData = {
            value: _value,
            type: this.type,
        }
		this.onVoted.emit(JSON.stringify(returnData));
    }

    // 清空
    clear() {
        this.selectInfo.date = '';
        this.dateText = '';
        this.showTab = 'day';
        var returnData = {
            value: '',
            type: this.type,
        }
        this.onVoted.emit(JSON.stringify(returnData));
    }

    changeDateTab() {
        if(!this.disabled){
            if(this.showDateTab){
                this.showTab = 'day';
            }
            this.showDateTab = !this.showDateTab;
        }
    }

    // 根据日期获取2017-02-01
    getDateString(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
    }
}
