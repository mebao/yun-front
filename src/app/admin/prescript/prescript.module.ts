import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule, ReactiveFormsModule }     from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';
import { ENgxPrintModule }                      from 'e-ngx-print';

//nav
import { NavModule }                            from '../nav/nav.module';

//common
import { AngCommonModule }                      from '../../common/ang-common.module';

import { PrescriptRoutingModule }               from './prescript.routing.module';

import { PrescriptListComponent }               from './prescript-list.component';
import { PrescriptTcmList }                     from './prescript-tcm-list';

@NgModule({
    declarations: [
        PrescriptListComponent,
        PrescriptTcmList,
    ],
    exports: [
        PrescriptListComponent,
        PrescriptTcmList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ENgxPrintModule,
        NavModule,
        AngCommonModule,
        PrescriptRoutingModule,
    ]
})

export class PrescriptModule{

}
