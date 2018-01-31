import { Component, Input, Output, EventEmitter }    from '@angular/core';
import { DomSanitizer }                              from '@angular/platform-browser';

import { UploadService }                             from './upload.service';

@Component({
    selector: 'nll-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})

export class UploadComponent{
    fileList: any[];
    @Input() qiniuToken: string;
    @Input() multiple: boolean = false;
    @Input() acceptType: string;
    @Output() overUpload = new EventEmitter<{
        status: string,
        fileList: any[],
    }>();
    @Output() errorUpload = new EventEmitter<{
        status: string,
        errorMsg: string,
    }>();
    finishCount: number;
    successCount: number;
    uploadStatus: string;
    uploadValue: any;

    constructor(
		private sanitizer: DomSanitizer,
        private uploadService: UploadService,
    ) {
        this.uploadService.uploadFile().forEach(() => {
            this._upload();
        });
    }

    ngOnInit() {
        this.fileList = [];
        this.finishCount = 0;
        this.successCount = 0;
        this.uploadStatus = '';
    }

    selectedFile(_file) {
        const that = this;
        var fileJson = _file.target['files'];
    	for(var i = 0; i < fileJson.length; i++){
    		if(fileJson[i].name && fileJson[i].size){
	    		var file = fileJson[i];
		        var reader = new FileReader();
		        reader.readAsDataURL(file);
		        reader.onload = function(f: any) {
                    // if(that.acceptType.indexOf(file.name.substr(file.name.lastIndexOf('.') + 1)) != -1){
                        that.fileList.push({
                            src: f.target.result,
                            isImg: file.type.indexOf('image') != -1,
                            name: file.name,
                            file: file,
                            uploadStatus: '',
                        });
                    // }else{
                    //     that.errorUpload.emit({
                    //         status: 'success',
                    //         errorMsg: '不支持' + file.name.substr(file.name.lastIndexOf('.') + 1) + '文件',
                    //     });
                    // }
		        }
    		}
    	}
        this.uploadValue = this.uploadValue == undefined ? '' : undefined;
    }

    remove(file) {
        this.fileList.splice(this.fileList.indexOf(file), 1);
    }

    _upload() {
        if(this.fileList.length > 0){
            this.uploadStatus = 'upload';
            const that = this;
            for(var i = 0; i < this.fileList.length; i++){
                this._qiniuUpload(this.fileList[i]);
            }
        }else{
            this.overUpload.emit({
                status: 'success',
                fileList: this.fileList,
            });
        }
    }

    _qiniuUpload(file) {
        var that = this;
        var file_index = this.fileList.indexOf(file);
        // 第一次上传或上传失败
        if(this.fileList[file_index].uploadStatus == '' || this.fileList[file_index].uploadStatus == 'no'){
            var file = this.fileList[file_index].file;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name);
            formData.append('type', file.type);
            formData.append('lastModifiedDate', file.lastModifiedDate);
            formData.append('size', file.size);
            formData.append('token', that.qiniuToken);// the qiniu upload accessKey.
            formData.append('key', (new Date()).getTime() + Math.floor(Math.random() * 100)+'.'+file.name.substr(file.name.lastIndexOf('.')+1));

            var xhr = new XMLHttpRequest();
            xhr.open('post', 'http://upload.qiniu.com/', false);
            xhr.onreadystatechange = function () {
                that.finishCount++;
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var res = JSON.parse(xhr.responseText);
                        if (res) {
                            that.fileList[file_index].key = res.key;
                            that.fileList[file_index].hash = res.hash;
                            that.fileList[file_index].uploadStatus = 'success';
                            that.successCount++;
                            if (that.successCount == that.fileList.length) {
                                that.overUpload.emit({
                                    status: 'success',
                                    fileList: that.fileList,
                                });
                            }
                        }else{
                            that.uploadFiled(file_index);
                        }
                    } else {
                        that.uploadFiled(file_index);
                    }
                }else{
                    that.uploadFiled(file_index);
                }
            };
            xhr.send(formData);
        }
    }

    uploadFiled(file_index) {
        // 上传失败
        this.fileList[file_index].uploadStatus = 'no';
        if(this.finishCount == this.fileList.length){
            this.uploadStatus = 'hasFailed';
        }
    }

    confirmUpload() {
        this.uploadStatus = 'comfirm';
        this.overUpload.emit({
            status: 'success',
            fileList: this.fileList,
        });
    }
}
