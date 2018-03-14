import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../nav/nav.module';

//common
import { AngCommonModule }                      from '../../common/ang-common.module';

import { SchedulingConfigListRoutingModule }    from './scheduling-config-list.routing.module';

import { SchedulingConfigListComponent }        from './scheduling-config-list.component';

@NgModule({
    declarations: [
        SchedulingConfigListComponent,
    ],
    exports: [
        SchedulingConfigListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        SchedulingConfigListRoutingModule,
    ]
})

export class SchedulingConfigListModule{

}
