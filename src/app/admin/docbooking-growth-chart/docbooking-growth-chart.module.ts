import { NgModule }                              from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { FormsModule }                           from '@angular/forms';

// 最新升级后，修改引入名称
import { NgxEchartsModule }                      from 'ngx-echarts';

import { NavModule }                             from '../nav/nav.module';

import { AngCommonModule }                       from '../../common/ang-common.module';

import { DocbookingGrowthChartRoutingModule }    from './docbooking-growth-chart.routing.module';

import { DocbookingGrowthChart }                 from './docbooking-growth-chart';

@NgModule({
    declarations: [
        DocbookingGrowthChart,
    ],
    exports: [
        DocbookingGrowthChart,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxEchartsModule,
        NavModule,
        AngCommonModule,
        DocbookingGrowthChartRoutingModule,
    ]
})

export class DocbookingGrowthChartModule{

}
