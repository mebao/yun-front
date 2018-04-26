import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { NavModule } from '../nav/nav.module';

import { AngCommonModule } from '../../common/ang-common.module';

import { ActcardRoutingModule } from './actcard.routing.module';

import { Actcard } from './actcard';
import { ActcardList } from './actcard-list';

@NgModule({
    declarations: [
        Actcard,
        ActcardList,
    ],
    exports: [
        Actcard,
        ActcardList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        ActcardRoutingModule,
    ]
})

export class ActcardModule{

}
