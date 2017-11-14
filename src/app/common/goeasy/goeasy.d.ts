interface GoEasyConfig{
    appkey:string;
    otp?:string;
}

interface SubscribeConfig{
    channel:string;
    onMessage(message:{channel:string,content:string}):void;
    onFailed?(message:{code:string,content:string}):void;
}

interface UnSubscribeConfig{
    channel:string;
}

interface PublishContent{
    channel:string;
    message:string;
    onFailed?(message:{code:string,content:string}):void;
    onSuccess?(message:{code:string,content:string}):void;
}

declare class GoEasy{
    constructor(config:GoEasyConfig);
    subscribe(subscribeConfig:SubscribeConfig):void;
    unsubscribe(unsubscribeConfig:UnSubscribeConfig):void;
    publish(publishContent:PublishContent):void;
}
