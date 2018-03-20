import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NavModule }                 from '../../nav/nav.module';

import { PipeModule }                from '../../../pipe/pipe.module';

import { AngCommonModule }           from '../../../common/ang-common.module';

import { PaymentPrintRoutingModule } from './payment-print.routing.module';

import { PaymentPrintComponent }     from './payment-print.component';

@NgModule({
    declarations: [
        PaymentPrintComponent,
    ],
    exports: [
        PaymentPrintComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        PaymentPrintRoutingModule,
    ]
})

export class PaymentPrintModule{

}
