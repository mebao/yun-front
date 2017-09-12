import { RouterModule, Routes }              from '@angular/router';
import { NgModule }                         from '@angular/core';

import { AdminComponent }                   from './admin.component';
import { AuthGuard }                        from '../auth-guard.service';
import { AuthGuardRole }                    from './auth-guard-role.service';

import { HomeComponent }                    from './home/home.component';
import { CreateUserComponent }              from './user/create-user.component';
import { SchedulingConfigListComponent }    from './scheduling/scheduling-config-list.component';
import { SchedulingConfigComponent }        from './scheduling/scheduling-config.component';
import { SchedulingComponent }              from './scheduling/scheduling.component';
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
import { WorkbenchReceptionComponent }      from './workbench/workbench-reception.component';
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
import { MedicalComponent }                 from './medical/medical.component';
import { MedicalListComponent }             from './medical/medical-list.component';
import { MedicalSupplierComponent }         from './medical/medical-supplier.component';
import { MedicalSupplierListComponent }     from './medical/medical-supplier-list.component';
import { MedicalPurchaseComponent }         from './medical/medical-purchase.component';
import { MedicalPurchaseListComponent }     from './medical/medical-purchase-list.component';
import { MedicalHasListComponent }          from './medical/medical-has-list.component';
import { MedicalHasComponent }              from './medical/medical-has.component';
import { MedicalLostListComponent }         from './medical/medical-lost-list.component';
import { MedicalLostComponent }             from './medical/medical-lost.component';
import { DoctorPrescriptComponent }         from './prescript/doctor-prescript.component';
import { PrescriptListComponent }           from './prescript/prescript-list.component';
import { BookingChargeComponent }           from './booking/booking-charge.component';
import { DoctorBookingComponent }           from './user/doctor-booking.component';
import { SetupInspectComponent }            from './setup/inspect.component';
import { SetupInspectListComponent }        from './setup/inspect-list.component';
import { MaterialListComponent }            from './material/material-list.component';
import { MaterialComponent }                from './material/material.component';
import { MaterialPurchaseListComponent }    from './material/material-purchase-list.component';
import { MaterialPurchaseComponent }        from './material/material-purchase.component';
import { MaterialHasListComponent }         from './material/material-has-list.component';
import { MaterialHasComponent }             from './material/material-has.component';
import { MaterialLostListComponent }        from './material/material-lost-list.component';
import { MaterialLostComponent }            from './material/material-lost.component';
import { InspectResultsListComponent }      from './setup/inspect-results-list.component';
import { InspectResultsComponent }          from './setup/inspect-results.component';
import { BookingFollowupsComponent }        from './booking/booking-followups.component';
import { BookingFollowupsListComponent }    from './booking/booking-followups-list.component';
import { MaterialCheckListComponent }       from './material/material-check-list.component';
import { MaterialCheckComponent }           from './material/material-check.component';
import { MedicalCheckListComponent }        from './medical/medical-check-list.component';
import { MedicalCheckComponent }            from './medical/medical-check.component';
import { PrescriptBackListComponent }       from './prescript/prescript-back-list.component';
import { BookingGrowthrecordComponent }     from './booking/booking-growthrecord.component';
import { BookingCasehistoryComponent }      from './booking/booking-casehistory.component';
import { ChildListComponent }               from './user/child-list.component';
import { ChildInfoComponent }               from './user/child-info.component';
import { MemberComponent }                  from './setup/member.component';
import { MemberListComponent }              from './setup/member-list.component';
import { TransactionRecordListComponent }   from './user/transaction-record-list.component';
import { BookingPaymentComponent }          from './booking/booking-payment.component';
import { CrmRoleComponent }                 from './user/crm-role.component';
import { CrmRoleListComponent }             from './user/crm-role-list.component';
import { RoleAuthorityListComponent }       from './user/role-authority-list.component';

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
						path: 'schedulingConfigList',
						canActivate: [AuthGuardRole],
						component: SchedulingConfigListComponent
					},
					{
						path: 'schedulingConfig',
						canActivate: [AuthGuardRole],
						component: SchedulingConfigComponent
					},
					{
						path: 'scheduling',
						canActivate: [AuthGuardRole],
						component: SchedulingComponent
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
						path: 'workbenchReception',
						canActivate: [AuthGuardRole],
						component: WorkbenchReceptionComponent
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
						path: 'medical',
						canActivate: [AuthGuardRole],
						component: MedicalComponent
					},
					{
						path: 'medicalList',
						canActivate: [AuthGuardRole],
						component: MedicalListComponent
					},
					{
						path: 'medicalSupplier',
						canActivate: [AuthGuardRole],
						component: MedicalSupplierComponent
					},
					{
						path: 'medicalSupplierList',
						canActivate: [AuthGuardRole],
						component: MedicalSupplierListComponent
					},
					{
						path: 'medicalPurchase',
						canActivate: [AuthGuardRole],
						component: MedicalPurchaseComponent
					},
					{
						path: 'medicalPurchaseList',
						canActivate: [AuthGuardRole],
						component: MedicalPurchaseListComponent
					},
					{
						path: 'medicalHasList',
						canActivate: [AuthGuardRole],
						component:MedicalHasListComponent
					},
					{
						path: 'medicalHas',
						canActivate: [AuthGuardRole],
						component: MedicalHasComponent
					},
					{
						path: 'medicalLostList',
						canActivate: [AuthGuardRole],
						component: MedicalLostListComponent
					},
					{
						path: 'medicalLost',
						canActivate: [AuthGuardRole],
						component: MedicalLostComponent
					},
					{
						path: 'doctorPrescript',
						canActivate: [AuthGuardRole],
						component: DoctorPrescriptComponent
					},
					{
						path: 'prescriptList',
						canActivate: [AuthGuardRole],
						component: PrescriptListComponent
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
						path: 'materialList',
						canActivate: [AuthGuardRole],
						component: MaterialListComponent,
					},
					{
						path: 'material',
						canActivate: [AuthGuardRole],
						component: MaterialComponent,
					},
					{
						path: 'materialPurchaseList',
						canActivate: [AuthGuardRole],
						component: MaterialPurchaseListComponent,
					},
					{
						path: 'materialPurchase',
						canActivate: [AuthGuardRole],
						component: MaterialPurchaseComponent,
					},
					{
						path: 'materialHasList',
						canActivate: [AuthGuardRole],
						component: MaterialHasListComponent,
					},
					{
						path: 'materialHas',
						canActivate: [AuthGuardRole],
						component: MaterialHasComponent,
					},
					{
						path: 'materialLostList',
						canActivate: [AuthGuardRole],
						component: MaterialLostListComponent,
					},
					{
						path: 'materialLost',
						canActivate: [AuthGuardRole],
						component: MaterialLostComponent,
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
						path: 'materialCheckList',
						canActivate: [AuthGuardRole],
						component: MaterialCheckListComponent,
					},
					{
						path: 'materialCheck',
						canActivate: [AuthGuardRole],
						component: MaterialCheckComponent,
					},
					{
						path: 'medicalCheckList',
						canActivate: [AuthGuardRole],
						component: MedicalCheckListComponent,
					},
					{
						path: 'medicalCheck',
						canActivate: [AuthGuardRole],
						component: MedicalCheckComponent,
					},
					{
						path: 'prescriptBackList',
						canActivate: [AuthGuardRole],
						component: PrescriptBackListComponent,
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
