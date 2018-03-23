import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

// nav
import { NavModule }                      from '../nav/nav.module';

// common
import { AngCommonModule }                from '../../common/ang-common.module';

import { CrmuserRoutingModule }           from './crmuser.routing.module';

import { CrmUserComponent }               from './crm-user.component';

@NgModule({
    declarations: [
        CrmUserComponent,
    ],
    exports: [
        CrmUserComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        CrmuserRoutingModule,
    ]
})

// crm：内部人员
export class CrmuserModule{

}
