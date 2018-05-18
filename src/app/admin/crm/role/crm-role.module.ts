import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule }              from 'ng-zorro-antd';

// nav
import { NavModule }                      from '../../nav/nav.module';

// common
import { AngCommonModule }                from '../../../common/ang-common.module';

import { CrmRoleRoutingModule }           from './crm-role.routing.module';

import { CrmRoleComponent }               from './crm-role.component';
import { CrmRoleListComponent }           from './crm-role-list.component';
import { CrmRoleAuthorityListComponent }  from './authority-list.component';

@NgModule({
    declarations: [
        CrmRoleComponent,
        CrmRoleListComponent,
        CrmRoleAuthorityListComponent,
    ],
    exports: [
        CrmRoleComponent,
        CrmRoleListComponent,
        CrmRoleAuthorityListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        CrmRoleRoutingModule,
    ]
})

// crm：内部人员
export class CrmRoleModule{

}
