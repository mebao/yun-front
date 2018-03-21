import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

//nav
import { NavModule }                      from '../nav/nav.module';

//common
import { AngCommonModule }                from '../../common/ang-common.module';

import { MaterialRoutingModule }          from './material.routing.module';

import { MaterialComponent }              from './material.component';

@NgModule({
    declarations: [
        MaterialComponent,
    ],
    exports: [
        MaterialComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialRoutingModule,
    ]
})

export class MaterialModule{

}
