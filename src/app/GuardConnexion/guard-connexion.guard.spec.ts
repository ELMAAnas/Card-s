import { TestBed } from '@angular/core/testing';

import { GuardConnexionGuard } from './guard-connexion.guard';

describe('GuardConnexionGuard', () => {
  let guard: GuardConnexionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardConnexionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
