import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalHasComponent }                    from './medical-has.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalHasComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalHasRoutingModule{

}
