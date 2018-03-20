import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../../auth-guard-role.service';

import { DocbookingCasehistoryComponent }   from './docbooking-casehistory.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DocbookingCasehistoryComponent,
        },
    ])]
})

export class DocbookingCasehistoryRoutingModule{

}
