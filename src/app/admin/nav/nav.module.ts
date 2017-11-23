import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule }         from '@angular/router';

import { HeaderNavComponent }   from './header-nav.component';
import { LeftNavComponent }     from './left-nav.component';
import { TopBarComponent }      from './top-bar.component';

@NgModule({
    declarations: [
        HeaderNavComponent,
        LeftNavComponent,
        TopBarComponent,
    ],
    exports: [
        HeaderNavComponent,
        LeftNavComponent,
        TopBarComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ]
})

export class NavModule{

}
