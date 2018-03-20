import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../auth-guard-role.service';

import { DocbookingComponent }              from './docbooking.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DocbookingComponent,
        },
        {
            path: 'visit',
            loadChildren: './visit/docbooking-visit.module#DocbookingVisitModule',
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
