import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../auth-guard-role.service';

import { InspectResultsPrint }          from './inspect-results-print'

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: InspectResultsPrint
        }
    ])]
})

export class InspectResultsPrintRoutingModule{

}
