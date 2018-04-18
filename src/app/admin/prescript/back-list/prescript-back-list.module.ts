import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

//nav
import { NavModule }                            from '../../nav/nav.module';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { PrescriptBackListRoutingModule }       from './prescript-back-list.routing.module';

import { PrescriptBackListComponent }           from './prescript-back-list.component';

@NgModule({
    declarations: [
        PrescriptBackListComponent,
    ],
    exports: [
        PrescriptBackListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        PrescriptBackListRoutingModule,
    ]
})

export class PrescriptBackListModule{

}
