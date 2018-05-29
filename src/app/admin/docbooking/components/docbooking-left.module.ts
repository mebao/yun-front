import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { NgZorroAntdModule }    from 'ng-zorro-antd';

import { AngCommonModule }      from '../../../common/ang-common.module';

import { DocbookingLeft }       from './docbooking-left';

@NgModule({
    declarations: [
        DocbookingLeft,
    ],
    exports: [
        DocbookingLeft,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        AngCommonModule,
    ]
})

export class DocbookingLeftModule{

}
