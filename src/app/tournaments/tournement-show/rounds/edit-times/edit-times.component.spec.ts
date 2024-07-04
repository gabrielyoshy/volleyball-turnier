import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimesComponent } from './edit-result.component';

describe('EditTimesComponent', () => {
  let component: EditTimesComponent;
  let fixture: ComponentFixture<EditTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTimesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
