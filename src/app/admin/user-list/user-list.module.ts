import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { UserListRoutingModule }             from './user-list.routing.module';

import { UserListComponent }                 from './user-list.component';

@NgModule({
    declarations: [
        UserListComponent,
    ],
    exports: [
        UserListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        UserListRoutingModule,
    ]
})

export class UserListModule{

}
