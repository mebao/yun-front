import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

// nav
import { NavModule }                      from '../nav/nav.module';

import { PipeModule }                     from '../../pipe/pipe.module';

// common
import { AngCommonModule }                from '../../common/ang-common.module';

import { GuazhangListRoutingModule }      from './guazhang-list.routing.module';

import { GuazhangList }                   from './guazhang-list.component';

@NgModule({
    declarations: [
        GuazhangList,
    ],
    exports: [
        GuazhangList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        GuazhangListRoutingModule,
    ]
})

// crm：内部人员
export class GuazhangListModule{

}
