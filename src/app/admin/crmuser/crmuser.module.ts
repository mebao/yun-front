import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

import { NgZorroAntdModule }              from 'ng-zorro-antd';

// nav
import { NavModule }                      from '../nav/nav.module';

// common
import { AngCommonModule }                from '../../common/ang-common.module';

import { CrmuserRoutingModule }           from './crmuser.routing.module';

import { CrmUserComponent }               from './crm-user.component';
import { CrmUserListComponent }           from './crm-user-list.component';

@NgModule({
    declarations: [
        CrmUserComponent,
        CrmUserListComponent,
    ],
    exports: [
        CrmUserComponent,
        CrmUserListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        CrmuserRoutingModule,
    ]
})

// crm：内部人员
export class CrmuserModule{

}
