import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

import { NgZorroAntdModule }              from 'ng-zorro-antd';

import { NavModule }                      from '../../nav/nav.module';

import { PipeModule }                     from '../../../pipe/pipe.module';

import { AngCommonModule }                from '../../../common/ang-common.module';

import { BookingFollowupsRoutingModule }  from './booking-followups.routing.module';

import { BookingFollowupsComponent }      from './booking-followups.component';
import { BookingFollowupsListComponent }  from './booking-followups-list.component';

@NgModule({
    declarations: [
        BookingFollowupsComponent,
        BookingFollowupsListComponent,
    ],
    exports: [
        BookingFollowupsComponent,
        BookingFollowupsListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingFollowupsRoutingModule,
    ]
})

export class BookingFollowupsModule{

}
