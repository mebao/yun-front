import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';

import { NgZorroAntdModule }                from 'ng-zorro-antd';

// nav
import { NavModule }                        from '../nav/nav.module';

// common
import { AngCommonModule }                  from '../../common/ang-common.module';

import { DocbookingRoutingModule }          from './docbooking.routing.module';

import { DocbookingComponent }              from './docbooking.component';

@NgModule({
    declarations: [
        DocbookingComponent,
    ],
    exports: [
        DocbookingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        DocbookingRoutingModule,
    ]
})

export class DocbookingModule{

}
