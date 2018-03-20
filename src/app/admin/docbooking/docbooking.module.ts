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

@NgModule({
    declarations: [
        DocbookingVisitComponent,
        DocbookingComponent,
    ],
    exports: [
        DocbookingVisitComponent,
        DocbookingComponent,
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
