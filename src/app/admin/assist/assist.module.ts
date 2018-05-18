import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule }    from 'ng-zorro-antd';

import { NavModule }            from '../nav/nav.module';

import { AngCommonModule }      from '../../common/ang-common.module';

import { AssistRoutingModule }  from './assist.routing.module';

import { AssistComponent }      from './assist.component';
import { AssistListComponent }  from './assist-list.component';

@NgModule({
    declarations: [
        AssistComponent,
        AssistListComponent,
    ],
    exports: [
        AssistComponent,
        AssistListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        AssistRoutingModule,
    ]
})

export class AssistModule{

}
