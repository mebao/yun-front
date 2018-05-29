import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';
import { ENgxPrintModule }                        from 'e-ngx-print';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

// nav
import { NavModule }                              from '../../nav/nav.module';

// common
import { AngCommonModule }                        from '../../../common/ang-common.module';
import { DocbookingLeftModule }                   from '../components/docbooking-left.module';

import { DocbookingHealthrecordRoutingModule }    from './docbooking-healthrecord.routing.module';

import { DocbookingHealthrecordComponent }        from './docbooking-healthrecord.component';

@NgModule({
    declarations: [
        DocbookingHealthrecordComponent,
    ],
    exports: [
        DocbookingHealthrecordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        DocbookingLeftModule,
        DocbookingHealthrecordRoutingModule,
        ENgxPrintModule,
    ]
})

export class DocbookingHealthrecordModule{

}
