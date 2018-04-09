import { Component } from '@angular/core';
@Component({
	selector: 'app-root',
	template: `
		<nz-root>
	   		<router-outlet></router-outlet>
		</nz-root>
		<ngx-loading-bar></ngx-loading-bar>
	`
})
export class AppComponent {

}
