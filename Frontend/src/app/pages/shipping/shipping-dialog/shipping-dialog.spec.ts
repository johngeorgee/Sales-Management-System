import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingDialog } from './shipping-dialog';

describe('ShippingDialog', () => {
  let component: ShippingDialog;
  let fixture: ComponentFixture<ShippingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
