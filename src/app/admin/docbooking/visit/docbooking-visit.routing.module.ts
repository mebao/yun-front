import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../../auth-guard-role.service';

import { DocbookingVisitComponent }         from './docbooking-visit.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DocbookingVisitComponent,
        },
    ])]
})

export class DocbookingVisitRoutingModule{

}
