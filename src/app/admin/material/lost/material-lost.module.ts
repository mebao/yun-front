import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialLostRoutingModule }              from './material-lost.routing.module';

import { MaterialLostComponent }                  from './material-lost.component';
import { MaterialLostListComponent }              from './material-lost-list.component';

@NgModule({
    declarations: [
        MaterialLostComponent,
        MaterialLostListComponent,
    ],
    exports: [
        MaterialLostComponent,
        MaterialLostListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MaterialLostRoutingModule,
    ]
})

export class MaterialLostModule{

}
