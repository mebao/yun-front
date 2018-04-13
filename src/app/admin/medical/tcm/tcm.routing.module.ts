import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

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
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: Tcm,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: TcmList,
        },
        {
            path: 'purchaseList',
            canActivate: [AuthGuardRole],
            component: TcmPurchaseList,
        },
        {
            path: 'purchase',
            canActivate: [AuthGuardRole],
            component: TcmPurchase,
        },
        {
            path: 'hasList',
            canActivate: [AuthGuardRole],
            component: TcmHasList,
        },
        {
            path: 'lostList',
            canActivate: [AuthGuardRole],
            component: TcmLostList,
        },
        {
            path: 'lost',
            canActivate: [AuthGuardRole],
            component: TcmLost,
        },
        {
            path: 'checkList',
            canActivate: [AuthGuardRole],
            component: TcmCheckList,
        },
        {
            path: 'check',
            canActivate: [AuthGuardRole],
            component: TcmCheck,
        }
    ])],
    exports: [RouterModule]
})

export class TcmRoutingModule{

}
