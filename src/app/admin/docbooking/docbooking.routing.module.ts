import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../auth-guard-role.service';

import { DocbookingVisitComponent }         from './docbooking-visit.component';
import { DocbookingComponent }              from './docbooking.component';
import { DocbookingCasehistoryComponent }   from './docbooking-casehistory.component';
import { DocbookingGrowthrecordsComponent } from './docbooking-growthrecords.component';
import { DocbookingHealthrecordComponent }  from './docbooking-healthrecord.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'visit',
            canActivate: [AuthGuardRole],
            component: DocbookingVisitComponent,
        },
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DocbookingComponent,
        },
        {
            path: 'growthrecords',
            canActivate: [AuthGuardRole],
            component: DocbookingGrowthrecordsComponent,
        },
        {
            path: 'casehistory',
            canActivate: [AuthGuardRole],
            component: DocbookingCasehistoryComponent,
        },
        {
            path: 'healthrecord',
            canActivate: [AuthGuardRole],
            component: DocbookingHealthrecordComponent,
        },
        {
            path: 'growthChart',
            loadChildren: './growth-chart/docbooking-growth-chart.module#DocbookingGrowthChartModule',
        },
        {
            path: 'growthEvaluation',
            loadChildren: './growth-evaluation/docbooking-growth-evaluation.module#DocbookingGrowthEvaluationModule',
        },
    ])]
})

export class DocbookingRoutingModule{

}
