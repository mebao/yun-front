import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';

import { SchedulingConfigListComponent }        from './scheduling-config-list.component';
import { SchedulingConfigComponent }            from './scheduling-config.component';
import { SchedulingComponent }                  from './scheduling.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'configList',
            canActivate: [AuthGuardRole],
            component: SchedulingConfigListComponent,
        },
        {
            path: 'config',
            canActivate: [AuthGuardRole],
            component: SchedulingConfigComponent,
        },
        {
            path: 'index',
            canActivate: [AuthGuardRole],
            component: SchedulingComponent,
        },
    ])],
    exports: [RouterModule]
})

export class SchedulingRoutingModule{

}
