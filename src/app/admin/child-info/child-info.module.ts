import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ChildInfoRoutingModule }            from './child-info.routing.module';

import { ChildInfoComponent }                from './child-info.component';

@NgModule({
    declarations: [
        ChildInfoComponent,
    ],
    exports: [
        ChildInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ChildInfoRoutingModule,
    ]
})

export class ChildInfoModule{

}
