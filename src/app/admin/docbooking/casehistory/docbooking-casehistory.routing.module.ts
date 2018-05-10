import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../../auth-guard-role.service';
import { CanDeactivateGuard }               from './../../can-deactivate-guard.service';

import { DocbookingCasehistoryComponent }   from './docbooking-casehistory.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canDeactivate: [CanDeactivateGuard],
            canActivate: [AuthGuardRole],
            component: DocbookingCasehistoryComponent,
        },
    ])]
})

export class DocbookingCasehistoryRoutingModule{

}
