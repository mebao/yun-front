import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { NavModule }            from '../nav/nav.module';

import { AngCommonModule }      from '../../common/ang-common.module';

import { AssistRoutingModule }  from './assist.routing.module';

import { AssistComponent }      from './assist.component';

@NgModule({
    declarations: [
        AssistComponent,
    ],
    exports: [
        AssistComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        AssistRoutingModule,
    ]
})

export class AssistModule{

}
