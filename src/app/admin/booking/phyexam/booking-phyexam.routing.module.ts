import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardRole } from '../../auth-guard-role.service';

import { BookingPhyexam } from './booking-phyexam';
import { BookingPhyexamList } from './booking-phyexam-list';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingPhyexam,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: BookingPhyexamList,
        },
    ])],
    exports: [RouterModule]
})

export class BookingPhyexamRoutingModule {

}
