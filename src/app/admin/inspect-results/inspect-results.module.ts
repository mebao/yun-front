import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { InspectResultsRoutingModule }       from './inspect-results.routing.module';

import { InspectResultsComponent }           from './inspect-results.component';

@NgModule({
    declarations: [
        InspectResultsComponent,
    ],
    exports: [
        InspectResultsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        InspectResultsRoutingModule,
    ]
})

export class InspectResultsModule{

}
