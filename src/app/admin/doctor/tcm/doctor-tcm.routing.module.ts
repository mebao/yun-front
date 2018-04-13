import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { DoctorTcm }                              from './doctor-tcm';
import { DoctorTcmList }                          from './doctor-tcm-list';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorTcm,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: DoctorTcmList,
        }
    ])],
    exports: [RouterModule]
})

export class DoctorTcmRoutingModule{

}
