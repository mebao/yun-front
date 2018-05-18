import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

import { NavModule }                            from '../nav/nav.module';

import { AngCommonModule }                      from '../../common/ang-common.module';

import { TransactionRoutingModule }             from './transaction.routing.module';

import { TransactionRecordListComponent }       from './transaction-record-list.component';
import { TransactionStatisticsComponent }       from './transaction-statistics.component';

@NgModule({
    declarations: [
        TransactionRecordListComponent,
        TransactionStatisticsComponent,
    ],
    exports: [
        TransactionRecordListComponent,
        TransactionStatisticsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        TransactionRoutingModule,
    ]
})

export class TransactionModule{

}
