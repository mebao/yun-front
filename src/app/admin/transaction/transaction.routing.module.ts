import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from './../auth-guard-role.service';

import { TransactionRecordListComponent }   from './transaction-record-list.component';
import { TransactionStatisticsComponent }   from './transaction-statistics.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: 'recordList',
            canActivate: [AuthGuardRole],
            component: TransactionRecordListComponent
        },
        {
            path: 'statistics',
            canActivate: [AuthGuardRole],
            component: TransactionRecordListComponent
        }
    ])]
})

export class TransactionRoutingModule{

}
