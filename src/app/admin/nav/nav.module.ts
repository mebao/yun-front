import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule }         from '@angular/router';

import { NgZorroAntdModule }    from 'ng-zorro-antd';

//common
import { AngCommonModule }      from '../../common/ang-common.module';

import { HeaderNavComponent }   from './header-nav.component';
import { LeftNavComponent }     from './left-nav.component';
import { TopBarComponent }      from './top-bar.component';
import { MouseInDirective }     from '../../directive/mouse-in';

@NgModule({
    declarations: [
        HeaderNavComponent,
        LeftNavComponent,
        TopBarComponent,
        MouseInDirective,
    ],
    exports: [
        HeaderNavComponent,
        LeftNavComponent,
        TopBarComponent,
        MouseInDirective,
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgZorroAntdModule,
        AngCommonModule,
    ]
})

export class NavModule{

}
