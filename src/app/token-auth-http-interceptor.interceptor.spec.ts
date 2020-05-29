import { TestBed } from '@angular/core/testing';

import { TokenAuthHttpInterceptorInterceptor } from './token-auth-http-interceptor.interceptor';

describe('TokenAuthHttpInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenAuthHttpInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenAuthHttpInterceptorInterceptor = TestBed.inject(TokenAuthHttpInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
