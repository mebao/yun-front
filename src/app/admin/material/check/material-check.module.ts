import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialCheckRoutingModule }             from './material-check.routing.module';

import { MaterialCheckComponent }                 from './material-check.component';
import { MaterialCheckListComponent }             from './material-check-list.component';

@NgModule({
    declarations: [
        MaterialCheckComponent,
        MaterialCheckListComponent,
    ],
    exports: [
        MaterialCheckComponent,
        MaterialCheckListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MaterialCheckRoutingModule,
    ]
})

export class MaterialCheckModule{

}
