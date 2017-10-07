import { Injectable } from '@angular/core';
import {Payment} from '../../models/Payment.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';
import {Search} from '../../models/Search.model';
import {Http, Response, Headers} from '@angular/http';

@Injectable()
export class PaymentService {
  constructor(private http: Http) { }

  searchPayments(search) {
    const payments = new BehaviorSubject<Payment[]>([]);
    const headers = new Headers({'content-type' : 'application/json'});
    this.http.post('api/v1/payments/query', search, headers)
      .toPromise()
      .then((res: Response) => {
        payments.next(res.json());
      })
      .catch(this.handleError);

    return payments.asObservable();
  }

  addPeyment(payment) {
    return this.http.post('api/v1/payments', payment)
            .toPromise()
            .then((res) => res.json())
            .catch(error => this.handleError(error));
  }

  updatePayment(payment) {
    return this.http.put('api/v1/payments', payment)
      .toPromise()
      .then((res) => res.json())
      .catch(error => this.handleError(error));
  }

  handleError(error: any) {
    console.error('Error occured.', error);
    return Promise.reject(error.body || error);
  }
}
