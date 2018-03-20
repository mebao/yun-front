import { NgModule }                      from '@angular/core';
import { RouterModule }                  from '@angular/router';

import { AuthGuardRole }                 from './../../auth-guard-role.service';

import { BookingFollowupsComponent }     from './booking-followups.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingFollowupsComponent,
        }
    ])]
})

export class BookingFollowupsRoutingModule{

}
