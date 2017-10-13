import { Component, Input, EventEmitter, Output }                       from '@angular/core';

@Component({
    selector: 'modal-img',
    template: `
        <div class="modal" *ngIf="showImg == 1">
            <div class="modal-mask" (click)="close()"></div>
            <div class="container">
                <img src="{{url}}" class="w100" />
            </div>
        </div>
    `
})

export class ModalImgComponent{
    @Input() url: string;
    @Input() showImg: number;
    @Output() onVoted = new EventEmitter<string>();

    close() {
        this.showImg = 0;
        this.onVoted.emit('');
    }
}
