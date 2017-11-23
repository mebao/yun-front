import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';

import { LoadingComponent }      from './loading.component';
import { ModalImgComponent }     from './modal-img.component';
import { ModalToastComponent }   from './modal-toast.component';

@NgModule({
    declarations: [
        LoadingComponent,
        ModalImgComponent,
        ModalToastComponent,
    ],
    exports: [
        LoadingComponent,
        ModalImgComponent,
        ModalToastComponent,
    ],
    imports: [
        CommonModule
    ]
})

export class ModalModule{

}
