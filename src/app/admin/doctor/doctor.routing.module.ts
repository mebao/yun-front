import { NgModule }                          from '@angular/core';
import { RouterModule }                      from '@angular/router';

import { AuthGuardRole }                     from '../auth-guard-role.service';

import { DoctorListComponent }               from './doctor-list.component';
import { DoctorInfoComponent }               from './doctor-info.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: DoctorListComponent
        },
        {
            path: 'info',
            canActivate: [AuthGuardRole],
            component: DoctorInfoComponent
        },
        {
            path: 'service',
            loadChildren: './service/doctor-service.module#DoctorServiceModule',
        },
        {
            path: 'recordTemplet',
            loadChildren: './record-templet/doctor-record-templet.module#DoctorRecordTempletModule',
        },
        {
            path: 'caseTemplet',
            //canActivate: [AuthGuardRole],
            loadChildren: './case-templet/doctor-case-templet.module#DoctorCaseTempletModule',
        },
    ])]
})

export class DoctorRoutingModule{

}
