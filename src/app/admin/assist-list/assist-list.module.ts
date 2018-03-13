import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NavModule }                 from '../nav/nav.module';

import { AngCommonModule }           from '../../common/ang-common.module';

import { AssistListRoutingModule }   from './assist-list.routing.module';

import { AssistListComponent }       from './assist-list.component';

@NgModule({
    declarations: [
        AssistListComponent,
    ],
    exports: [
        AssistListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        AssistListRoutingModule,
    ]
})

export class AssistListModule{

}
