import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FormsModule }              from '@angular/forms';

import { NavModule }                from '../nav/nav.module';

import { AngCommonModule }          from '../../common/ang-common.module';

import { MemberListRoutingModule }  from './member-list.routing.module';

import { MemberListComponent }      from './member-list.component';

@NgModule({
    declarations: [
        MemberListComponent,
    ],
    exports: [
        MemberListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MemberListRoutingModule,
    ]
})

export class MemberListModule{

}
