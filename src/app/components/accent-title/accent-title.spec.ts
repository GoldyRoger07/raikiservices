import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccentTitle } from './accent-title';

describe('AccentTitle', () => {
  let component: AccentTitle;
  let fixture: ComponentFixture<AccentTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccentTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(AccentTitle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
