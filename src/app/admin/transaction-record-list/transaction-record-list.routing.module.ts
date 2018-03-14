import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from './../auth-guard-role.service';

import { TransactionRecordListComponent }   from './transaction-record-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: TransactionRecordListComponent
        }
    ])]
})

export class TransactionRecordListRoutingModule{

}
