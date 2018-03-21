import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialListRoutingModule }              from './material-list.routing.module';

import { MaterialListComponent }                  from './material-list.component';

@NgModule({
    declarations: [
        MaterialListComponent,
    ],
    exports: [
        MaterialListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialListRoutingModule,
    ]
})

export class MaterialListModule{

}
