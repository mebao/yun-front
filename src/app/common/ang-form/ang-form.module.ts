import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';

import { SelectDateComponent }    from './select-date.component';
import { SelectSearchComponent }  from './select-search.component';

@NgModule({
    declarations: [
        SelectDateComponent,
        SelectSearchComponent,
    ],
    exports: [
        SelectDateComponent,
        SelectSearchComponent,
    ],
    imports: [
        CommonModule,
    ]
})

export class AngFormModule{

}
