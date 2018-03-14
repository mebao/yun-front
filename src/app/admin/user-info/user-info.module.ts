import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { UserInfoRoutingModule }             from './user-info.routing.module';

import { UserInfoComponent }                 from './user-info.component';

@NgModule({
    declarations: [
        UserInfoComponent,
    ],
    exports: [
        UserInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        UserInfoRoutingModule,
    ]
})

export class UserInfoModule{

}
