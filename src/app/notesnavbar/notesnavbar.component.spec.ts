import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesnavbarComponent } from './notesnavbar.component';

describe('NotesnavbarComponent', () => {
  let component: NotesnavbarComponent;
  let fixture: ComponentFixture<NotesnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesnavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
