import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Http, Response, Headers} from '@angular/http';

@Injectable()
export class FileService {

  constructor(private http: Http) { }

  uploadFile(formData: FormData) {
    const headers = new Headers({'content-type' : 'multipart/form-data'});
    return this.http.post(window.location.origin+':3100', formData, headers)
        .toPromise()
        .then( (res: Response) => res.json() )
        .catch(this.handleError);
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
