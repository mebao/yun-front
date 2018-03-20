import { NgModule }                           from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { FormsModule }                        from '@angular/forms';

import { NavModule }                          from '../../nav/nav.module';

import { PipeModule }                         from '../../../pipe/pipe.module';

import { AngCommonModule }                    from '../../../common/ang-common.module';

import { BookingFollowupsListRoutingModule }  from './booking-followups-list.routing.module';

import { BookingFollowupsListComponent }      from './booking-followups-list.component';

@NgModule({
    declarations: [
        BookingFollowupsListComponent,
    ],
    exports: [
        BookingFollowupsListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingFollowupsListRoutingModule,
    ]
})

export class BookingFollowupsListModule{

}
