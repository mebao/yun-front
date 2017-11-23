import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

//nav
import { NavModule }                      from '../nav/nav.module';

//common
import { AngCommonModule }                from '../../common/ang-common.module';

import { WorkbenchRoutingModule }         from './workbench.routing.module';
import { WorkbenchReceptionComponent }    from './workbench-reception.component';

@NgModule({
    declarations: [
        WorkbenchReceptionComponent,
    ],
    exports: [
        WorkbenchReceptionComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        WorkbenchRoutingModule,
        NavModule,
        AngCommonModule,
    ]
})

export class WorkbenchModule{

}
