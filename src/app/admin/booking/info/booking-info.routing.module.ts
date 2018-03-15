import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../../auth-guard-role.service';

import { BookingInfoComponent }     from './booking-info.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingInfoComponent,
        }
    ])]
})

export class BookingInfoRoutingModule{

}
