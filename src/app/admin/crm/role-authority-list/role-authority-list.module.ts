import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

// nav
import { NavModule }                      from '../../nav/nav.module';

// common
import { AngCommonModule }                from '../../../common/ang-common.module';

import { RoleAuthorityListRoutingModule } from './role-authority-list.routing.module';

import { RoleAuthorityListComponent }     from './role-authority-list.component';

@NgModule({
    declarations: [
        RoleAuthorityListComponent,
    ],
    exports: [
        RoleAuthorityListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        RoleAuthorityListRoutingModule,
    ]
})

// crm：内部人员
export class RoleAuthorityListModule{

}
