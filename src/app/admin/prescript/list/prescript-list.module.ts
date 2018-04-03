import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { ENgxPrintModule }                      from 'e-ngx-print';

//nav
import { NavModule }                            from '../../nav/nav.module';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { PrescriptListRoutingModule }           from './prescript-list.routing.module';

import { PrescriptListComponent }               from './prescript-list.component';

@NgModule({
    declarations: [
        PrescriptListComponent,
    ],
    exports: [
        PrescriptListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ENgxPrintModule,
        NavModule,
        AngCommonModule,
        PrescriptListRoutingModule,
        NgZorroAntdModule,
    ]
})

export class PrescriptListModule{

}
