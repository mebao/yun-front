import { NgModule }           from '@angular/core';
import { RouterModule }       from '@angular/router';

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forChild([
        {
            path: 'message',
            loadChildren: './message/message.module#MessageModule',
        }
    ])]
})

export class SetupRoutingModule{

}
