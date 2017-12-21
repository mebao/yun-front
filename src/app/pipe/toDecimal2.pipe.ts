import { Pipe, PipeTransform }       from '@angular/core';

@Pipe({
    name: 'toDecimal2'
})

export class ToDecimal2Pipe implements PipeTransform{
    transform(str: string) {
        var strF = parseFloat(str);
        if (isNaN(strF)) {
            return '0.00';
        }
        var f = Math.round(strF * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
    	//小数点不足两位
    	if(s.length <= rs + 2){
	        while (s.length <= rs + 2) {
	            s += '0';
	        }
    	}else{
    		//小数点超过两位
    		s = s.substring(0, rs + 3);
    	}
        return s;
    }
}
