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
import { CreateUserComponent }             from './user/create-user.component';
import { BookingComponent }                from './booking/booking.component';
import { BookingConfirmComponent }         from './booking/booking-confirm.component';
import { UploadComponent }                 from './user/upload.component';
import { DoctorPrescriptComponent }        from './prescript/doctor-prescript.component';
import { BookingFollowupsComponent }       from './booking/booking-followups.component';
import { BookingFollowupsListComponent }   from './booking/booking-followups-list.component';
import { BookingPaymentComponent }         from './booking/booking-payment.component';
import { PaymentPrintComponent }           from './booking/payment-print.component';
import { CrmRoleComponent }                from './user/crm-role.component';
import { CrmRoleListComponent }            from './user/crm-role-list.component';
import { RoleAuthorityListComponent }      from './user/role-authority-list.component';
import { GivefeeListComponent }            from './user/givefee-list.component';
import { PaymentBookingFee }               from './booking/payment-booking-fee';
import { Repage }                          from './booking/repage';
import { UpdatepwdComponent }              from './user/updatepwd.component';
import { GuazhangList }                    from './user/guazhang-list.component';

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
		CreateUserComponent,
		BookingComponent,
		BookingConfirmComponent,
		PageNotFoundComponent,
		NoPermissionsComponent,
		UploadComponent,
		DoctorPrescriptComponent,
		BookingFollowupsComponent,
		BookingFollowupsListComponent,
		BookingPaymentComponent,
		PaymentPrintComponent,
		CrmRoleComponent,
		CrmRoleListComponent,
		RoleAuthorityListComponent,
		GivefeeListComponent,
		PaymentBookingFee,
		Repage,
		UpdatepwdComponent,
		GuazhangList,
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
