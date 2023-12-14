import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateRegisterComponent } from './validate-register.component';

describe('ValidateRegisterComponent', () => {
  let component: ValidateRegisterComponent;
  let fixture: ComponentFixture<ValidateRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateRegisterComponent]
    });
    fixture = TestBed.createComponent(ValidateRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
