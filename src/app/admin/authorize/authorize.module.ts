import { NgModule }                                from '@angular/core';
import { CommonModule }                            from '@angular/common';
import { FormsModule }                             from '@angular/forms';

//common
import { AngCommonModule }                         from '../../common/ang-common.module';

import { AuthorizeRoutingModule }                  from './authorize.routing.module';

import { AuthorizeGivefeeComponent }               from './authorize-givefee.component';
import { AuthorizeSuccessComponent }               from './authorize-success.component';

@NgModule({
    declarations: [
        AuthorizeGivefeeComponent,
        AuthorizeSuccessComponent,
    ],
    exports: [
        AuthorizeGivefeeComponent,
        AuthorizeSuccessComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AngCommonModule,
        AuthorizeRoutingModule,
    ]
})

export class AuthorizeModule{

}
