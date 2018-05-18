import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule }       from 'ng-zorro-antd';

import { NavModule }               from '../nav/nav.module';

import { AngCommonModule }         from '../../common/ang-common.module';

import { MoutRoutingModule }       from './mout.routing.module';

import { Mout }                    from './mout';
import { MoutList }                from './mout-list';

@NgModule({
    declarations: [
        Mout,
        MoutList,
    ],
    exports: [
        Mout,
        MoutList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MoutRoutingModule,
    ]
})

export class MoutModule{

}
