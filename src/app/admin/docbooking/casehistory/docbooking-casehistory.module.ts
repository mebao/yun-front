import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

// nav
import { NavModule }                              from '../../nav/nav.module';

// common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { DocbookingCasehistoryRoutingModule }     from './docbooking-casehistory.routing.module';

import { DocbookingCasehistoryComponent }         from './docbooking-casehistory.component';

@NgModule({
    declarations: [
        DocbookingCasehistoryComponent,
    ],
    exports: [
        DocbookingCasehistoryComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DocbookingCasehistoryRoutingModule,
    ]
})

export class DocbookingCasehistoryModule{

}
