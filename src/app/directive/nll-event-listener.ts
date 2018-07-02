import { Directive, ElementRef, HostListener, EventEmitter, Output} from '@angular/core';


@Directive({
    selector: '[nllEventListener]'
})

export class NllEventListenerDirective {
    private element: HTMLElement;
    private size: string;
	@Output() mouseEnter = new EventEmitter<string>();
	@Output() mouseLeave = new EventEmitter<string>();
	@Output() dblClick = new EventEmitter<string>();

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
        this.size = this.element.style.fontSize;
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.mouseEnter.emit();
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.mouseLeave.emit();
    }

    @HostListener('dblclick')
    onDblClick() {
        this.dblClick.emit();
    }
}
