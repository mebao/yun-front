import { Component, EventEmitter, Input, Output }   from '@angular/core';

@Component({
	selector: 'select-search',
	templateUrl: './select-search.component.html',
	styleUrls: ['./select-search.component.scss'],
})
export class SelectSearchComponent{
	@Input() title: string;
	@Input() selectList: any[];
	@Output() onVoted = new EventEmitter<string>();
	selectedValue: string;
	show: boolean;
	searchBoolean: boolean;

	constructor() {
	}

	ngOnInit() {
		this.show = false;
		this.selectedValue = '';
		this.searchBoolean = true;
	}

	changeShow() {
		this.show = !this.show;
	}

	changeSearch(_value) {
		//若是第一次进入，将selectList存储到sessionStorage中
		if(this.searchBoolean){
			sessionStorage.setItem('selectList', JSON.stringify(this.selectList));
			this.searchBoolean = false;
		}
		var selectList = JSON.parse(sessionStorage.getItem('selectList'));
		var searchArr = [];
		if(selectList.length > 0){
			for(var i = 0; i < selectList.length; i++){
				if(selectList[i].value && selectList[i].value.toString().indexOf(_value) != -1){
					searchArr.push(selectList[i]);
				}
			}
		}
		this.selectList = searchArr;
	}

	selected(_value) {
		this.selectedValue = _value.value;
		this.onVoted.emit(_value.key);
		this.show = false;
	}
}
