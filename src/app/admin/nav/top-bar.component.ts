import { Component, Input }               from '@angular/core';
import { Location }                       from '@angular/common';

@Component({
	selector: 'top-bar',
	templateUrl: './top-bar.component.html',
	styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent{
	@Input() data: {
		title: string,
		back: boolean,
	};

	constructor(
		private location: Location,
	) {}

	back() {
		this.location.back();
	}
}