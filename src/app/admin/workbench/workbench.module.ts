import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

//nav
import { NavModule }                      from '../nav/nav.module';

//common
import { AngCommonModule }                from '../../common/ang-common.module';

import { WorkbenchRoutingModule }         from './workbench.routing.module';
import { WorkbenchReceptionComponent }    from './workbench-reception.component';

import { ENgxPrintModule }                from "e-ngx-print";

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
        ENgxPrintModule,
    ]
})

export class WorkbenchModule{

}
