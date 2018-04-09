import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';

import { SchedulingConfigComponent }            from './scheduling-config.component';
import { SchedulingConfigListComponent }        from './scheduling-config-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: SchedulingConfigComponent,
        },
        {
            path: 'list',
            // canActivate: [AuthGuardRole],
            component: SchedulingConfigListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class SchedulingConfigRoutingModule{

}
