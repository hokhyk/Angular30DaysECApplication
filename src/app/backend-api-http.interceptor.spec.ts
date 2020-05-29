import { TestBed } from '@angular/core/testing';

import { BackendApiHttpInterceptor } from './backend-api-http.interceptor';

describe('BackendApiHttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BackendApiHttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BackendApiHttpInterceptor = TestBed.inject(BackendApiHttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
