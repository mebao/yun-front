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
import { BookingComponent }           from './booking/booking.component';
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
					{path: 'home',                    component: HomeComponent},
					{path: 'createUser',              component: CreateUserComponent},
					{path: 'schedulingConfigList',    component: SchedulingConfigListComponent},
					{path: 'schedulingConfig',        component: SchedulingConfigComponent},
					{path: 'scheduling',              component: SchedulingComponent},
					{path: 'booking',           component: BookingComponent},
					{path: 'bookingList',             component: BookingListComponent},
					{path: 'childService',            component: ChildServiceComponent},
					{path: 'childServiceList',        component: ChildServiceListComponent},
					{path: 'clinicService',           component: ClinicServiceComponent},
					{path: 'clinicServiceList',       component: ClinicServiceListComponent},
					{path: 'doctorService',           component: DoctorServiceComponent},
					{path: 'doctorServiceList',       component: DoctorServiceListComponent},
					{path: 'userList',                component: UserListComponent},
					{path: 'userInfo',                component: UserInfoComponent},
					{path: 'doctorList',              component: DoctorListComponent},
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
					{path: 'workbenchReception',      component: WorkbenchReceptionComponent},
					{path: 'doctorInfo',              component: DoctorInfoComponent},
					{path: 'bookingIn',               component: BookingInComponent},
					{path: 'bookingInfo',             component: BookingInfoComponent},
					{path: 'bookingConfirm',          component: BookingConfirmComponent},
					{path: 'upload',                  component: UploadComponent},
					{path: 'bookingAddService',       component: BookingAddServiceComponent},
					{path: 'bookingAddFee',           component: BookingAddFeeComponent},
					{path: 'clinicroom',              component: ClinicroomComponent},
					{path: 'clinicroomList',          component: ClinicroomListComponent},
					{path: 'clinicroomRecords',       component: ClinicroomRecordsComponent},
					{path: 'medical',                 component: MedicalComponent},
					{path: 'medicalList',             component: MedicalListComponent},
					{path: 'medicalSupplier',         component: MedicalSupplierComponent},
					{path: 'medicalSupplierList',     component: MedicalSupplierListComponent},
					{path: 'medicalPurchase',         component: MedicalPurchaseComponent},
					{path: 'medicalPurchaseList',     component: MedicalPurchaseListComponent},
					{path: 'medicalHasList',          component: 
					MedicalHasListComponent},
					{path: 'medicalHas',              component: MedicalHasComponent},
					{path: 'medicalLostList',         component: MedicalLostListComponent},
					{path: 'medicalLost',             component: MedicalLostComponent},
					{path: 'doctorPrescript',         component: DoctorPrescriptComponent},
					{path: 'prescriptList',           component: PrescriptListComponent},
					{path: 'noPermissions',           component: NoPermissionsComponent},
					{path: '**',                      component: PageNotFoundComponent},
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