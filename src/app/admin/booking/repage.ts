import { Component }                  from '@angular/core';
import { Router, ActivatedRoute }     from '@angular/router';

@Component({
    selector: 'admin-repage',
    template: '',
})

export class Repage{
    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {}
    ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.router.navigate(['./admin/' + params.from], {queryParams: params});
		});
    }
}
