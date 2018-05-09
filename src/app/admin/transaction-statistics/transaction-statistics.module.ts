import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

import { NavModule }                            from '../nav/nav.module';

import { AngCommonModule }                      from '../../common/ang-common.module';

import { TransactionStatisticsRoutingModule }   from './transaction-statistics.routing.module';

import { TransactionStatisticsComponent }       from './transaction-statistics.component';

@NgModule({
    declarations: [
        TransactionStatisticsComponent,
    ],
    exports: [
        TransactionStatisticsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        TransactionStatisticsRoutingModule,
    ]
})

export class TransactionStatisticsModule{

}
