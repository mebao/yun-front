import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import { UploadService }       from './upload.service';

import { UploadComponent }     from './upload.component';

@NgModule({
    declarations: [
        UploadComponent,
    ],
    exports: [
        UploadComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
    ],
    providers: [
        UploadService,
    ]
})

export class UploadModule{

}
