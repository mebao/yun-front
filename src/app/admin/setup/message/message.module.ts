import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';

import { NavModule }              from '../../nav/nav.module';

import { AngCommonModule }        from '../../../common/ang-common.module';

import { MessageRoutingModule }   from './message.routing.module';

import { Message }                from './message.component';

@NgModule({
    declarations: [
        Message,
    ],
    exports: [
        Message,
    ],
    imports: [
        CommonModule,
        NavModule,
        AngCommonModule,
        MessageRoutingModule,
    ]
})

export class MessageModule{

}
