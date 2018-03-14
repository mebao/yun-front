import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NavModule }                 from '../nav/nav.module';

import { AngCommonModule }           from '../../common/ang-common.module';

import { InspectListRoutingModule }  from './inspect-list.routing.module';

import { SetupInspectListComponent } from './inspect-list.component';

@NgModule({
    declarations: [
        SetupInspectListComponent,
    ],
    exports: [
        SetupInspectListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        InspectListRoutingModule,
    ]
})

export class InspectListModule{

}
