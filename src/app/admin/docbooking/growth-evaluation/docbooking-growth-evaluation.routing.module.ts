import { NgModule }                    from '@angular/core';
import { RouterModule }                from '@angular/router';

import { AuthGuardRole }               from './../../auth-guard-role.service';

import { DocbookingGrowthEvaluation }  from './docbooking-growth-evaluation';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DocbookingGrowthEvaluation,
        }
    ])]
})

export class DocbookingGrowthEvaluationRoutingModule{

}
