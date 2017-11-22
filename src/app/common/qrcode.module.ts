import { NgModule, Component, Input, Output, EventEmitter, OnInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as QRious from 'qrious';

@Component({
  selector: 'qr-code',
  template: ''
})
export class QRCodeComponent implements OnInit, OnChanges {
    @Input() value: string;
    @Input() size: number;
	@Output() onVoted = new EventEmitter<string>();

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.value && !changes.size) {
            return;
        }

        this.init();
    }

    private init(): void {
        const qr = new QRious({
            value: this.value,
            size: this.size
        });

		this.onVoted.emit(qr.image.src);

        this.elementRef.nativeElement.innerHTML = '';
        this.elementRef.nativeElement.appendChild(qr.image);
    }

}

@NgModule({
    exports: [QRCodeComponent],
    declarations: [QRCodeComponent],
    entryComponents: [QRCodeComponent]
})
export class QRCodeModule {}
