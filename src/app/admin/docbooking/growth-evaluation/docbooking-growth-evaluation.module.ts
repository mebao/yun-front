import { NgModule }                                   from '@angular/core';
import { CommonModule }                               from '@angular/common';
import { FormsModule }                                from '@angular/forms';

// 最新升级后，修改引入名称
import { NgxEchartsModule }                           from 'ngx-echarts';

import { NavModule }                                  from '../../nav/nav.module';

import { AngCommonModule }                            from '../../../common/ang-common.module';

import { DocbookingGrowthEvaluationRoutingModule }    from './docbooking-growth-evaluation.routing.module';

import { DocbookingGrowthEvaluation }                 from './docbooking-growth-evaluation';

@NgModule({
    declarations: [
        DocbookingGrowthEvaluation,
    ],
    exports: [
        DocbookingGrowthEvaluation,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxEchartsModule,
        NavModule,
        AngCommonModule,
        DocbookingGrowthEvaluationRoutingModule,
    ]
})

export class DocbookingGrowthEvaluationModule{

}
