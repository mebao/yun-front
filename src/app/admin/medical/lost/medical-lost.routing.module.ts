import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalLostComponent }                   from './medical-lost.component';
import { MedicalLostListComponent }               from './medical-lost-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalLostComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MedicalLostListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalLostRoutingModule{

}
