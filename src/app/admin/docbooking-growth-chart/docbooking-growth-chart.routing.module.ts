import { NgModule }              from '@angular/core';
import { RouterModule }          from '@angular/router';

import { AuthGuardRole }         from './../auth-guard-role.service';

import { DocbookingGrowthChart } from './docbooking-growth-chart';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: 'growthChart',
            canActivate: [AuthGuardRole],
            component: DocbookingGrowthChart,
        }
    ])]
})

export class DocbookingGrowthChartRoutingModule{

}
