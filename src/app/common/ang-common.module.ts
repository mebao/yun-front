import { NgModule }              from '@angular/core';

import { AngFormModule }         from './ang-form/ang-form.module';
import { ModalModule }           from './modal/modal.module';
import { NodataModule }          from './nodata/nodata.module';
import { QRCodeModule }          from './qrcode.module';
import { ToastModule }           from './nll-toast/toast.module';

@NgModule({
    exports: [
        AngFormModule,
        ModalModule,
        NodataModule,
        QRCodeModule,
        ToastModule,
    ]
})

export class AngCommonModule{

}
