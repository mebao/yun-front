import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalLostRoutingModule }               from './medical-lost.routing.module';

import { MedicalLostComponent }                   from './medical-lost.component';
import { MedicalLostListComponent }               from './medical-lost-list.component';

@NgModule({
    declarations: [
        MedicalLostComponent,
        MedicalLostListComponent,
    ],
    exports: [
        MedicalLostComponent,
        MedicalLostListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MedicalLostRoutingModule,
    ]
})

export class MedicalLostModule{

}
