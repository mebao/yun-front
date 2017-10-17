import { Component }                              from '@angular/core';

@Component({
    selector: 'admin-authorize-success',
    templateUrl: 'authorize-success.component.html',
})

export class AuthorizeSuccessComponent{
    close() {
        window.opener=null; window.open('','_self'); window.close();
    }
}
