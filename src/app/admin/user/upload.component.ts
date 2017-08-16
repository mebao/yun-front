import {Component, OnInit}         from '@angular/core';
import {FormGroup}                 from '@angular/forms';
import { AdminService }            from '../admin.service';

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload.component.html',
})
export class UploadComponent{
	constructor(public adminService: AdminService) {}

	ngOnInit() {
	}

	selectedFile(_file) {
    	var info = {
    		headers: [
    			{'Content-Type': 'multipart/form-data;'},
    		]
    	}
    	var fileJson = _file.target['files'];
    	for(var index in fileJson){
    		if(fileJson[index]['name'] && fileJson[index]['size']){
	    		var file = fileJson[index];
		        var formData = new FormData();
		        formData.append('file', file);
		        formData.append('name', file.name);
		        formData.append('type', file.type);
		        formData.append('lastModifiedDate', file.lastModifiedDate);
		        formData.append('size', file.size);
		        formData.append('token', 'tFXIrVdcf4L0_zBC4F33jbUth5m0qKjMsfSzaSxA:SRS4ke4WQRFMqQ4kX0rmxXcWjEw=:eyJzY29wZSI6ImJjaXJjbGUiLCJkZWFkbGluZSI6MTUwMTc1OTMzOX0=');// the qiniu upload accessKey.
		        formData.append('key', (new Date()).getTime() + Math.floor(Math.random() * 100)+'.'+file.name.substr(file.name.lastIndexOf('.')+1));

		        var reader = new FileReader();
		        var imgEle = document.getElementById('imgEle');
		        reader.readAsDataURL(file);
		        reader.onload = function(f) {
		        	imgEle.setAttribute('src', reader.result);
		        }

		        // var xhr = new XMLHttpRequest();
		        // xhr.open('post', 'http://upload.qiniu.com/', false);
		        // xhr.onreadystatechange = function () {
		        //     if (xhr.readyState == 4) {
		        //         if (xhr.status == 200) {
		        //             // if (cb && typeof(cb) == 'function') {
		        //             //     console.log('上传成功');
		        //             //     cb(JSON.parse(xhr.responseText), index);
		        //             // } else {
		        //             //     console.log('上传成功');
		        //             // }
		        //         } else {
		        //             // progressBar.style.width = '0%';
		        //             // progressBar.style.color = '#f00';
		        //             // progressBar.innerHTML = '失败';
		        //             // _toast(upFile.obj.name + '上传失败，请点击重新上传');
		        //         }
		        //     }
		        // };
		        // xhr.send(formData);

    		}
    	}
    }
}














// import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
// import {FormGroup} from '@angular/forms';
// import {FileUploader, FileItem} from 'ng2-file-upload';

// @Component({
//   selector: 'app-upload-file',
//   templateUrl: './upload.component.html',
// })
// export class UploadComponent implements OnInit, OnChanges {


//   @Input()
//   change: any;
//   @Input()
//   formModel: FormGroup;
//   @Input()
//   name: string;
//   defImg: string;
//   @Input()
//   defType: Number = 1;

//   uploader: FileUploader = new FileUploader({
//     url: 'http://upload.qiniu.com/',
//     method: 'POST',
//     itemAlias: 'uploadedfile',
//   });

//   constructor(
//   ) { }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (this.defType === 1) {
//       const val =  this.formModel.controls[this.name].value;
//       if ( val !== null && val !== '') {
//         this.defImg = val;
//       } else {
//         this.defImg = '/assets/imgs/noimage.gif';
//       }
//     }

//     this.uploader = new FileUploader({
//        url: 'http://upload.qiniu.com/',
//       method: 'POST',
//       itemAlias: 'uploadedfile',
//     });
//   }
//   ngOnInit() {

//   }

// // C: 定义事件，选择文件
//   selectedFileOnChanged(event: any) {
//     // 打印文件选择名称
//     console.log(this.uploader);
//     this.uploadFile();
//   }
//   // D: 定义事件，上传文件
//   uploadFile() {
//     // 上传
//     this.uploader.queue[0].onSuccess = function (response, status, headers) {
//       // 上传文件成功
//       if (status === 200) {
//         // 上传文件后获取服务器返回的数据
//         const ret = JSON.parse(response);
//         if ( ret.retCode === '' ) {
//             // 此处无法 this.formModel.controls[this.name].setValue(this.defImg);  因此在html中增加hidden域，然后触犯隐藏域的单击事件
//           // $('#upload-file-id-' + ret.fieldName).val(ret.fileName);
//           // $('#upload-file-id-' + ret.fieldName).trigger('click');
//         } else {
//           alert('文件上传失败:' + ret.retDesc);
//         }
//       } else {
//         // 上传文件后获取服务器返回的数据错误
//         alert('文件上传失败');
//       }
//     };
//     this.uploader.queue[0]._file['token'] = 'tFXIrVdcf4L0_zBC4F33jbUth5m0qKjMsfSzaSxA:p4KN0PM9CrxOCBQONiUTB8VEXGo=:eyJzY29wZSI6ImJjaXJjbGUiLCJkZWFkbGluZSI6MTUwMTc1MjQzM30=';
//     this.uploader.queue[0].upload(); // 开始上传
//   }

//   changeModel() {
//     // this.defImg = $('#upload-file-id-' + this.name).val();
//     this.formModel.controls[this.name].setValue(this.defImg);
//     this.uploader.queue[0].remove(); // 上传过移除原有图片信息
//   }

// }