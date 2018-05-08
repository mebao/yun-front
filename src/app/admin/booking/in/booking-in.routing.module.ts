import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../../auth-guard-role.service';
import { CanDeactivateGuard }       from './../../can-deactivate-guard.service';

import { BookingInComponent }       from './booking-in.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canDeactivate: [CanDeactivateGuard],
            canActivate: [AuthGuardRole],
            component: BookingInComponent,
        }
    ])]
})

export class BookingInRoutingModule{

}
