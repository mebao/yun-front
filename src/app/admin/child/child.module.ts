import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ChildRoutingModule }                from './child.routing.module';

import { ChildListComponent }                from './child-list.component';
import { ChildInfoComponent }                from './child-info.component';

@NgModule({
    declarations: [
        ChildListComponent,
        ChildInfoComponent,
    ],
    exports: [
        ChildListComponent,
        ChildInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        ChildRoutingModule,
    ]
})

export class ChildModule{

}
