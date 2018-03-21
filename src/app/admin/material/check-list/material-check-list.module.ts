import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialCheckListRoutingModule }         from './material-check-list.routing.module';

import { MaterialCheckListComponent }             from './material-check-list.component';

@NgModule({
    declarations: [
        MaterialCheckListComponent,
    ],
    exports: [
        MaterialCheckListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialCheckListRoutingModule,
    ]
})

export class MaterialCheckListModule{

}
