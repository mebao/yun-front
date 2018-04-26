import { RouterModule, Routes }             from '@angular/router';
import { NgModule }                         from '@angular/core';

import { AdminComponent }                   from './admin.component';
import { AuthGuard }                        from '../auth-guard.service';
import { AuthGuardRole }                    from './auth-guard-role.service';

import { SelectivePreloadingStrategy }      from '../selective-preloading-strategy';

import { HomeComponent }                    from './home/home.component';
import { BookingComponent }                 from './booking/booking.component';
import { PageNotFoundComponent }            from '../error/page-not-found.component';
import { NoPermissionsComponent }           from '../error/no-permissions.component';
import { UploadComponent }                  from './user/upload.component';
import { DoctorPrescriptComponent }         from './prescript/doctor-prescript.component';
import { DoctorTcmPrescript }               from './prescript/doctor-tcm-prescript';
import { Repage }                           from './booking/repage';
import { UpdatepwdComponent }               from './user/updatepwd.component';
import { Message }                          from './setup/message.component';

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
						loadChildren: './user/create/user-create.module#UserCreateModule',
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
					},
					{
						path: 'medical',
						loadChildren: './medical/medical.module#MedicalModule',
					},
					{
						path: 'schedulingIndex',
						loadChildren: './scheduling/scheduling.module#SchedulingModule',
					},
					{
						path: 'schedulingConfig',
						loadChildren: './scheduling-config/scheduling-config.module#SchedulingConfigModule',
					},
					{
						path: 'prescript',
						loadChildren: './prescript/prescript.module#PrescriptModule',
					},
					// {
					// 	path: 'authorize',
					// 	loadChildren: './authorize/authorize.module#AuthorizeModule',
					// },
					{
						path: 'doctor',
						loadChildren: './doctor/doctor.module#DoctorModule',
						data: {preload: true},
					},
					{
						path: 'crmuser',
						loadChildren: './crmuser/crmuser.module#CrmuserModule',
					},
					{
						path: 'docbooking',
						loadChildren: './docbooking/docbooking.module#DocbookingModule',
					},
					{
						path: 'member',
						loadChildren: './member/member.module#MemberModule',
					},
					{
						path: 'assist',
						loadChildren: './assist/assist.module#AssistModule',
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
						path: 'childService',
						loadChildren: './child-service/child-service.module#ChildServiceModule',
					},
					{
						path: 'clinicService',
						loadChildren: './clinic-service/clinic-service.module#ClinicServiceModule',
					},
					{
						path: 'clinicroom',
						loadChildren: './clinicroom/clinicroom.module#ClinicroomModule',
					},
					{
						path: 'child',
						loadChildren: './child/child.module#ChildModule',
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
						path: 'bookingExamineHealth',
						loadChildren: './booking/examine-record/booking-examine-record.module#BookingExamineRecordModule',
					},
					{
						path: 'bookingAssistList',
						loadChildren: './booking/assist-list/booking-assist-list.module#BookingAssistListModule',
					},
					{
						path: 'bookingCharge',
						loadChildren: './booking/charge/booking-charge.module#BookingChargeModule',
					},
					// {
					// 	path: 'bookingAddFee',
					// 	loadChildren: './booking/add-fee/booking-add-fee.module#BookingAddFeeModule',
					// },
					// {
					// 	path: 'bookingAddService',
					// 	loadChildren: './booking/add-service/booking-add-service.module#BookingAddServiceModule',
					// },
					// {
					// 	path: 'bookingCasehistory',
					// 	loadChildren: './booking/casehistory/booking-casehistory.module#BookingCasehistoryModule',
					// },
					{
						path: 'bookingHistory',
						loadChildren: './booking/history/booking-history.module#BookingHistoryModule',
					},
					// {
					// 	path: 'bookingHealthrecord',
					// 	loadChildren: './booking/healthrecord/booking-healthrecord.module#BookingHealthrecordModule',
					// },
					// {
					// 	path: 'bookingGrowthrecord',
					// 	loadChildren: './booking/growthrecord/booking-growthrecord.module#BookingGrowthrecordModule',
					// },
					// {
					// 	path: 'bookingConfirm',
					// 	loadChildren: './booking/confirm/booking-confirm.module#BookingConfirmModule',
					// },
					{
						path: 'bookingFollowups',
						loadChildren: './booking/followups/booking-followups.module#BookingFollowupsModule',
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
						path: 'bookingUpdate',
						loadChildren: './booking/update/booking-update.module#BookingUpdateModule',
					},
					{
						path: 'bookingUpdateInfo',
						loadChildren: './booking/update-info/booking-update-info.module#BookingUpdateInfoModule',
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
						path: 'doctorTcmPrescript',
						canActivate: [AuthGuardRole],
						component: DoctorTcmPrescript
					},
					{
						path: 'noPermissions',
						canActivate: [AuthGuardRole],
						component: NoPermissionsComponent
					},
					{
						path: 'crmRole',
						loadChildren: './crm/role/crm-role.module#CrmRoleModule',
					},
					{
						path: 'roleAuthorityList',
						loadChildren: './crm/role-authority-list/role-authority-list.module#RoleAuthorityListModule',
					},
					{
						path: 'givefeeList',
						loadChildren: './givefee-list/givefee-list.module#GivefeeListModule',
					},
					{
						path: 'guazhangList',
						loadChildren: './guazhang-list/guazhang-list.module#GuazhangListModule',
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
						path: 'setupMessage',
						component: Message
					},
					{
						path: 'actcard',
						loadChildren: './actcard/actcard.module#ActcardModule',
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
