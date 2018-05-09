import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

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
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        InspectResultsListRoutingModule,
    ]
})

export class InspectResultsListModule{

}
