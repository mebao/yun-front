import { PreloadingStrategy, Route }    from '@angular/router';
import { Observable }                   from 'rxjs';

/**
 * 预加载
 *  ——解决懒加载第一次加载时卡顿情况
 *  ——通过在路由中配置data: {preload: true}
 */
export class SelectivePreloadingStrategy implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any>{
        return route.data && route.data['preload'] ? load() : Observable.of(null);
    }
}
