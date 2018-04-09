import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

//nav
import { NavModule }                      from '../nav/nav.module';

//common
import { AngCommonModule }                from '../../common/ang-common.module';

import { MaterialRoutingModule }          from './material.routing.module';

import { MaterialComponent }              from './material.component';
import { MaterialListComponent }          from './material-list.component';

@NgModule({
    declarations: [
        MaterialComponent,
        MaterialListComponent,
    ],
    exports: [
        MaterialComponent,
        MaterialListComponent,
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
