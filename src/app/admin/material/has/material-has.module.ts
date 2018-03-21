import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialHasRoutingModule }               from './material-has.routing.module';

import { MaterialHasComponent }                   from './material-has.component';

@NgModule({
    declarations: [
        MaterialHasComponent,
    ],
    exports: [
        MaterialHasComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialHasRoutingModule,
    ]
})

export class MaterialHasModule{

}
