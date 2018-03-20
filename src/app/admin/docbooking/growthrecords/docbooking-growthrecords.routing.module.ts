import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../../auth-guard-role.service';

import { DocbookingGrowthrecordsComponent } from './docbooking-growthrecords.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DocbookingGrowthrecordsComponent,
        },
    ])]
})

export class DocbookingGrowthrecordsRoutingModule{

}
