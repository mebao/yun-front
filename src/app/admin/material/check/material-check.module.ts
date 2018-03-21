import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialCheckRoutingModule }             from './material-check.routing.module';

import { MaterialCheckComponent }                 from './material-check.component';

@NgModule({
    declarations: [
        MaterialCheckComponent,
    ],
    exports: [
        MaterialCheckComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialCheckRoutingModule,
    ]
})

export class MaterialCheckModule{

}
