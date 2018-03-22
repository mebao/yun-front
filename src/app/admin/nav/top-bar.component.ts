import { Component, Input }               from '@angular/core';
import { Location }                       from '@angular/common';
import { Router }                         from '@angular/router';

@Component({
	selector: 'top-bar',
	templateUrl: './top-bar.component.html',
	styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent{
	@Input() data: {
		title: string,
		back: boolean,
		back_url: string,
	};

	constructor(
		private location: Location,
		private router: Router,
	) {}

	back() {
		if(this.data.back_url && this.data.back_url != ''){
			this.router.navigate([this.data.back_url]);
		}else{
			this.location.back();
		}
	}
}
