import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-admin',
	template: `
		<div class="body-container theme {{theme}}">
			<ng-container *ngIf="layout == 'left-right'">
				<div class="page-container flex">
					<left-nav></left-nav>
					<div class="right-content flex-1">
						<header-nav [theme]="theme" (onVotedTheme)="changeTheme($event)"></header-nav>
						<router-outlet></router-outlet>
					</div>
				</div>
			</ng-container>
			<ng-container *ngIf="layout == 'all'">
				<router-outlet></router-outlet>
			</ng-container>
		</div>
	`,
})
export class AdminComponent{
	layout = 'left-right';
	theme: string;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			if(params.layout){
				this.layout = params.layout;
			}
		});

		var theme_default = localStorage.getItem('yun-theme');
		if(theme_default){
			this.theme = theme_default;
		}else{
			this.theme = '';
			localStorage.setItem('yun-theme', this.theme);
		}
	}

	changeTheme(_theme) {
		this.theme = _theme;
		localStorage.setItem('yun-theme', _theme);
		console.log(_theme);
	}
}
