import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule }       from 'ng-zorro-antd';

import { NavModule }               from '../nav/nav.module';

import { AngCommonModule }         from '../../common/ang-common.module';

import { MemberRoutingModule }     from './member.routing.module';

import { MemberComponent }         from './member.component';
import { MemberListComponent }     from './member-list.component';

@NgModule({
    declarations: [
        MemberComponent,
        MemberListComponent,
    ],
    exports: [
        MemberComponent,
        MemberListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MemberRoutingModule,
    ]
})

export class MemberModule{

}
