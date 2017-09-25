import { Component }            from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent{
	topBar: {
		title: string,
		back: boolean,
	};

	ngOnInit() {
		this.topBar = {
			title: '首页',
			back: false,
		}
	}
}
