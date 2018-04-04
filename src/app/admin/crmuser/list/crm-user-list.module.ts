import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

import { NgZorroAntdModule }              from 'ng-zorro-antd';

// nav
import { NavModule }                      from '../../nav/nav.module';

// common
import { AngCommonModule }                from '../../../common/ang-common.module';

import { CrmUserListRoutingModule }       from './crm-user-list.routing.module';

import { CrmUserListComponent }           from './crm-user-list.component';

@NgModule({
    declarations: [
        CrmUserListComponent,
    ],
    exports: [
        CrmUserListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        CrmUserListRoutingModule,
    ]
})

// crm：内部人员
export class CrmUserListModule{

}
