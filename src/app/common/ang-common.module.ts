import { NgModule }              from '@angular/core';

import { AngFormModule }         from './ang-form/ang-form.module';
import { ModalModule }           from './modal/modal.module';
import { NodataModule }          from './nodata/nodata.module';
import { QRCodeModule }          from './qrcode.module';

@NgModule({
    exports: [
        AngFormModule,
        ModalModule,
        NodataModule,
        QRCodeModule,
    ]
})

export class AngCommonModule{

}
