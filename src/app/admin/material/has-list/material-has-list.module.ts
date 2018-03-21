import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialHasListRoutingModule }           from './material-has-list.routing.module';

import { MaterialHasListComponent }               from './material-has-list.component';

@NgModule({
    declarations: [
        MaterialHasListComponent,
    ],
    exports: [
        MaterialHasListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialHasListRoutingModule,
    ]
})

export class MaterialHasListModule{

}
