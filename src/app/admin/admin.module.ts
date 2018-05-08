import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule }               from 'ng-zorro-antd';

import { AdminComponent }                  from './admin.component';

import { AdminRoutingModule }              from './admin-routing.module';

import { AuthGuardRole }                   from './auth-guard-role.service';
import { CanDeactivateGuard }              from './can-deactivate-guard.service';
import { DialogService }                   from './dialog.service';

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
import { Message }                         from './setup/message.component';

import { AdminService }                    from './admin.service';
import { NewService }                      from './new.service';
import { DoctorService }                   from './doctor/doctor.service';

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
		Message,
	],
	providers: [
		AdminService,
		NewService,
		DoctorService,
		AuthGuardRole,
		CanDeactivateGuard,
		DialogService,
		SelectivePreloadingStrategy,
	]
})
export class AdminModule{

}
