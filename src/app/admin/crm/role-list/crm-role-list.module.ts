import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

// nav
import { NavModule }                      from '../../nav/nav.module';

// common
import { AngCommonModule }                from '../../../common/ang-common.module';

import { CrmRoleListRoutingModule }       from './crm-role-list.routing.module';

import { CrmRoleListComponent }           from './crm-role-list.component';

@NgModule({
    declarations: [
        CrmRoleListComponent,
    ],
    exports: [
        CrmRoleListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        CrmRoleListRoutingModule,
    ]
})

// crm：内部人员
export class CrmRoleListModule{

}
