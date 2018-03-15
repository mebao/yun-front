import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../../auth-guard-role.service';

import { BookingListComponent }     from './booking-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingListComponent,
        }
    ])]
})

export class BookingListRoutingModule{

}
