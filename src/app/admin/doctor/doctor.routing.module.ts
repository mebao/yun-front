import { NgModule }                              from '@angular/core';
import { RouterModule }                          from '@angular/router';

import { AuthGuardRole }                         from '../auth-guard-role.service';

import { DoctorServiceListComponent }            from './doctor-service-list.component';
import { DoctorServiceComponent }                from './doctor-service.component';
import { DoctorRecordTempletListComponent }      from './doctor-record-templet-list.component';
import { DoctorRecordTempletComponent }          from './doctor-record-templet.component';
import { DoctorCaseTempletListComponent }        from './doctor-case-templet-list.component';
import { DoctorCaseTempletComponent }            from './doctor-case-templet.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'list',
            loadChildren: './list/doctor-list.module#DoctorListModule',
        },
        {
            path: 'serviceList',
            canActivate: [AuthGuardRole],
            component: DoctorServiceListComponent,
        },
        {
            path: 'service',
            canActivate: [AuthGuardRole],
            component: DoctorServiceComponent,
        },
        {
            path: 'info',
            loadChildren: './info/doctor-info.module#DoctorInfoModule',
        },
        {
            path: 'recordTemplet',
            canActivate: [AuthGuardRole],
            component: DoctorRecordTempletComponent,
        },
        {
            path: 'recordTempletList',
            canActivate: [AuthGuardRole],
            component: DoctorRecordTempletListComponent,
        },
        {
            path: 'caseTemplet',
            //canActivate: [AuthGuardRole],
            component: DoctorCaseTempletComponent,
        },
        {
            path: 'caseTempletList',
            //canActivate: [AuthGuardRole],
            component: DoctorCaseTempletListComponent,
        },
    ])]
})

export class DoctorRoutingModule{

}
