import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { InspectResultsListRoutingModule }   from './inspect-results-list.routing.module';

import { InspectResultsListComponent }       from './inspect-results-list.component';

@NgModule({
    declarations: [
        InspectResultsListComponent,
    ],
    exports: [
        InspectResultsListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        InspectResultsListRoutingModule,
    ]
})

export class InspectResultsListModule{

}
