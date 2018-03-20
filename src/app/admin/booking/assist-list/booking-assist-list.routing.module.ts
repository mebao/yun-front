import { NgModule }              from '@angular/core';
import { RouterModule }          from '@angular/router';

import { AuthGuardRole }         from './../../auth-guard-role.service';

import { BookingAssistList }     from './booking-assist-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingAssistList,
        }
    ])]
})

export class BookingAssistListRoutingModule{

}
