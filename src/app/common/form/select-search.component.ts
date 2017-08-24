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

	constructor() {
	}

	ngOnInit() {
		this.show = false;
		this.selectedValue = '';
	}

	changeShow() {
		this.show = !this.show;
	}

	changeSearch(_value) {
		var searchArr = [];
		var otherArr = [];
		if(this.selectList.length > 0){
			for(var i = 0; i < this.selectList.length; i++){
				if(this.selectList[i].value && this.selectList[i].value.toString().indexOf(_value) != -1){
					searchArr.push(this.selectList[i]);
				}else{
					otherArr.push(this.selectList[i]);
				}
			}
		}
		this.selectList = searchArr.concat(otherArr);
	}

	selected(_value) {
		this.selectedValue = _value.value;
		this.onVoted.emit(_value.key);
		this.show = false;
	}
}