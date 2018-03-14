import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../nav/nav.module';

//common
import { AngCommonModule }                      from '../../common/ang-common.module';

import { SchedulingConfigRoutingModule }        from './scheduling-config.routing.module';

import { SchedulingConfigComponent }            from './scheduling-config.component';

@NgModule({
    declarations: [
        SchedulingConfigComponent,
    ],
    exports: [
        SchedulingConfigComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        SchedulingConfigRoutingModule,
    ]
})

export class SchedulingConfigModule{

}
