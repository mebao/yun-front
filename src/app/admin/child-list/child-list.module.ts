import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ChildListRoutingModule }            from './child-list.routing.module';

import { ChildListComponent }                from './child-list.component';

@NgModule({
    declarations: [
        ChildListComponent,
    ],
    exports: [
        ChildListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ChildListRoutingModule,
    ]
})

export class ChildListModule{

}
