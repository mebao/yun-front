import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';

import { NodataComponent }      from './nodata.component';

@NgModule({
    declarations: [
        NodataComponent,
    ],
    exports: [
        NodataComponent,
    ],
    imports: [
        CommonModule,
    ]
})

export class NodataModule{
    
}
