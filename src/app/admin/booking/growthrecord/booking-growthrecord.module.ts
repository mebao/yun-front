import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';

import { NavModule }                        from '../../nav/nav.module';

import { AngCommonModule }                  from '../../../common/ang-common.module';

import { BookingGrowthrecordRoutingModule } from './booking-growthrecord.routing.module';

import { BookingGrowthrecordComponent }     from './booking-growthrecord.component';

@NgModule({
    declarations: [
        BookingGrowthrecordComponent,
    ],
    exports: [
        BookingGrowthrecordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        BookingGrowthrecordRoutingModule,
    ]
})

export class BookingGrowthrecordModule{

}
