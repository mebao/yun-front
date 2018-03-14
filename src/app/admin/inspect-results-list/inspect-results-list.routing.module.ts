import { NgModule }                    from '@angular/core';
import { RouterModule }                from '@angular/router';

import { AuthGuardRole }               from './../auth-guard-role.service';

import { InspectResultsListComponent } from './inspect-results-list.component'

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: InspectResultsListComponent
        }
    ])]
})

export class InspectResultsListRoutingModule{

}
