import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

// nav
import { NavModule }                      from '../../nav/nav.module';

// common
import { AngCommonModule }                from '../../../common/ang-common.module';

import { CrmRoleRoutingModule }           from './crm-role.routing.module';

import { CrmRoleComponent }               from './crm-role.component';
import { CrmRoleListComponent }           from './crm-role-list.component';

@NgModule({
    declarations: [
        CrmRoleComponent,
        CrmRoleListComponent,
    ],
    exports: [
        CrmRoleComponent,
        CrmRoleListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        CrmRoleRoutingModule,
    ]
})

// crm：内部人员
export class CrmRoleModule{

}
