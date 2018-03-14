import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';

import { SchedulingConfigComponent }            from './scheduling-config.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: SchedulingConfigComponent,
        },
    ])],
    exports: [RouterModule]
})

export class SchedulingConfigRoutingModule{

}
