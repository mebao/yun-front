import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';
import { QRCodeModule }                    from '../common/qrcode.module';

import { AdminComponent }                  from './admin.component';

import { AdminRoutingModule }              from './admin-routing.module';

import { AuthGuardRole }                   from './auth-guard-role.service';

//nav
import { LeftNavComponent }                from './nav/left-nav.component';
import { HeaderNavComponent }              from './nav/header-nav.component';
import { TopBarComponent }                 from './nav/top-bar.component';

//modal
import { ModalToastComponent }             from '../common/modal/modal-toast.component';
import { ModalImgComponent }               from '../common/modal/modal-img.component';
import { NodataComponent }                 from '../common/nodata/nodata.component';

//common
import { DropDownComponent }               from '../common/dropdown/dropdown.component';
import { SelectSearchComponent }           from '../common/form/select-search.component';
import { SelectDateComponent }             from '../common/form/select-date.component';

//error
import { PageNotFoundComponent }           from '../error/page-not-found.component';
import { NoPermissionsComponent }          from '../error/no-permissions.component';

import { HomeComponent }                   from './home/home.component';
import { CreateUserComponent }             from './user/create-user.component';
import { SchedulingConfigListComponent }   from './scheduling/scheduling-config-list.component';
import { SchedulingConfigComponent }       from './scheduling/scheduling-config.component';
import { SchedulingComponent }             from './scheduling/scheduling.component';
import { BookingComponent }          from './booking/booking.component';
import { BookingListComponent }            from './booking/booking-list.component';
import { ChildServiceComponent }           from './service/child-service.component';
import { ChildServiceListComponent }       from './service/child-service-list.component';
import { ClinicServiceComponent }          from './service/clinic-service.component';
import { ClinicServiceListComponent }      from './service/clinic-service-list.component';
import { DoctorServiceComponent }          from './service/doctor-service.component';
import { DoctorServiceListComponent }      from './service/doctor-service-list.component';
import { UserListComponent }               from './user/user-list.component';
import { UserInfoComponent }               from './user/user-info.component';
import { DoctorListComponent }             from './user/doctor-list.component';
import { CrmUserListComponent }            from './user/crm-user-list.component';
import { CrmUserComponent }                from './user/crm-user.component';
import { WorkbenchReceptionComponent }     from './workbench/workbench-reception.component';
import { DoctorInfoComponent }             from './user/doctor-info.component';
import { BookingInComponent }              from './booking/booking-in.component';
import { BookingInfoComponent }            from './booking/booking-info.component';
import { BookingConfirmComponent }         from './booking/booking-confirm.component';
import { UploadComponent }                 from './user/upload.component';
import { BookingAddServiceComponent }      from './booking/booking-add-service.component';
import { BookingAddFeeComponent }          from './booking/booking-add-fee.component';
import { ClinicroomComponent }             from './clinicroom/clinicroom.component';
import { ClinicroomListComponent }         from './clinicroom/clinicroom-list.component';
import { ClinicroomRecordsComponent }      from './clinicroom/clinicroom-records.component';
import { MedicalComponent }                from './medical/medical.component';
import { MedicalListComponent }            from './medical/medical-list.component';
import { MedicalSupplierComponent }        from './medical/medical-supplier.component';
import { MedicalSupplierListComponent }    from './medical/medical-supplier-list.component';
import { MedicalPurchaseComponent }        from './medical/medical-purchase.component';
import { MedicalPurchaseListComponent }    from './medical/medical-purchase-list.component';
import { MedicalHasListComponent }         from './medical/medical-has-list.component';
import { MedicalHasComponent }             from './medical/medical-has.component';
import { MedicalLostListComponent }        from './medical/medical-lost-list.component';
import { MedicalLostComponent }            from './medical/medical-lost.component';
import { DoctorPrescriptComponent }        from './prescript/doctor-prescript.component';
import { PrescriptListComponent }          from './prescript/prescript-list.component';
import { BookingChargeComponent }          from './booking/booking-charge.component';
import { DoctorBookingComponent }          from './user/doctor-booking.component';
import { DoctorBookingGrowthrecordsComponent } from './user/doctor-booking-growthrecords.component';
import { DoctorBookingCasehistoryComponent } from './user/doctor-booking-casehistory.component';
import { DoctorBookingHealthrecordComponent } from './user/doctor-booking-healthrecord.component';
import { SetupInspectComponent }           from './setup/inspect.component';
import { SetupInspectListComponent }       from './setup/inspect-list.component';
import { MaterialListComponent }           from './material/material-list.component';
import { MaterialComponent }               from './material/material.component';
import { MaterialPurchaseListComponent }   from './material/material-purchase-list.component';
import { MaterialPurchaseComponent }       from './material/material-purchase.component';
import { MaterialHasListComponent }        from './material/material-has-list.component';
import { MaterialHasComponent }            from './material/material-has.component';
import { MaterialLostListComponent }       from './material/material-lost-list.component';
import { MaterialLostComponent }           from './material/material-lost.component';
import { InspectResultsListComponent }     from './setup/inspect-results-list.component';
import { InspectResultsComponent }         from './setup/inspect-results.component';
import { BookingFollowupsComponent }       from './booking/booking-followups.component';
import { BookingFollowupsListComponent }   from './booking/booking-followups-list.component';
import { MaterialCheckListComponent }      from './material/material-check-list.component';
import { MaterialCheckComponent }          from './material/material-check.component';
import { MedicalCheckListComponent }       from './medical/medical-check-list.component';
import { MedicalCheckComponent }           from './medical/medical-check.component';
import { PrescriptBackListComponent }      from './prescript/prescript-back-list.component';
import { BookingGrowthrecordComponent }    from './booking/booking-growthrecord.component';
import { BookingCasehistoryComponent }     from './booking/booking-casehistory.component';
import { ChildListComponent }              from './user/child-list.component';
import { ChildInfoComponent }              from './user/child-info.component';
import { MemberComponent }                 from './setup/member.component';
import { MemberListComponent }             from './setup/member-list.component';
import { TransactionRecordListComponent }  from './user/transaction-record-list.component';
import { BookingPaymentComponent }         from './booking/booking-payment.component';
import { CrmRoleComponent }                from './user/crm-role.component';
import { CrmRoleListComponent }            from './user/crm-role-list.component';
import { RoleAuthorityListComponent }      from './user/role-authority-list.component';
import { BookingReceiveComponent }         from './booking/booking-receive.component';
import { BookingHealthrecordComponent }    from './booking/booking-healthrecord.component';
import { PrescriptSaleComponent }          from './prescript/prescript-sale.component';
import { PrescriptSaleListComponent }      from './prescript/prescript-sale-list.component';
import { DoctorRecordTempletComponent }    from './doctor/doctor-record-templet.component';
import { DoctorRecordTempletListComponent } from './doctor/doctor-record-templet-list.component';
import { BookingHistoryComponent }         from './booking/booking-history.component';
import { AuthorizeGivefeeComponent }       from './authorize/authorize-givefee.component';
import { GivefeeListComponent }            from './user/givefee-list.component';
import { AuthorizeSuccessComponent }       from './authorize/authorize-success.component';
import { AssistListComponent }             from './setup/assist-list.component';
import { AssistComponent }                 from './setup/assist.component';
import { MedicalPurchaseInfoComponent }    from './medical/medical-purchase-info.component';

import { AdminService }                    from './admin.service';
import { DoctorService }                   from './doctor/doctor.service';

@NgModule({
	imports: [
		CommonModule,
		AdminRoutingModule,
		FormsModule,
		QRCodeModule,
	],
	declarations: [
		AdminComponent,
		LeftNavComponent,
		HeaderNavComponent,
		TopBarComponent,
		DropDownComponent,
		SelectSearchComponent,
		HomeComponent,
		CreateUserComponent,
		SchedulingConfigListComponent,
		SchedulingConfigComponent,
		SchedulingComponent,
		BookingComponent,
		BookingListComponent,
		BookingInComponent,
		BookingInfoComponent,
		ChildServiceComponent,
		ChildServiceListComponent,
		ClinicServiceComponent,
		ClinicServiceListComponent,
		DoctorServiceComponent,
		DoctorServiceListComponent,
		UserListComponent,
		UserInfoComponent,
		DoctorListComponent,
		DoctorInfoComponent,
		CrmUserListComponent,
		CrmUserComponent,
		WorkbenchReceptionComponent,
		ModalToastComponent,
		ModalImgComponent,
		NodataComponent,
		BookingConfirmComponent,
		PageNotFoundComponent,
		NoPermissionsComponent,
		UploadComponent,
		BookingAddServiceComponent,
		BookingAddFeeComponent,
		ClinicroomComponent,
		ClinicroomListComponent,
		ClinicroomRecordsComponent,
		MedicalComponent,
		MedicalListComponent,
		MedicalSupplierComponent,
		MedicalSupplierListComponent,
		MedicalPurchaseComponent,
		MedicalPurchaseListComponent,
		MedicalHasListComponent,
		MedicalHasComponent,
		MedicalLostListComponent,
		MedicalLostComponent,
		DoctorPrescriptComponent,
		PrescriptListComponent,
		BookingChargeComponent,
		DoctorBookingComponent,
		DoctorBookingGrowthrecordsComponent,
		DoctorBookingCasehistoryComponent,
		DoctorBookingHealthrecordComponent,
		SetupInspectComponent,
		SetupInspectListComponent,
		MaterialListComponent,
		MaterialComponent,
		MaterialPurchaseListComponent,
		MaterialPurchaseComponent,
		MaterialHasListComponent,
		MaterialHasComponent,
		MaterialLostListComponent,
		MaterialLostComponent,
		InspectResultsListComponent,
		InspectResultsComponent,
		BookingFollowupsComponent,
		BookingFollowupsListComponent,
		MaterialCheckListComponent,
		MaterialCheckComponent,
		MedicalCheckListComponent,
		MedicalCheckComponent,
		PrescriptBackListComponent,
		BookingGrowthrecordComponent,
		BookingCasehistoryComponent,
		ChildListComponent,
		ChildInfoComponent,
		MemberComponent,
		MemberListComponent,
		TransactionRecordListComponent,
		BookingPaymentComponent,
		CrmRoleComponent,
		CrmRoleListComponent,
		RoleAuthorityListComponent,
		BookingReceiveComponent,
		SelectDateComponent,
		BookingHealthrecordComponent,
		PrescriptSaleComponent,
		PrescriptSaleListComponent,
		DoctorRecordTempletComponent,
		DoctorRecordTempletListComponent,
		BookingHistoryComponent,
		AuthorizeGivefeeComponent,
		GivefeeListComponent,
		AuthorizeSuccessComponent,
		AssistListComponent,
		AssistComponent,
		MedicalPurchaseInfoComponent,
	],
	providers: [
		AdminService,
		DoctorService,
		AuthGuardRole,
	]
})
export class AdminModule{

}
