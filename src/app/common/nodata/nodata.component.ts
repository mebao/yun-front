import { Component, Input }                from '@angular/core';

@Component({
	selector: 'nodata',
	templateUrl: './nodata.component.html',
	styleUrls: ['./nodata.component.scss'],
})
export class NodataComponent{
	@Input() title: string;
}