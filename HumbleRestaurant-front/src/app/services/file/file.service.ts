import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Http, Response, Headers} from '@angular/http';
import {CONFIG} from '../../app.config';

@Injectable()
export class FileService {

  constructor(private http: Http) { }

  uploadFile(formData: FormData) {
    const headers = new Headers({'content-type' : 'multipart/form-data'});
    return this.http.post(CONFIG.image_url, formData, headers)
        .toPromise()
        .then( (res: Response) => res.json() )
        .catch(this.handleError);
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
