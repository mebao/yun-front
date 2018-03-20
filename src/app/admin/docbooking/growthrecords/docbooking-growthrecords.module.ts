import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

// nav
import { NavModule }                              from '../../nav/nav.module';

// common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { DocbookingGrowthrecordsRoutingModule }   from './docbooking-growthrecords.routing.module';

import { DocbookingGrowthrecordsComponent }       from './docbooking-growthrecords.component';

@NgModule({
    declarations: [
        DocbookingGrowthrecordsComponent,
    ],
    exports: [
        DocbookingGrowthrecordsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DocbookingGrowthrecordsRoutingModule,
    ]
})

export class DocbookingGrowthrecordsModule{

}
