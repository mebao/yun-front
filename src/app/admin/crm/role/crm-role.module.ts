import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

// nav
import { NavModule }                      from '../../nav/nav.module';

// common
import { AngCommonModule }                from '../../../common/ang-common.module';

import { CrmRoleRoutingModule }           from './crm-role.routing.module';

import { CrmRoleComponent }               from './crm-role.component';

@NgModule({
    declarations: [
        CrmRoleComponent,
    ],
    exports: [
        CrmRoleComponent,
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
