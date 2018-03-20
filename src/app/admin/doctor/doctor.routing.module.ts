import { NgModule }                              from '@angular/core';
import { RouterModule }                          from '@angular/router';

import { AuthGuardRole }                         from '../auth-guard-role.service';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'list',
            loadChildren: './list/doctor-list.module#DoctorListModule',
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
            path: 'info',
            loadChildren: './info/doctor-info.module#DoctorInfoModule',
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
