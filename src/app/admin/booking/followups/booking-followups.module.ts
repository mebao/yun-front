import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

import { NavModule }                      from '../../nav/nav.module';

import { PipeModule }                     from '../../../pipe/pipe.module';

import { AngCommonModule }                from '../../../common/ang-common.module';

import { BookingFollowupsRoutingModule }  from './booking-followups.routing.module';

import { BookingFollowupsComponent }      from './booking-followups.component';

@NgModule({
    declarations: [
        BookingFollowupsComponent,
    ],
    exports: [
        BookingFollowupsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingFollowupsRoutingModule,
    ]
})

export class BookingFollowupsModule{

}
