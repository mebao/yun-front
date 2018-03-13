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

//error
import { PageNotFoundComponent }           from '../error/page-not-found.component';
import { NoPermissionsComponent }          from '../error/no-permissions.component';

import {SelectivePreloadingStrategy}       from '../selective-preloading-strategy';

import { HomeComponent }                   from './home/home.component';
import { CreateUserComponent }             from './user/create-user.component';
import { BookingComponent }                from './booking/booking.component';
import { BookingListComponent }            from './booking/booking-list.component';
import { ChildServiceComponent }           from './service/child-service.component';
import { ChildServiceListComponent }       from './service/child-service-list.component';
import { ClinicServiceComponent }          from './service/clinic-service.component';
import { ClinicServiceListComponent }      from './service/clinic-service-list.component';
import { UserListComponent }               from './user/user-list.component';
import { UserInfoComponent }               from './user/user-info.component';
import { BookingInComponent }              from './booking/booking-in.component';
import { BookingInfoComponent }            from './booking/booking-info.component';
import { BookingConfirmComponent }         from './booking/booking-confirm.component';
import { UploadComponent }                 from './user/upload.component';
import { BookingAddServiceComponent }      from './booking/booking-add-service.component';
import { BookingAddFeeComponent }          from './booking/booking-add-fee.component';
import { ClinicroomComponent }             from './clinicroom/clinicroom.component';
import { ClinicroomListComponent }         from './clinicroom/clinicroom-list.component';
import { ClinicroomRecordsComponent }      from './clinicroom/clinicroom-records.component';
import { DoctorPrescriptComponent }        from './prescript/doctor-prescript.component';
import { BookingChargeComponent }          from './booking/booking-charge.component';
import { SetupInspectComponent }           from './setup/inspect.component';
import { SetupInspectListComponent }       from './setup/inspect-list.component';
import { InspectResultsListComponent }     from './setup/inspect-results-list.component';
import { InspectResultsComponent }         from './setup/inspect-results.component';
import { BookingFollowupsComponent }       from './booking/booking-followups.component';
import { BookingFollowupsListComponent }   from './booking/booking-followups-list.component';
import { BookingGrowthrecordComponent }    from './booking/booking-growthrecord.component';
import { BookingCasehistoryComponent }     from './booking/booking-casehistory.component';
import { ChildListComponent }              from './user/child-list.component';
import { ChildInfoComponent }              from './user/child-info.component';
import { TransactionRecordListComponent }  from './user/transaction-record-list.component';
import { TransactionStatisticsComponent }  from './user/transaction-statistics.component';
import { BookingPaymentComponent }         from './booking/booking-payment.component';
import { PaymentPrintComponent }           from './booking/payment-print.component';
import { CrmRoleComponent }                from './user/crm-role.component';
import { CrmRoleListComponent }            from './user/crm-role-list.component';
import { RoleAuthorityListComponent }      from './user/role-authority-list.component';
import { BookingReceiveComponent }         from './booking/booking-receive.component';
import { BookingHealthrecordComponent }    from './booking/booking-healthrecord.component';
import { BookingHistoryComponent }         from './booking/booking-history.component';
import { GivefeeListComponent }            from './user/givefee-list.component';
import { AssistListComponent }             from './setup/assist-list.component';
import { AssistComponent }                 from './setup/assist.component';
import { PaymentBookingFee }               from './booking/payment-booking-fee';
import { Repage }                          from './booking/repage';
import { UpdatepwdComponent }              from './user/updatepwd.component';
import { GuazhangList }                    from './user/guazhang-list.component';
import { InspectResultsPrint }             from './setup/inspect-results-print';
import { BookingAssistList }               from './booking/booking-assist-list.component';

import { AdminService }                    from './admin.service';
import { DoctorService }                   from './doctor/doctor.service';

import { ToDecimal2Pipe }                  from '../pipe/toDecimal2.pipe';

@NgModule({
	imports: [
		CommonModule,
		AdminRoutingModule,
		FormsModule,
		AngCommonModule,
		NavModule,
	],
	declarations: [
		AdminComponent,
		HomeComponent,
		CreateUserComponent,
		BookingComponent,
		BookingListComponent,
		BookingInComponent,
		BookingInfoComponent,
		ChildServiceComponent,
		ChildServiceListComponent,
		ClinicServiceComponent,
		ClinicServiceListComponent,
		UserListComponent,
		UserInfoComponent,
		BookingConfirmComponent,
		PageNotFoundComponent,
		NoPermissionsComponent,
		UploadComponent,
		BookingAddServiceComponent,
		BookingAddFeeComponent,
		ClinicroomComponent,
		ClinicroomListComponent,
		ClinicroomRecordsComponent,
		DoctorPrescriptComponent,
		BookingChargeComponent,
		SetupInspectComponent,
		SetupInspectListComponent,
		InspectResultsListComponent,
		InspectResultsComponent,
		BookingFollowupsComponent,
		BookingFollowupsListComponent,
		BookingGrowthrecordComponent,
		BookingCasehistoryComponent,
		ChildListComponent,
		ChildInfoComponent,
		TransactionRecordListComponent,
		TransactionStatisticsComponent,
		BookingPaymentComponent,
		PaymentPrintComponent,
		CrmRoleComponent,
		CrmRoleListComponent,
		RoleAuthorityListComponent,
		BookingReceiveComponent,
		BookingHealthrecordComponent,
		BookingHistoryComponent,
		GivefeeListComponent,
		AssistListComponent,
		AssistComponent,
		PaymentBookingFee,
		Repage,
		UpdatepwdComponent,
		GuazhangList,
		ToDecimal2Pipe,
		InspectResultsPrint,
		BookingAssistList,
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
