import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';
import { ENgxPrintModule }                      from 'e-ngx-print';

//nav
import { NavModule }                            from '../nav/nav.module';

//common
import { AngCommonModule }                      from '../../common/ang-common.module';

import { PrescriptRoutingModule }               from './prescript.routing.module';

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
        NgZorroAntdModule,
        ENgxPrintModule,
        NavModule,
        AngCommonModule,
        PrescriptRoutingModule,
    ]
})

export class PrescriptModule{

}
