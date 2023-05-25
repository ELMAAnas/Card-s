import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuQuizzComponent } from './jeu-quizz.component';

describe('JeuQuizzComponent', () => {
  let component: JeuQuizzComponent;
  let fixture: ComponentFixture<JeuQuizzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeuQuizzComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
