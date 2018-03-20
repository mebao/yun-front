import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../../auth-guard-role.service';

import { DocbookingHealthrecordComponent }  from './docbooking-healthrecord.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DocbookingHealthrecordComponent,
        },
    ])]
})

export class DocbookingHealthrecordRoutingModule{

}
