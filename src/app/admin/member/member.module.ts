import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule }             from '@angular/forms';

import { NavModule }               from '../nav/nav.module';

import { AngCommonModule }         from '../../common/ang-common.module';

import { MemberRoutingModule }     from './member.routing.module';

import { MemberComponent }         from './member.component';

@NgModule({
    declarations: [
        MemberComponent,
    ],
    exports: [
        MemberComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MemberRoutingModule,
    ]
})

export class MemberModule{

}
