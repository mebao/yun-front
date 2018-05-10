import { NgModule }                         from '@angular/core';
import { RouterModule }                     from '@angular/router';

import { AuthGuardRole }                    from '../../auth-guard-role.service';
import { CanDeactivateGuard }               from './../../can-deactivate-guard.service';

import { DocbookingHealthrecordComponent }  from './docbooking-healthrecord.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canDeactivate: [CanDeactivateGuard],
            canActivate: [AuthGuardRole],
            component: DocbookingHealthrecordComponent,
        },
    ])]
})

export class DocbookingHealthrecordRoutingModule{

}
