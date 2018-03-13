import { Directive, ElementRef, HostListener, EventEmitter, Output} from '@angular/core';


@Directive({
    selector: '[mouseIn]'
})

export class MouseInDirective {
    private element: HTMLElement;
    private size: string;
	@Output() mouseHandler = new EventEmitter<string>();

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
        this.size = this.element.style.fontSize;
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.setHandler('enter');
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.setHandler('leave');
    }

    setHandler(handler: string) {
        this.mouseHandler.emit(handler);
    }
}
