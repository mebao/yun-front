import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';

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
import { Repage }                          from './booking/repage';
import { UpdatepwdComponent }              from './user/updatepwd.component';

import { AdminService }                    from './admin.service';
import { DoctorService }                   from './doctor/doctor.service';

@NgModule({
	imports: [
		CommonModule,
		AdminRoutingModule,
		FormsModule,
		AngCommonModule,
		NavModule,
		PipeModule,
	],
	declarations: [
		AdminComponent,
		HomeComponent,
		BookingComponent,
		PageNotFoundComponent,
		NoPermissionsComponent,
		UploadComponent,
		DoctorPrescriptComponent,
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
