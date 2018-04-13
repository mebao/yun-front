import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule, ReactiveFormsModule }       from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { TcmRoutingModule }                       from './tcm.routing.module';

import { Tcm }                                    from './tcm';
import { TcmList }                                from './tcm-list';
import { TcmPurchase }                            from './tcm-purchase';
import { TcmPurchaseList }                        from './tcm-purchase-list';
import { TcmHasList }                             from './tcm-has-list';
import { TcmLostList }                            from './tcm-lost-list';
import { TcmLost }                                from './tcm-lost';
import { TcmCheckList }                           from './tcm-check-list';
import { TcmCheck }                               from './tcm-check';

@NgModule({
    declarations: [
        Tcm,
        TcmList,
        TcmPurchase,
        TcmPurchaseList,
        TcmHasList,
        TcmLostList,
        TcmLost,
        TcmCheckList,
        TcmCheck,
    ],
    exports: [
        Tcm,
        TcmList,
        TcmPurchase,
        TcmPurchaseList,
        TcmHasList,
        TcmLostList,
        TcmLost,
        TcmCheckList,
        TcmCheck,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        TcmRoutingModule,
    ]
})

export class TcmModule{

}
