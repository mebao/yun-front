import { Component, Input }                        from '@angular/core';

@Component({
    selector: 'loading',
    template: `
        <div class="modal" *ngIf="show">
            <div class="modal-mask"></div>
            <div class="loading-content">
                <div class="loading">
                    <div class="object one"></div>
                    <div class="object two"></div>
                    <div class="object three"></div>
                    <div class="object four"></div>
                    <div class="object five"></div>
                    <div class="object six"></div>
                    <div class="object seven"></div>
                    <div class="object eight"></div>
                </div>
            </div>
        </div>
    `,
})

export class LoadingComponent{
    @Input() show = false;
}
