import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

// nav
import { NavModule }                              from '../../nav/nav.module';

// common
import { AngCommonModule }                        from '../../../common/ang-common.module';

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
        NavModule,
        AngCommonModule,
        DocbookingHealthrecordRoutingModule,
    ]
})

export class DocbookingHealthrecordModule{

}
