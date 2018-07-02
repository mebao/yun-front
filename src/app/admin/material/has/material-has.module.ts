import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialHasRoutingModule }               from './material-has.routing.module';

import { MaterialHasComponent }                   from './material-has.component';
import { MaterialHasListComponent }               from './material-has-list.component';

@NgModule({
    declarations: [
        MaterialHasComponent,
        MaterialHasListComponent,
    ],
    exports: [
        MaterialHasComponent,
        MaterialHasListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MaterialHasRoutingModule,
    ]
})

export class MaterialHasModule{

}
