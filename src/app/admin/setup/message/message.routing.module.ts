import { NgModule }                from '@angular/core';
import { RouterModule }            from '@angular/router';

import { Message }                 from './message.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: Message,
        }
    ])]
})

export class MessageRoutingModule{

}
