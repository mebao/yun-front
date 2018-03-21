import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'backList',
            loadChildren: './back-list/prescript-back-list.module#PrescriptBackListModule',
        },
        {
            path: 'list',
            loadChildren: './list/prescript-list.module#PrescriptListModule',
        },
        {
            path: 'saleList',
            loadChildren: './sale-list/prescript-sale-list.module#PrescriptSaleListModule',
        },
        {
            path: 'sale',
            loadChildren: './sale/prescript-sale.module#PrescriptSaleModule',
        }
    ])],
    exports: [RouterModule]
})

export class PrescriptRoutingModule{

}
