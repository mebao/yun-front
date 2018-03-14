import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule }             from '@angular/forms';

import { NavModule }               from '../nav/nav.module';

import { AngCommonModule }         from '../../common/ang-common.module';

import { InspectRoutingModule }    from './inspect.routing.module';

import { SetupInspectComponent }   from './inspect.component';

@NgModule({
    declarations: [
        SetupInspectComponent,
    ],
    exports: [
        SetupInspectComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        InspectRoutingModule,
    ]
})

export class InspectModule{

}
