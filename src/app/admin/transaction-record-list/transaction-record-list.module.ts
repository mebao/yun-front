import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

import { NavModule }                            from '../nav/nav.module';

import { AngCommonModule }                      from '../../common/ang-common.module';

import { TransactionRecordListRoutingModule }   from './transaction-record-list.routing.module';

import { TransactionRecordListComponent }       from './transaction-record-list.component';

@NgModule({
    declarations: [
        TransactionRecordListComponent,
    ],
    exports: [
        TransactionRecordListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        TransactionRecordListRoutingModule,
    ]
})

export class TransactionRecordListModule{

}
