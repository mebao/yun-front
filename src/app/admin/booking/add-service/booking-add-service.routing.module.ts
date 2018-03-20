import { NgModule }                      from '@angular/core';
import { RouterModule }                  from '@angular/router';

import { AuthGuardRole }                 from './../../auth-guard-role.service';

import { BookingAddServiceComponent }    from './booking-add-service.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: BookingAddServiceComponent,
        }
    ])]
})

export class BookingAddServiceRoutingModule{

}
