export const config = {
    baseHTTP(): string{
        var host = window.location.host;
        if(host.indexOf('localhost:4200') != -1 || host.indexOf('172.16.252.227') != -1){
            return 'http://172.16.252.227/jiabaokangle';
        }else if(host.indexOf('yun.meb168.com') != -1){
            return 'http://wapapi.meb168.com';
        }else if(host.indexOf('km01.yun.meb168.com') != -1){
            return 'http://km01.yunapi.meb168.com';
        }else if(host.indexOf('mebtest.meb168.com') != -1){
            return 'http://mebtestapi.meb168.com';
        }else{
            return 'http://wapapi.meb168.com';
        }
    },
    yebkHttp(): string{
        var host = window.location.host;
        if(host.indexOf('localhost:4200') != -1 || host.indexOf('172.16.252.227') != -1){
            return 'http://172.16.252.227/yrbk';
        }else{
            return 'http://mebapi.meb168.com';
        }
    },
    message_tran(): string{
        var host = window.location.host;
        if(host.indexOf('localhost:4200') != -1 || host.indexOf('172.16.252.227') != -1 || host.indexOf('mebtest.meb168.com') != -1){
            return 'test_message_tran';
        }else if(host.indexOf('yun.meb168.com') != -1){
            return 'zy_message_tran';
        }else if(host.indexOf('km01.yun.meb168.com') != -1){
            return 'km_message_tran';
        }else{
            return 'test_message_tran';
        }
    },
}
