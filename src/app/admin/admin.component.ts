import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-admin',
	template: `
		<ng-container *ngIf="layout == 'left-right'">
			<div class="container flex">
				<left-nav></left-nav>
				<div class="right-content flex-1">
					<header-nav></header-nav>
					<router-outlet></router-outlet>
				</div>
			</div>
		</ng-container>
		<ng-container *ngIf="layout == 'all'">
			<router-outlet></router-outlet>
		</ng-container>
	`,
})
export class AdminComponent{
	layout = 'left-right';

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			if(params.layout){
				this.layout = params.layout;
			}
		});
	}
}
