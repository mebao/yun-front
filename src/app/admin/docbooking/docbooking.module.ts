import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';

// nav
import { NavModule }                        from '../nav/nav.module';

// common
import { AngCommonModule }                  from '../../common/ang-common.module';

import { DocbookingRoutingModule }          from './docbooking.routing.module';

import { DocbookingVisitComponent }         from './docbooking-visit.component';
import { DocbookingComponent }              from './docbooking.component';
import { DocbookingCasehistoryComponent }   from './docbooking-casehistory.component';
import { DocbookingGrowthrecordsComponent } from './docbooking-growthrecords.component';
import { DocbookingHealthrecordComponent }  from './docbooking-healthrecord.component';

@NgModule({
    declarations: [
        DocbookingVisitComponent,
        DocbookingComponent,
        DocbookingCasehistoryComponent,
        DocbookingGrowthrecordsComponent,
        DocbookingHealthrecordComponent,
    ],
    exports: [
        DocbookingVisitComponent,
        DocbookingComponent,
        DocbookingCasehistoryComponent,
        DocbookingGrowthrecordsComponent,
        DocbookingHealthrecordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DocbookingRoutingModule,
    ]
})

export class DocbookingModule{

}
