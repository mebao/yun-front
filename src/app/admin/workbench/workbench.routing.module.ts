import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../auth-guard-role.service';
import { WorkbenchReceptionComponent }    from './workbench-reception.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'reception',
            canActivate: [AuthGuardRole],
            component: WorkbenchReceptionComponent,
        }
    ])],
    exports: [RouterModule]
})

export class WorkbenchRoutingModule{

}
