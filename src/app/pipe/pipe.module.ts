import { NgModule }                   from '@angular/core';

import { ToDecimal2Pipe }             from './toDecimal2.pipe';

@NgModule({
    declarations: [
        ToDecimal2Pipe,
    ],
    exports: [
        ToDecimal2Pipe,
    ]
})

export class PipeModule{

}
