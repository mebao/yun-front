import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';

//nav
import { NavModule } from '../nav/nav.module';

//common
import { AngCommonModule } from '../../common/ang-common.module';

import { PhyexamRoutingModule } from './phyexam.routing.module';

import { Phyexam } from './phyexam';
import { PhyexamList } from './phyexam-list';

@NgModule({
    declarations: [
        Phyexam,
        PhyexamList,
    ],
    exports: [
        Phyexam,
        PhyexamList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        PhyexamRoutingModule,
    ]
})

export class PhyexamModule {

}
