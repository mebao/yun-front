import { NgModule }             from '@angular/core';
import { RouterModule }         from '@angular/router';

import { AuthGuardRole }        from './../auth-guard-role.service';

import { AssistComponent }      from './assist.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: AssistComponent,
        }
    ])]
})

export class AssistRoutingModule{

}
