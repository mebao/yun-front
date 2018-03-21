import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialLostListRoutingModule }          from './material-lost-list.routing.module';

import { MaterialLostListComponent }              from './material-lost-list.component';

@NgModule({
    declarations: [
        MaterialLostListComponent,
    ],
    exports: [
        MaterialLostListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialLostListRoutingModule,
    ]
})

export class MaterialLostListModule{

}
