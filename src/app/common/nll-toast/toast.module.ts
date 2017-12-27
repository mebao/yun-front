import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';

import { ToastService }              from './toast.service';
import { ToastBoxComponent }         from './toast-box.component';
import { ToastComponent }            from './toast.component';

@NgModule({
    declarations: [
        ToastBoxComponent,
        ToastComponent,
    ],
    exports: [
        ToastBoxComponent,
        ToastComponent,
    ],
    imports: [CommonModule],
    providers: [
        ToastService,
    ]
})

export class ToastModule{

}
