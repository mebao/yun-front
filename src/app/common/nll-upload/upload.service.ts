import { Injectable }             from '@angular/core';
import { Subject }                from 'rxjs/Subject';
import { Observable }             from 'rxjs/Observable';

@Injectable()
export class UploadService {
    private uploadSubject = new Subject<void>();

    uploadFile(): Observable<void> {
        return this.uploadSubject;
    }

    startUpload() {
        this.uploadSubject.next();
    }
}
