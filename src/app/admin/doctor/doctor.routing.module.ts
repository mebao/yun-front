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
            path: 'serviceList',
            loadChildren: './service-list/doctor-service-list.module#DoctorServiceListModule',
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
            path: 'recordTempletList',
            loadChildren: './record-templet-list/doctor-record-templet-list.module#DoctorRecordTempletListModule',
        },
        {
            path: 'caseTemplet',
            //canActivate: [AuthGuardRole],
            loadChildren: './case-templet/doctor-case-templet.module#DoctorCaseTempletModule',
        },
        {
            path: 'caseTempletList',
            //canActivate: [AuthGuardRole],
            loadChildren: './case-templet-list/doctor-case-templet-list.module#DoctorCaseTempletListModule',
        },
    ])]
})

export class DoctorRoutingModule{

}
