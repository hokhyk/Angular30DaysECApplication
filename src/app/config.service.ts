import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: any;
  constructor(private httpClient: HttpClient) { }

  initData() {
    return this.httpClient
      .get('https://jsonplaceholder.typicode.com/todos/')
      .pipe(tap(config => (this.config = config)))
      .toPromise();
  }
}
