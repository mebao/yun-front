import { Component, Input, OnInit, trigger, transition, style, animate, state }   from '@angular/core';
import { ToastService }      from './toast.service';
import { ToastConfig }       from './toast-model';

/**
 * toast外层组件
 */
@Component({
    selector: 'nll-toast-box',
    templateUrl: './toast-box.component.html',
    styleUrls: ['./toast-box.component.scss'],
})

export class ToastBoxComponent implements OnInit{
    @Input() toastPosition: string = 'nl-toast-top-center';

    private toastConfigs: Array<ToastConfig> = [];

    constructor(private toastService: ToastService) {
        this.toastService.getToasts().forEach((config: ToastConfig) => {
            // 超过6个，自前往后移除
            if(this.toastConfigs.length == 6){
                this.remove(this.toastConfigs[5]);
            }
            this.toastConfigs.unshift(config);
        });
    }

    ngOnInit() {

    }

    /**
     * 获得所有toast配置
     */
    getToastConfigs(): Array<ToastConfig>{
        return this.toastConfigs;
    }

    /**
     * 移除
     */
    remove(toastCfg: ToastConfig){
        if(this.toastConfigs.indexOf(toastCfg) >= 0){
            this.toastConfigs.splice(this.toastConfigs.indexOf(toastCfg), 1);
        }
    }
}
