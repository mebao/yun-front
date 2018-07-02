import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalPurchaseRoutingModule }           from './medical-purchase.routing.module';

import { MedicalPurchaseComponent }               from './medical-purchase.component';
import { MedicalPurchaseListComponent }           from './medical-purchase-list.component';

@NgModule({
    declarations: [
        MedicalPurchaseComponent,
        MedicalPurchaseListComponent,
    ],
    exports: [
        MedicalPurchaseComponent,
        MedicalPurchaseListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MedicalPurchaseRoutingModule,
    ]
})

export class MedicalPurchaseModule{

}
