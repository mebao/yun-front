import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { RouterModule }         from '@angular/router';

import { NgZorroAntdModule }    from 'ng-zorro-antd';

//common
import { AngCommonModule }      from '../../common/ang-common.module';

import { HeaderNavComponent }   from './header-nav.component';
import { LeftNavComponent }     from './left-nav.component';
import { TopBarComponent }      from './top-bar.component';
import { NllEventListenerDirective }  from '../../directive/nll-event-listener';

@NgModule({
    declarations: [
        HeaderNavComponent,
        LeftNavComponent,
        TopBarComponent,
        NllEventListenerDirective,
    ],
    exports: [
        HeaderNavComponent,
        LeftNavComponent,
        TopBarComponent,
        NllEventListenerDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgZorroAntdModule,
        AngCommonModule,
    ]
})

export class NavModule{

}
