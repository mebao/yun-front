import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

import { NavModule }                         from '../nav/nav.module';
import { ENgxPrintModule }                   from 'e-ngx-print';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { InspectResultsRoutingModule }       from './inspect-results.routing.module';

import { InspectResultsComponent }           from './inspect-results.component';
// import { InspectResultsPrint }               from './inspect-results-print';
import { InspectResultsListComponent }       from './inspect-results-list.component';

@NgModule({
    declarations: [
        InspectResultsComponent,
        // InspectResultsPrint,
        InspectResultsListComponent,
    ],
    exports: [
        InspectResultsComponent,
        // InspectResultsPrint,
        InspectResultsListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        InspectResultsRoutingModule,
        ENgxPrintModule,
    ]
})

export class InspectResultsModule{

}
