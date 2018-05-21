import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

import { NgZorroAntdModule }              from 'ng-zorro-antd';

// nav
import { NavModule }                      from '../../nav/nav.module';

// common
import { AngCommonModule }                from '../../../common/ang-common.module';

import { UserCreateRoutingModule }        from './user-create.routing.module';

import { CreateUserComponent }            from './create-user.component';

@NgModule({
    declarations: [
        CreateUserComponent,
    ],
    exports: [
        CreateUserComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        UserCreateRoutingModule,
    ]
})

// crm：内部人员
export class UserCreateModule{

}
