import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { FormsModule }                from '@angular/forms';

import { NgZorroAntdModule }          from 'ng-zorro-antd';

import { NavModule }                  from '../nav/nav.module';

import { AngCommonModule }            from '../../common/ang-common.module';

import { InspectRoutingModule }       from './inspect.routing.module';

import { SetupInspectComponent }      from './inspect.component';
import { SetupInspectListComponent }  from './inspect-list.component';

@NgModule({
    declarations: [
        SetupInspectComponent,
        SetupInspectListComponent,
    ],
    exports: [
        SetupInspectComponent,
        SetupInspectListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        InspectRoutingModule,
    ]
})

export class InspectModule{

}
