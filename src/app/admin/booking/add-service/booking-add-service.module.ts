import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';

import { NavModule }                       from '../../nav/nav.module';

import { AngCommonModule }                 from '../../../common/ang-common.module';

import { BookingAddServiceRoutingModule }  from './booking-add-service.routing.module';

import { BookingAddServiceComponent }      from './booking-add-service.component';

@NgModule({
    declarations: [
        BookingAddServiceComponent,
    ],
    exports: [
        BookingAddServiceComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        BookingAddServiceRoutingModule,
    ]
})

export class BookingAddServiceModule{

}
