import { NgModule }                                   from '@angular/core';
import { CommonModule }                               from '@angular/common';
import { FormsModule }                                from '@angular/forms';

import { NgZorroAntdModule }                          from 'ng-zorro-antd';

// 最新升级后，修改引入名称
import { NgxEchartsModule }                           from 'ngx-echarts';

import { NavModule }                                  from '../../nav/nav.module';

import { AngCommonModule }                            from '../../../common/ang-common.module';
import { DocbookingLeftModule }                       from '../components/docbooking-left.module';

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
        NgZorroAntdModule,
        NgxEchartsModule,
        NavModule,
        AngCommonModule,
        DocbookingLeftModule,
        DocbookingGrowthEvaluationRoutingModule,
    ]
})

export class DocbookingGrowthEvaluationModule{

}
