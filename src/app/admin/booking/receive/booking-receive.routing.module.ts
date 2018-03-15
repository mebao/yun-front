import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../../auth-guard-role.service';

import { BookingReceiveComponent }  from './booking-receive.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingReceiveComponent,
        }
    ])]
})

export class BookingReceiveRoutingModule{

}
