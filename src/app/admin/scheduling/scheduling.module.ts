import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

//nav
import { NavModule }                            from '../nav/nav.module';

//common
import { AngCommonModule }                      from '../../common/ang-common.module';

import { SchedulingRoutingModule }              from './scheduling.routing.module';

import { SchedulingComponent }                  from './scheduling.component';

@NgModule({
    declarations: [
        SchedulingComponent,
    ],
    exports: [
        SchedulingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        SchedulingRoutingModule,
    ]
})

export class SchedulingModule{

}
