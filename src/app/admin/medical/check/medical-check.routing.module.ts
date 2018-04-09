import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalCheckComponent }                  from './medical-check.component';
import { MedicalCheckListComponent }              from './medical-check-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalCheckComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MedicalCheckListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalCheckRoutingModule{

}
