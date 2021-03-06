import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';

import { SchedulingComponent }                  from './scheduling.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: SchedulingComponent,
        },
    ])],
    exports: [RouterModule]
})

export class SchedulingRoutingModule{

}
