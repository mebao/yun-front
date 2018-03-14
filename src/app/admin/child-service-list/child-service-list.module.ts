import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ChildServiceListRoutingModule }     from './child-service-list.routing.module';

import { ChildServiceListComponent }         from './child-service-list.component';

@NgModule({
    declarations: [
        ChildServiceListComponent,
    ],
    exports: [
        ChildServiceListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ChildServiceListRoutingModule,
    ]
})

export class ChildServiceListModule{

}
