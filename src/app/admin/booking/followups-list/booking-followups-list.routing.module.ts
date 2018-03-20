import { NgModule }                          from '@angular/core';
import { RouterModule }                      from '@angular/router';

import { AuthGuardRole }                     from './../../auth-guard-role.service';

import { BookingFollowupsListComponent }     from './booking-followups-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingFollowupsListComponent,
        }
    ])]
})

export class BookingFollowupsListRoutingModule{

}
