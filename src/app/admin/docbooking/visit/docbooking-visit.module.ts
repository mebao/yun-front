import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

// nav
import { NavModule }                              from '../../nav/nav.module';

// common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { DocbookingVisitRoutingModule }           from './docbooking-visit.routing.module';

import { DocbookingVisitComponent }               from './docbooking-visit.component';

@NgModule({
    declarations: [
        DocbookingVisitComponent,
    ],
    exports: [
        DocbookingVisitComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        DocbookingVisitRoutingModule,
    ]
})

export class DocbookingVisitModule{

}
