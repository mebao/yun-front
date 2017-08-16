/**
 */

(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("UploadImg requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
    // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    var extend = function (o, n, override) {
        for (var key in n) {
            o[key] = n[key];
        }
        return o;
    };
    var UploadImg = {};
    var isFinished = {};
    var imgInfo = {};

    var defaults = {
        id: '',//The container dom id
        multiple: true,
        maxCount: null,
        autoUpload: false,
        required: true,
        imgListArray: [],
        fileNum: '',
        upload: {
            uploadUrl: 'http://upload.qiniu.com/',
            token: '',
            tokenUrl: '',
            type: 'POST',
            async: true,
            nameSpace: '',
            submitBtnId: '',
            beforeCall: '',
            afterCall: '',
            params: {},
            btnHtml: '<div class="text"><p class="text-lg">+</p><p class="text-sm">点击添加图片</p></div>',
        }
    };


    function _init(config) {
        var options = extend(defaults, config);
        isFinished[options.id] = !options.required;
        var container = document.getElementById(options.id);
        container.innerHTML = '<div class="upload-img">\
                <div class="img-show" id="uploadImgShow_' + options.id + '">\
                </div>\
                <div class="form-box">\
                    <label for="uploadInputFile_' + options.id + '" id="forUploadAdd_' + options.id + '" class="add-icon">'+options.upload.btnHtml+'</label>\
                    <input type="file" class="fn-hide" ' + (options.multiple ? 'multiple' : '') + ' id="uploadInputFile_' + options.id + '">\
                </div>\
                <div class="btn-dock"><button class="btn btn-info" id="uploadButton_' + options.id + '">上传图片</button></div>\
        </div>';

        /**
         * the flag to control ReadFile obj is success. Then you can click the submit button. Because the user could
         * see the images before submit
         */
        var previewFinished = !options.required;
        var uploadInputFile = document.getElementById('uploadInputFile_' + options.id);
        var uploadImgShow = document.getElementById('uploadImgShow_' + options.id);
        var md5_sha1List = {};// the list save the different files md5+sha1 code. use to check the image file is the same or not.
        var upFileList = [];//the final push in upload files list. After check by name, md5, sha1
        var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        /**
         * the event when the files changed.
         */
        uploadInputFile.addEventListener('change', function () {
            previewFinished = false;
            var filesArray = uploadInputFile.files;
            var onceAddFilesList = {};
            var needCheckArray = [];

            if (options.maxCount && upFileList.length + filesArray.length > options.maxCount) {
                _toast('最多上传' + options.maxCount + '张图片，已选择了' + upFileList.length + '张。');
                return false;
            }

            /**
             * repeat the filesArray. First step to pass the same name files. Then add the FileReader obj to the name
             */
            for (var i = 0; i < filesArray.length; i++) {
                if (rFilter.test(filesArray[i].type)) {
                    var fileName = filesArray[i].name + filesArray[i].lastModified;
                    // if (onceAddFilesList.hasOwnProperty(fileName)) {
                    //     _toast('文件重名');
                    // } else {
                    if (onceAddFilesList[fileName]) {
                        onceAddFilesList[fileName].fileObj = filesArray[i];
                    } else {
                        onceAddFilesList[fileName] = {};
                        onceAddFilesList[fileName].fileObj = filesArray[i];
                    }
                    onceAddFilesList[fileName].checkReader = new FileReader();
                    onceAddFilesList[fileName].checkReader.readAsBinaryString(onceAddFilesList[fileName].fileObj);
                    onceAddFilesList[fileName].reader = new FileReader();
                    onceAddFilesList[fileName].reader.readAsDataURL(onceAddFilesList[fileName].fileObj);
                    needCheckArray.push(onceAddFilesList[fileName]);
                    // }
                } else {
                    _toast('您选择的' + filesArray[i].name + '不是图片文件');
                }
            }
            if (needCheckArray.length) {
                var interval = setInterval(function () {
                    var temp = needCheckArray[needCheckArray.length - 1];
                    if (temp.checkReader.readyState == 2 && temp.checkReader.result && temp.reader.readyState == 2 && temp.reader.result) {
                        clearInterval(interval);
                        while (needCheckArray.length) {
                            var temp = needCheckArray[0];
                            if (temp.checkReader.readyState == 2 && temp.checkReader.result && temp.reader.readyState == 2 && temp.reader.result) {
                                var thisObj = needCheckArray.shift();
                                var result = thisObj.checkReader.result;
                                var dataUrl = thisObj.reader.result;
                                var fileName = thisObj.fileObj.name;
                                var fileSize = _formatSize(thisObj.fileObj.size);
                                var code_md5 = md5(result);
                                var code_sha1 = hex_sha1(result);
                                if (!md5_sha1List.hasOwnProperty(code_md5 + '_' + code_sha1)) {
                                    md5_sha1List[code_md5 + '_' + code_sha1] = 1;
                                    var ele = document.createElement('div');
                                    ele.className = 'img-item';
                                    ele.id = code_md5 + '_' + code_sha1;
                                    ele.innerHTML = '<img src="' + dataUrl + '" alt="' + fileName + '" id="img_' + ele.id + '">\
                                        <div class="operate"><div class="size-tip"><div class="upload-progress" id="progress_' + ele.id + '"></div><span class="size-text">' + fileSize + '</span></div><div class="ct-rotate" operate-tag="upload_ctrlLeftRotate" ctrl-id="img_' + ele.id + '"><span class="counter-clock-wise fn-left" operate-tag="upload_ctrlLeftRotate" ctrl-id="img_' + ele.id + '"></span></div><div class="ct-rotate" operate-tag="upload_ctrlRightRotate" ctrl-id="img_' + ele.id + '"><span class="clock-wise fn-left ct-rotate" operate-tag="upload_ctrlRightRotate" ctrl-id="img_' + ele.id + '"></span></div><div class="btn-remove" operate-tag="upload_ctrlClose" ctrl-id="' + ele.id + '"><span class="circle-close" operate-tag="upload_ctrlClose" ctrl-id="' + ele.id + '"></span></div></div>\
                                    ';

                                    // for the new ele add the eventListener
                                    ele.addEventListener('click', function (event) {
                                        if (event.target.getAttribute('operate-tag') == 'upload_ctrlLeftRotate') {
                                            var img = document.getElementById(event.target.getAttribute('ctrl-id'));
                                            //TODO rotate left
                                        }
                                        if (event.target.getAttribute('operate-tag') == 'upload_ctrlRightRotate') {
                                            var img = document.getElementById(event.target.getAttribute('ctrl-id'));
                                            //TODO rotate right
                                        }
                                        if (event.target.getAttribute('operate-tag') == 'upload_ctrlClose') {
                                            var boxId = event.target.getAttribute('ctrl-id');
                                            var box = document.getElementById(boxId);
                                            for (var m = 0; m < upFileList.length; m++) {
                                                if (upFileList[m].id == boxId) {
                                                    upFileList.splice(m, 1);
                                                    delete md5_sha1List[boxId];
                                                }
                                            }
                                            document.getElementById('forUploadAdd_' + options.id).style.display = (options.maxCount && upFileList.length >= options.maxCount) ? 'none' : 'block';
                                            isFinished[options.id] = upFileList.length ? false : !options.required;
                                            box.remove();
                                        }
                                        if (event.target.tagName == 'IMG') {
                                            var src = event.target.src;
                                            var alt = event.target.getAttribute('alt');
                                            var detailBox = document.createElement('div');
                                            detailBox.id = 'uploadDetailImg';
                                            detailBox.className = 'upload-detail-img';
                                            detailBox.innerHTML = '<img src="' + src + '" alt="' + alt + '">';
                                            detailBox.addEventListener('click', function (event) {
                                                document.getElementById('uploadDetailImg').remove();
                                            });
                                            document.body.appendChild(detailBox);
                                        }
                                        //return file-num
                                        if (options.fileNum && typeof(options.fileNum) === 'function') {
                                            options.fileNum(upFileList.length);
                                        }
                                    });
                                    //end add eventListener.....................
                                    uploadImgShow.appendChild(ele);
                                    upFileList.push({
                                        id: ele.id,
                                        obj: thisObj.fileObj
                                    });
                                    isFinished[options.id] = upFileList.length ? false : !options.required;
                                    document.getElementById('forUploadAdd_' + options.id).style.display = (options.maxCount && upFileList.length >= options.maxCount) ? 'none' : 'block';
                                    //return file-num
                                    if (options.fileNum && typeof(options.fileNum) === 'function') {
                                        options.fileNum(upFileList.length);
                                    }
                                } else {
                                    isFinished[options.id] = upFileList.length ? false : !options.required;
                                    _toast(thisObj.fileObj.name + ',该文件内容重复，已自动过滤', 2);
                                }
                            }
                        }

                        //TODO change the finish flag to ture
                        previewFinished = true;
                    }
                }, 200);
            } else {
                previewFinished = upFileList.length ? true : false;
                isFinished[options.id] = upFileList.length ? false : !options.required;
            }
        });

        /**
         * add the upload event.
         */
        if (options.upload.submitBtnId) {
            var uploadButton = document.getElementById(options.upload.submitBtnId);
            document.getElementById('uploadButton_' + options.id).style.display = 'none';
        } else {
            var uploadButton = document.getElementById('uploadButton_' + options.id);
        }

        uploadButton.addEventListener('click', function () {
            if (!upFileList.length && options.required) {
                _toast('您还未添加图片');
                return false;
            }
            if (!previewFinished) {
                _toast('请等待图片加载后再上传');
                return false;
            }
            if (options.upload.beforeCall && typeof(options.upload.beforeCall) === 'function') {
                options.upload.beforeCall(doingCall);
            }else{
                doingCall();
            }
            function doingCall(config) {
                if(config.upload){
                    options.upload = extend(options.upload, config.upload);
                }else{
                    options.upload = extend(options.upload, config);
                }
                var finishCount = 0;
                if(upFileList.length){
                    for (var i = 0, len = upFileList.length; i < len; i++) {
                        //judge if the file have uploaded, ignore it.
                        if (!upFileList[i].key && !upFileList[i].hash) {
                            finishCount++;
                            _qiniuUpload(options, upFileList[i], i, function (res, index) {
                                //TODO check the res. Then add the backUrl to the upFileList by index.
                                if (res) {
                                    upFileList[index].key = res.key;
                                    upFileList[index].hash = res.hash;
                                    finishCount--;
                                    if (finishCount == 0) {
                                        imgInfo[options.id] = upFileList;
                                        isFinished[options.id] = true;
                                        if (options.upload.afterCall && typeof(options.upload.afterCall) === 'function') {
                                            options.upload.afterCall(upFileList);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    }

    //*********************end _init ***********************
    function _getToken(options) {
        if (options.upload.token) {
            return options.upload.token;
        }
        if (options.upload.tokenUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', options.upload.tokenUrl, false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var result = JSON.parse(xhr.responseText);
                        return result.results;
                    } else {
                        _toast('获取token失败');
                    }
                }
            };
            xhr.send();
        }
        return '';
    }

    /**
     * qiniu upload function
     * @param options
     * @param upFile
     * @param index
     * @param cb
     * @private
     */
    function _qiniuUpload(options, upFile, index, cb) {
        var res = _getToken(options);
        var token = (typeof (res) == 'string') ? res : (typeof (res) == 'object' ? res.uploadToken : '');
        var remoteDomain = (typeof (res) == 'object' ? res.remoteDomain : '');

        var upFile = upFile;
        var uploadDefaults = options.upload;
        var progressBar = document.getElementById('progress_' + upFile.id);
        var formData = new FormData();
        formData.append('file', upFile.obj);
        formData.append('name', upFile.obj.name);
        formData.append('type', upFile.obj.type);
        formData.append('lastModifiedDate', upFile.obj.lastModifiedDate);
        formData.append('size', upFile.obj.size);
        formData.append('token', token);// the qiniu upload accessKey.
        formData.append('key', (new Date()).getTime() + Math.floor(Math.random() * 100)+'.'+upFile.obj.name.substr(upFile.obj.name.lastIndexOf('.')+1));//the upload file in qiniu server's show name. Include this type nameSpace + fileName. Or an other way you could make sure the file's name is single.
        if (uploadDefaults.params) {
            for (key in uploadDefaults.params) {
                formData.append(key, uploadDefaults.params[key]);
            }
        }
        var xhr = new XMLHttpRequest();
        xhr.open(uploadDefaults.type, uploadDefaults.uploadUrl, uploadDefaults.async);
        if (uploadDefaults.header) {
            for (key in uploadDefaults.header) {
                xhr.setRequestHeader(key, uploadDefaults.header[key]);
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (cb && typeof(cb) == 'function') {
                        console.log('上传成功');
                        cb(JSON.parse(xhr.responseText), index);
                    } else {
                        console.log('上传成功');
                    }
                } else {
                    progressBar.style.width = '0%';
                    progressBar.style.color = '#f00';
                    progressBar.innerHTML = '失败';
                    _toast(upFile.obj.name + '上传失败，请点击重新上传');
                }
            }
        };
        if (progressBar) {
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    progressBar.style.color = '#fff';
                    progressBar.style.width = percentComplete + '%';
                    progressBar.innerHTML = (percentComplete == 100) ? '完成' : '';
                }
            }, false);
        }
        xhr.send(formData);
    }

    /**
     * the toast tip for the program running.
     * @param html
     * @param delay
     * @private
     */
    function _toast(html, delay) {
        var timeout = delay || 3;
        var ele = document.createElement('div');
        ele.id = (new Date()).getTime();
        ele.className = 'upload-toast';
        ele.innerHTML = '<table class="html-box">\
                <tr><td>' + html + '</td></tr>\
            </table>';
        document.body.appendChild(ele);
        setTimeout(function () {
            ele.remove();
        }, timeout * 1000);
    }

    /**
     * format the file size
     * @param byte
     * @returns {string}
     * @private
     */
    function _formatSize(byte) {
        if (byte < 1024) {
            return byte + 'B';
        }
        if (byte < (1024 * 1024) && byte >= 1024) {
            return Math.round((byte / 1024)) + 'Kb';
        }
        if (byte < (1024 * 1024 * 1024) && byte >= 1024 ^ 2) {
            return Math.round((byte / Math.pow(1024, 2))) + 'Mb';
        }
    }

    UploadImg.init = function (config) {
        return new _init(config);
    };
    UploadImg.isFinished = function (id) {
        return isFinished[id];
    };
    UploadImg.getImgInfo = function (id) {
        return imgInfo[id];
    };
    if (!noGlobal) {
        window.UploadImg = UploadImg;
    }
    return UploadImg;
}));
