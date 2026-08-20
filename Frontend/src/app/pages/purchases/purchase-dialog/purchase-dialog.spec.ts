import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDialog } from './purchase-dialog';

describe('PurchaseDialog', () => {
  let component: PurchaseDialog;
  let fixture: ComponentFixture<PurchaseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
