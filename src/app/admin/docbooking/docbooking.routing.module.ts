import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../auth-guard-role.service';

import { DocbookingVisitComponent }         from './docbooking-visit.component';
import { DocbookingComponent }              from './docbooking.component';

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
            loadChildren: './growthrecords/docbooking-growthrecords.module#DocbookingGrowthrecordsModule',
        },
        {
            path: 'casehistory',
            loadChildren: './casehistory/docbooking-casehistory.module#DocbookingCasehistoryModule',
        },
        {
            path: 'healthrecord',
            loadChildren: './healthrecord/docbooking-healthrecord.module#DocbookingHealthrecordModule',
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
