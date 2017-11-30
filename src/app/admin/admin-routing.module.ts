import { RouterModule, Routes }              from '@angular/router';
import { NgModule }                         from '@angular/core';

import { AdminComponent }                   from './admin.component';
import { AuthGuard }                        from '../auth-guard.service';
import { AuthGuardRole }                    from './auth-guard-role.service';

import { HomeComponent }                    from './home/home.component';
import { CreateUserComponent }              from './user/create-user.component';
import { BookingComponent }                 from './booking/booking.component';
import { BookingListComponent }             from './booking/booking-list.component';
import { ChildServiceComponent }            from './service/child-service.component';
import { ChildServiceListComponent }        from './service/child-service-list.component';
import { ClinicServiceComponent }           from './service/clinic-service.component';
import { ClinicServiceListComponent }       from './service/clinic-service-list.component';
import { DoctorServiceComponent }           from './service/doctor-service.component';
import { DoctorServiceListComponent }       from './service/doctor-service-list.component';
import { UserListComponent }                from './user/user-list.component';
import { UserInfoComponent }                from './user/user-info.component';
import { DoctorListComponent }              from './user/doctor-list.component';
import { CrmUserListComponent }             from './user/crm-user-list.component';
import { CrmUserComponent }                 from './user/crm-user.component';
import { DoctorInfoComponent }              from './user/doctor-info.component';
import { BookingInComponent }               from './booking/booking-in.component';
import { BookingInfoComponent }             from './booking/booking-info.component';
import { BookingConfirmComponent }          from './booking/booking-confirm.component';
import { PageNotFoundComponent }            from '../error/page-not-found.component';
import { NoPermissionsComponent }             from '../error/no-permissions.component';
import { UploadComponent }                  from './user/upload.component';
import { BookingAddServiceComponent }       from './booking/booking-add-service.component';
import { BookingAddFeeComponent }           from './booking/booking-add-fee.component';
import { ClinicroomComponent }              from './clinicroom/clinicroom.component';
import { ClinicroomListComponent }          from './clinicroom/clinicroom-list.component';
import { ClinicroomRecordsComponent }       from './clinicroom/clinicroom-records.component';
import { DoctorPrescriptComponent }         from './prescript/doctor-prescript.component';
import { BookingChargeComponent }           from './booking/booking-charge.component';
import { DoctorBookingComponent }           from './user/doctor-booking.component';
import { DoctorBookingGrowthrecordsComponent }       from './user/doctor-booking-growthrecords.component';
import { DoctorBookingCasehistoryComponent } from './user/doctor-booking-casehistory.component';
import { DoctorBookingHealthrecordComponent } from './user/doctor-booking-healthrecord.component';
import { SetupInspectComponent }            from './setup/inspect.component';
import { SetupInspectListComponent }        from './setup/inspect-list.component';
import { InspectResultsListComponent }      from './setup/inspect-results-list.component';
import { InspectResultsComponent }          from './setup/inspect-results.component';
import { BookingFollowupsComponent }        from './booking/booking-followups.component';
import { BookingFollowupsListComponent }    from './booking/booking-followups-list.component';
import { BookingGrowthrecordComponent }     from './booking/booking-growthrecord.component';
import { BookingCasehistoryComponent }      from './booking/booking-casehistory.component';
import { ChildListComponent }               from './user/child-list.component';
import { ChildInfoComponent }               from './user/child-info.component';
import { MemberComponent }                  from './setup/member.component';
import { MemberListComponent }              from './setup/member-list.component';
import { TransactionRecordListComponent }   from './user/transaction-record-list.component';
import { BookingPaymentComponent }          from './booking/booking-payment.component';
import { PaymentPrintComponent }            from './booking/payment-print.component';
import { CrmRoleComponent }                 from './user/crm-role.component';
import { CrmRoleListComponent }             from './user/crm-role-list.component';
import { RoleAuthorityListComponent }       from './user/role-authority-list.component';
import { BookingReceiveComponent }          from './booking/booking-receive.component';
import { BookingHealthrecordComponent }     from './booking/booking-healthrecord.component';
import { DoctorRecordTempletComponent }     from './doctor/doctor-record-templet.component';
import { DoctorRecordTempletListComponent } from './doctor/doctor-record-templet-list.component';
import { BookingHistoryComponent }          from './booking/booking-history.component';
import { GivefeeListComponent }             from './user/givefee-list.component';
import { AssistListComponent }              from './setup/assist-list.component';
import { AssistComponent }                  from './setup/assist.component';
import { DoctorVisitComponent }             from './doctor/doctor-visit.component';
import { PaymentBookingFee }                from './booking/payment-booking-fee';
import { Repage }                           from './booking/repage';
import { UpdatepwdComponent }               from './user/updatepwd.component';

const adminRoutes: Routes = [
	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				canActivateChild: [AuthGuard],
				children: [
					{
						path: 'home',
						canActivate: [AuthGuardRole],
						component: HomeComponent
					},
					{
						path: 'createUser',
						canActivate: [AuthGuardRole],
						component: CreateUserComponent
					},
					{
						path: 'booking',
						canActivate: [AuthGuardRole],
						component: BookingComponent
					},
					{
						path: 'bookingList',
						canActivate: [AuthGuardRole],
						component: BookingListComponent
					},
					{
						path: 'childService',
						canActivate: [AuthGuardRole],
						component: ChildServiceComponent
					},
					{
						path: 'childServiceList',
						canActivate: [AuthGuardRole],
						component: ChildServiceListComponent
					},
					{
						path: 'clinicService',
						canActivate: [AuthGuardRole],
						component: ClinicServiceComponent
					},
					{
						path: 'clinicServiceList',
						canActivate: [AuthGuardRole],
						component: ClinicServiceListComponent
					},
					{
						path: 'doctorService',
						canActivate: [AuthGuardRole],
						component: DoctorServiceComponent
					},
					{
						path: 'doctorServiceList',
						canActivate: [AuthGuardRole],
						component: DoctorServiceListComponent
					},
					{
						path: 'userList',
						canActivate: [AuthGuardRole],
						component: UserListComponent
					},
					{
						path: 'userInfo',
						canActivate: [AuthGuardRole],
						component: UserInfoComponent
					},
					{
						path: 'doctorList',
						canActivate: [AuthGuardRole],
						component: DoctorListComponent
					},
					{
						path: 'crmUserList',
						canActivate: [AuthGuardRole],
						component: CrmUserListComponent,
					},
					{
						path: 'crmUser',
						canActivate: [AuthGuardRole],
						component: CrmUserComponent,
					},
					{
						path: 'workbench',
						loadChildren: './workbench/workbench.module#WorkbenchModule',
					},
					{
						path: 'material',
						loadChildren: './material/material.module#MaterialModule',
					},
					{
						path: 'medical',
						loadChildren: './medical/medical.module#MedicalModule',
					},
					{
						path: 'scheduling',
						loadChildren: './scheduling/scheduling.module#SchedulingModule',
					},
					{
						path: 'prescript',
						loadChildren: './prescript/prescript.module#PrescriptModule',
					},
					{
						path: 'authorize',
						loadChildren: './authorize/authorize.module#AuthorizeModule',
					},
					{
						path: 'doctorInfo',
						canActivate: [AuthGuardRole],
						component: DoctorInfoComponent
					},
					{
						path: 'bookingIn',
						canActivate: [AuthGuardRole],
						component: BookingInComponent
					},
					{
						path: 'bookingInfo',
						canActivate: [AuthGuardRole],
						component: BookingInfoComponent
					},
					{
						path: 'bookingConfirm',
						canActivate: [AuthGuardRole],
						component: BookingConfirmComponent
					},
					{
						path: 'upload',
						canActivate: [AuthGuardRole],
						component: UploadComponent
					},
					{
						path: 'bookingAddService',
						canActivate: [AuthGuardRole],
						component: BookingAddServiceComponent
					},
					{
						path: 'bookingAddFee',
						canActivate: [AuthGuardRole],
						component: BookingAddFeeComponent
					},
					{
						path: 'clinicroom',
						canActivate: [AuthGuardRole],
						component: ClinicroomComponent
					},
					{
						path: 'clinicroomList',
						canActivate: [AuthGuardRole],
						component: ClinicroomListComponent
					},
					{
						path: 'clinicroomRecords',
						canActivate: [AuthGuardRole],
						component: ClinicroomRecordsComponent
					},
					{
						path: 'doctorPrescript',
						canActivate: [AuthGuardRole],
						component: DoctorPrescriptComponent
					},
					{
						path: 'noPermissions',
						canActivate: [AuthGuardRole],
						component: NoPermissionsComponent
					},
					{
						path: 'bookingCharge',
						canActivate: [AuthGuardRole],
						component: BookingChargeComponent,
					},
					{
						path: 'doctorBooking',
						canActivate: [AuthGuardRole],
						component: DoctorBookingComponent,
					},
					{
						path: 'doctorBookingGrowthrecords',
						canActivate: [AuthGuardRole],
						component: DoctorBookingGrowthrecordsComponent,
					},
					{
						path: 'doctorBookingCasehistory',
						canActivate: [AuthGuardRole],
						component: DoctorBookingCasehistoryComponent,
					},
					{
						path: 'doctorBookingHealthrecord',
						canActivate: [AuthGuardRole],
						component: DoctorBookingHealthrecordComponent,
					},
					{
						path: 'setupInspect',
						canActivate: [AuthGuardRole],
						component: SetupInspectComponent,
					},
					{
						path: 'setupInspectList',
						canActivate: [AuthGuardRole],
						component: SetupInspectListComponent,
					},
					{
						path: 'inspectResultsList',
						canActivate: [AuthGuardRole],
						component: InspectResultsListComponent,
					},
					{
						path: 'inspectResults',
						canActivate: [AuthGuardRole],
						component: InspectResultsComponent,
					},
					{
						path: 'bookingFollowups',
						canActivate: [AuthGuardRole],
						component: BookingFollowupsComponent,
					},
					{
						path: 'bookingFollowupsList',
						canActivate: [AuthGuardRole],
						component: BookingFollowupsListComponent,
					},
					{
						path: 'bookingGrowthrecord',
						canActivate: [AuthGuardRole],
						component: BookingGrowthrecordComponent,
					},
					{
						path: 'bookingCasehistory',
						canActivate: [AuthGuardRole],
						component: BookingCasehistoryComponent,
					},
					{
						path: 'childList',
						canActivate: [AuthGuardRole],
						component: ChildListComponent,
					},
					{
						path: 'childInfo',
						canActivate: [AuthGuardRole],
						component: ChildInfoComponent,
					},
					{
						path: 'member',
						canActivate: [AuthGuardRole],
						component: MemberComponent,
					},
					{
						path: 'memberList',
						canActivate: [AuthGuardRole],
						component: MemberListComponent,
					},
					{
						path: 'transactionRecordList',
						canActivate: [AuthGuardRole],
						component: TransactionRecordListComponent,
					},
					{
						path: 'bookingPayment',
						canActivate: [AuthGuardRole],
						component: BookingPaymentComponent,
					},
					{
						path: 'paymentPrint',
						canActivate: [AuthGuardRole],
						component: PaymentPrintComponent,
					},
					{
						path: 'crmRole',
						canActivate: [AuthGuardRole],
						component: CrmRoleComponent,
					},
					{
						path: 'crmRoleList',
						canActivate: [AuthGuardRole],
						component: CrmRoleListComponent,
					},
					{
						path: 'roleAuthorityList',
						canActivate: [AuthGuardRole],
						component: RoleAuthorityListComponent,
					},
					{
						path: 'bookingReceive',
						canActivate: [AuthGuardRole],
						component: BookingReceiveComponent,
					},
					{
						path: 'bookingHealthrecord',
						canActivate: [AuthGuardRole],
						component: BookingHealthrecordComponent,
					},
					{
						path: 'doctorRecordTemplet',
						canActivate: [AuthGuardRole],
						component: DoctorRecordTempletComponent,
					},
					{
						path: 'doctorRecordTempletList',
						canActivate: [AuthGuardRole],
						component: DoctorRecordTempletListComponent,
					},
					{
						path: 'bookingHistory',
						canActivate: [AuthGuardRole],
						component: BookingHistoryComponent,
					},
					{
						path: 'givefeeList',
						canActivate: [AuthGuardRole],
						component: GivefeeListComponent,
					},
					{
						path: 'assistList',
						canActivate: [AuthGuardRole],
						component: AssistListComponent,
					},
					{
						path: 'assist',
						canActivate: [AuthGuardRole],
						component: AssistComponent,
					},
					{
						path: 'doctorVisit',
						canActivate: [AuthGuardRole],
						component: DoctorVisitComponent,
					},
					{
						path: 'paymentBookingFee',
						canActivate: [AuthGuardRole],
						component: PaymentBookingFee,
					},
					{
						path: 'repage',
						component: Repage,
					},
					{
						path: 'updatepwd',
						component: UpdatepwdComponent,
					},
					{
						path: '**',
						component: PageNotFoundComponent
					},
				]
			}
		]
	},
]

@NgModule({
	imports: [
		RouterModule.forChild(adminRoutes)
	],
	exports: [
		RouterModule
	]
})
export class AdminRoutingModule{

}
