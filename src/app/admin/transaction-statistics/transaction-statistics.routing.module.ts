import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from './../auth-guard-role.service';

import { TransactionStatisticsComponent }   from './transaction-statistics.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: TransactionStatisticsComponent
        }
    ])]
})

export class TransactionStatisticsRoutingModule{

}
