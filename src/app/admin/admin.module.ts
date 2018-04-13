import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule }               from 'ng-zorro-antd';

import { AdminComponent }                  from './admin.component';

import { AdminRoutingModule }              from './admin-routing.module';

import { AuthGuardRole }                   from './auth-guard-role.service';

//nav
import { NavModule }                       from './nav/nav.module';

//common
import { AngCommonModule }                 from '../common/ang-common.module';

// pipe
import { PipeModule }                      from '../pipe/pipe.module';

//error
import { PageNotFoundComponent }           from '../error/page-not-found.component';
import { NoPermissionsComponent }          from '../error/no-permissions.component';

import {SelectivePreloadingStrategy}       from '../selective-preloading-strategy';

import { HomeComponent }                   from './home/home.component';
import { BookingComponent }                from './booking/booking.component';
import { UploadComponent }                 from './user/upload.component';
import { DoctorPrescriptComponent }        from './prescript/doctor-prescript.component';
import { DoctorTcmPrescript }              from './prescript/doctor-tcm-prescript';
import { Repage }                          from './booking/repage';
import { UpdatepwdComponent }              from './user/updatepwd.component';

import { AdminService }                    from './admin.service';
import { DoctorService }                   from './doctor/doctor.service';

import { NgZorroAntdModule }               from 'ng-zorro-antd';

@NgModule({
	imports: [
		CommonModule,
		AdminRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		NgZorroAntdModule,
		AngCommonModule,
		NavModule,
		PipeModule,
		NgZorroAntdModule,
	],
	declarations: [
		AdminComponent,
		HomeComponent,
		BookingComponent,
		PageNotFoundComponent,
		NoPermissionsComponent,
		UploadComponent,
		DoctorPrescriptComponent,
		DoctorTcmPrescript,
		Repage,
		UpdatepwdComponent,
	],
	providers: [
		AdminService,
		DoctorService,
		AuthGuardRole,
		SelectivePreloadingStrategy,
	]
})
export class AdminModule{

}
