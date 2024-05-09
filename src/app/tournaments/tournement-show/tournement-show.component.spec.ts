import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournementShowComponent } from './tournement-show.component';

describe('TournementShowComponent', () => {
  let component: TournementShowComponent;
  let fixture: ComponentFixture<TournementShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournementShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TournementShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
