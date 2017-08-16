import { Component, Input, Output }                         from '@angular/core';

@Component({
	selector: 'modal-toast',
	templateUrl: './modal-toast.component.html'
})
export class ModalToastComponent{
	@Input() modalTab: number;

	@Input() text: string;

	@Input() type: string;
}