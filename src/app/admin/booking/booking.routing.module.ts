import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../auth-guard-role.service';

import { BookingComponent }         from './booking.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingComponent,
        },
        {
            path: 'examine',
            loadChildren: './examine/booking-examine.module#BookingExamineModule',
        },
        {
            path: 'phyexam',
            loadChildren: './phyexam/booking-phyexam.module#BookingPhyexamModule',
        },
    ])]
})

export class BookingRoutingModule{

}
