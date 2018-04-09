import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalHasComponent }                    from './medical-has.component';
import { MedicalHasListComponent }                from './medical-has-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalHasComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MedicalHasListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalHasRoutingModule{

}
