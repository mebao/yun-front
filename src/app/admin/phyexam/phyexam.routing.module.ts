import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';

import { Phyexam }                              from './phyexam';
import { PhyexamList }                          from './phyexam-list';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: Phyexam,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: PhyexamList,
        },
    ])],
    exports: [RouterModule]
})

export class PhyexamRoutingModule{

}
