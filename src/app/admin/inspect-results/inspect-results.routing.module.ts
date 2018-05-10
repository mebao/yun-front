import { NgModule }                    from '@angular/core';
import { RouterModule }                from '@angular/router';

import { AuthGuardRole }               from './../auth-guard-role.service';
import { CanDeactivateGuard }          from './../can-deactivate-guard.service';

import { InspectResultsComponent }     from './inspect-results.component';
import { InspectResultsPrint }         from './inspect-results-print';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canDeactivate: [CanDeactivateGuard],
            canActivate: [AuthGuardRole],
            component: InspectResultsComponent
        },
        {
            path: 'print',
            canActivate: [AuthGuardRole],
            component: InspectResultsPrint
        }
    ])]
})

export class InspectResultsRoutingModule{

}
