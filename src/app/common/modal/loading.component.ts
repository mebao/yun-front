import { Component, Input } from '@angular/core';

@Component({
    selector: 'loading',
    template: `
        <div class="modal-loading" *ngIf="show">
            <div class="modal-mask"></div>
            <div class="loading-content">
                <div class="loading">
                    <div class="object one"></div>
                    <div class="object two"></div>
                    <div class="object three"></div>
                    <div class="object four"></div>
                    <div class="object five"></div>
                    <div class="object six"></div>
                    <div class="object seven"></div>
                    <div class="object eight"></div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .modal-loading{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999999;
        }
        .modal-loading .modal-mask{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,.3);
            z-index: 2;
        }
        .loading-content{
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -70px;
            margin-left: -50px;
            width: 100px;
            height: 100px;
            text-align: center;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            background-color: #fff;
            z-index: 3;
        }
        .loading{
            position: absolute;
            top: 10px;
            left: 10px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
        .object{
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #AFAFAF;
            border-radius: 50%;
            animation: rotatingCircle 0.8s infinite;
        }
        @keyframes rotatingCircle {
            0%{
                transform: scale(1);
            }
            10%{
                transform: scale(1.1);
            }
            20%{
                transform: scale(1.2);
            }
            30%{
                transform: scale(1.3);
            }
            40%{
                transform: scale(1.4);
            }
            50%{
                transform: scale(1.5);
            }
            60%{
                transform: scale(1.4);
            }
            70%{
                transform: scale(1.3);
            }
            80%{
                transform: scale(1.2);
            }
            90%{
                transform: scale(1.1);
            }
            100%{
                transform: scale(1);
            }
        }
        .one{
            top: 5px;
            left: 35px;
        }
        .two{
            top: 15px;
            left: 55px;
            animation-delay: 0.1s;
        }
        .three{
            top: 35px;
            left: 65px;
            animation-delay: 0.2s;
        }
        .four{
            top: 55px;
            left: 55px;
            animation-delay: 0.3s;
        }
        .five{
            top: 65px;
            left: 35px;
            animation-delay: 0.4s;
        }
        .six{
            top: 55px;
            left: 15px;
            animation-delay: 0.5s;
        }
        .seven{
            top: 35px;
            left: 5px;
            animation-delay: 0.6s;
        }
        .eight{
            top: 15px;
            left: 15px;
            animation-delay: 0.7s;
        }
        `
    ],
})

export class LoadingComponent {
    @Input() show = false;
}
