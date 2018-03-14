import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { InspectResultsPrintRoutingModule }  from './inspect-results-print.routing.module';

import { InspectResultsPrint }               from './inspect-results-print';

@NgModule({
    declarations: [
        InspectResultsPrint,
    ],
    exports: [
        InspectResultsPrint,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        InspectResultsPrintRoutingModule,
    ]
})

export class InspectResultsPrintModule{

}
