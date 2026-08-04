import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparatorDesign } from './separator-design';

describe('SeparatorDesign', () => {
  let component: SeparatorDesign;
  let fixture: ComponentFixture<SeparatorDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparatorDesign],
    }).compileComponents();

    fixture = TestBed.createComponent(SeparatorDesign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
