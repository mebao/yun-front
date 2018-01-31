import { NgModule }              from '@angular/core';

import { AngFormModule }         from './ang-form/ang-form.module';
import { ModalModule }           from './modal/modal.module';
import { NodataModule }          from './nodata/nodata.module';
import { QRCodeModule }          from './qrcode.module';
import { ToastModule }           from './nll-toast/toast.module';
import { UploadModule }          from './nll-upload/upload.module';

@NgModule({
    exports: [
        AngFormModule,
        ModalModule,
        NodataModule,
        QRCodeModule,
        ToastModule,
        UploadModule,
    ]
})

export class AngCommonModule{

}
