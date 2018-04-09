import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../auth-guard-role.service';

import { ChildServiceComponent }        from './child-service.component';
import { ChildServiceListComponent }    from './child-service-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: ChildServiceComponent
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: ChildServiceListComponent
        }
    ])]
})

export class ChildServiceRoutingModule{

}
