import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ChildServiceRoutingModule }         from './child-service.routing.module';

import { ChildServiceComponent }             from './child-service.component';
import { ChildServiceListComponent }         from './child-service-list.component';

@NgModule({
    declarations: [
        ChildServiceComponent,
        ChildServiceListComponent,
    ],
    exports: [
        ChildServiceComponent,
        ChildServiceListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ChildServiceRoutingModule,
    ]
})

export class ChildServiceModule{

}
