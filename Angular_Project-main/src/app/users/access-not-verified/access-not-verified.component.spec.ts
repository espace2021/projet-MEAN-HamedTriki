import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessNotVerifiedComponent } from './access-not-verified.component';

describe('AccessNotVerifiedComponent', () => {
  let component: AccessNotVerifiedComponent;
  let fixture: ComponentFixture<AccessNotVerifiedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessNotVerifiedComponent]
    });
    fixture = TestBed.createComponent(AccessNotVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
