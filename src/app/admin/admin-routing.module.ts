import { RouterModule, Routes }             from '@angular/router';
import { NgModule }                         from '@angular/core';

import { AdminComponent }                   from './admin.component';
import { AuthGuard }                        from '../auth-guard.service';
import { AuthGuardRole }                    from './auth-guard-role.service';

import { SelectivePreloadingStrategy }      from '../selective-preloading-strategy';

import { HomeComponent }                    from './home/home.component';
import { CreateUserComponent }              from './user/create-user.component';
import { BookingComponent }                 from './booking/booking.component';
import { PageNotFoundComponent }            from '../error/page-not-found.component';
import { NoPermissionsComponent }             from '../error/no-permissions.component';
import { UploadComponent }                  from './user/upload.component';
import { DoctorPrescriptComponent }         from './prescript/doctor-prescript.component';
import { CrmRoleComponent }                 from './user/crm-role.component';
import { CrmRoleListComponent }             from './user/crm-role-list.component';
import { RoleAuthorityListComponent }       from './user/role-authority-list.component';
import { GivefeeListComponent }             from './user/givefee-list.component';
import { Repage }                           from './booking/repage';
import { UpdatepwdComponent }               from './user/updatepwd.component';
import { GuazhangList }                     from './user/guazhang-list.component';

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
						path: 'workbench',
						loadChildren: './workbench/workbench.module#WorkbenchModule',
					},
					{
						path: 'material',
						loadChildren: './material/material.module#MaterialModule',
						data: {preload: true},
					},
					{
						path: 'medical',
						loadChildren: './medical/medical.module#MedicalModule',
						data: {preload: true},
					},
					{
						path: 'schedulingIndex',
						loadChildren: './scheduling/scheduling.module#SchedulingModule',
					},
					{
						path: 'schedulingConfigList',
						loadChildren: './scheduling-config-list/scheduling-config-list.module#SchedulingConfigListModule',
					},
					{
						path: 'schedulingConfig',
						loadChildren: './scheduling-config/scheduling-config.module#SchedulingConfigModule',
					},
					{
						path: 'prescript',
						loadChildren: './prescript/prescript.module#PrescriptModule',
						data: {preload: true},
					},
					{
						path: 'authorize',
						loadChildren: './authorize/authorize.module#AuthorizeModule',
					},
					{
						path: 'doctor',
						loadChildren: './doctor/doctor.module#DoctorModule',
						data: {preload: true},
					},
					{
						path: 'crmuser',
						loadChildren: './crmuser/crmuser.module#CrmuserModule',
						data: {preload: true},
					},
					{
						path: 'docbooking',
						loadChildren: './docbooking/docbooking.module#DocbookingModule',
						data: {preload: true},
					},
					{
						path: 'memberList',
						loadChildren: './member-list/member-list.module#MemberListModule',
					},
					{
						path: 'member',
						loadChildren: './member/member.module#MemberModule',
					},
					{
						path: 'assistList',
						loadChildren: './assist-list/assist-list.module#AssistListModule',
					},
					{
						path: 'assist',
						loadChildren: './assist/assist.module#AssistModule',
					},
					{
						path: 'setupInspectList',
						loadChildren: './inspect-list/inspect-list.module#InspectListModule',
					},
					{
						path: 'setupInspect',
						loadChildren: './inspect/inspect.module#InspectModule',
					},
					{
						path: 'inspectResultsList',
						loadChildren: './inspect-results-list/inspect-results-list.module#InspectResultsListModule',
					},
					{
						path: 'inspectResults',
						loadChildren: './inspect-results/inspect-results.module#InspectResultsModule',
					},
					{
						path: 'inspectResultsPrint',
						loadChildren: './inspect-results-print/inspect-results-print.module#InspectResultsPrintModule',
					},
					{
						path: 'childServiceList',
						loadChildren: './child-service-list/child-service-list.module#ChildServiceListModule',
					},
					{
						path: 'childService',
						loadChildren: './child-service/child-service.module#ChildServiceModule',
					},
					{
						path: 'clinicServiceList',
						loadChildren: './clinic-service-list/clinic-service-list.module#ClinicServiceListModule',
					},
					{
						path: 'clinicService',
						loadChildren: './clinic-service/clinic-service.module#ClinicServiceModule',
					},
					{
						path: 'clinicroomList',
						loadChildren: './clinicroom-list/clinicroom-list.module#ClinicroomListModule',
					},
					{
						path: 'clinicroomRecords',
						loadChildren: './clinicroom-records/clinicroom-records.module#ClinicroomRecordsModule',
					},
					{
						path: 'clinicroom',
						loadChildren: './clinicroom/clinicroom.module#ClinicroomModule',
					},
					{
						path: 'childList',
						loadChildren: './child-list/child-list.module#ChildListModule',
					},
					{
						path: 'childInfo',
						loadChildren: './child-info/child-info.module#ChildInfoModule',
					},
					{
						path: 'userList',
						loadChildren: './user-list/user-list.module#UserListModule',
					},
					{
						path: 'userInfo',
						loadChildren: './user-info/user-info.module#UserInfoModule',
					},
					{
						path: 'transactionRecordList',
						loadChildren: './transaction-record-list/transaction-record-list.module#TransactionRecordListModule'
					},
					{
						path: 'transactionStatistics',
						loadChildren: './transaction-statistics/transaction-statistics.module#TransactionStatisticsModule',
					},
					{
						path: 'bookingList',
						loadChildren: './booking/list/booking-list.module#BookingListModule',
					},
					{
						path: 'bookingIn',
						loadChildren: './booking/in/booking-in.module#BookingInModule',
					},
					{
						path: 'bookingInfo',
						loadChildren: './booking/info/booking-info.module#BookingInfoModule',
					},
					{
						path: 'bookingReceive',
						loadChildren: './booking/receive/booking-receive.module#BookingReceiveModule',
					},
					{
						path: 'bookingExamineCase',
						loadChildren: './booking/examine-case/booking-examine-case.module#BookingExamineCaseModule',
					},
					{
						path: 'bookingAssistList',
						loadChildren: './booking/assist-list/booking-assist-list.module#BookingAssistListModule',
					},
					{
						path: 'bookingCharge',
						loadChildren: './booking/charge/booking-charge.module#BookingChargeModule',
					},
					{
						path: 'bookingAddFee',
						loadChildren: './booking/add-fee/booking-add-fee.module#BookingAddFeeModule',
					},
					{
						path: 'bookingAddService',
						loadChildren: './booking/add-service/booking-add-service.module#BookingAddServiceModule',
					},
					{
						path: 'bookingCasehistory',
						loadChildren: './booking/casehistory/booking-casehistory.module#BookingCasehistoryModule',
					},
					{
						path: 'bookingHistory',
						loadChildren: './booking/history/booking-history.module#BookingHistoryModule',
					},
					{
						path: 'bookingHealthrecord',
						loadChildren: './booking/healthrecord/booking-healthrecord.module#BookingHealthrecordModule',
					},
					{
						path: 'bookingGrowthrecord',
						loadChildren: './booking/growthrecord/booking-growthrecord.module#BookingGrowthrecordModule',
					},
					{
						path: 'bookingConfirm',
						loadChildren: './booking/confirm/booking-confirm.module#BookingConfirmModule',
					},
					{
						path: 'bookingFollowups',
						loadChildren: './booking/followups/booking-followups.module#BookingFollowupsModule',
					},
					{
						path: 'bookingFollowupsList',
						loadChildren: './booking/followups-list/booking-followups-list.module#BookingFollowupsListModule',
					},
					{
						path: 'bookingPayment',
						loadChildren: './booking/payment/booking-payment.module#BookingPaymentModule',
					},
					{
						path: 'paymentBookingFee',
						loadChildren: './booking/payment-booking-fee/payment-booking-fee.module#PaymentBookingFeeModule',
					},
					{
						path: 'paymentPrint',
						loadChildren: './booking/payment-print/payment-print.module#PaymentPrintModule',
					},
					{
						path: 'upload',
						canActivate: [AuthGuardRole],
						component: UploadComponent
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
						path: 'givefeeList',
						canActivate: [AuthGuardRole],
						component: GivefeeListComponent,
					},
					{
						path: 'guazhangList',
						canActivate: [AuthGuardRole],
						component: GuazhangList,
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
						path: 'setup',
						loadChildren: './setup/setup.module#SetupModule',
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
		RouterModule.forRoot(adminRoutes, {preloadingStrategy: SelectivePreloadingStrategy}),
	],
	exports: [
		RouterModule
	]
})
export class AdminRoutingModule{

}
