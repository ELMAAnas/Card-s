import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuLiaisonComponent } from './jeu-liaison.component';

describe('JeuLiaisonComponent', () => {
  let component: JeuLiaisonComponent;
  let fixture: ComponentFixture<JeuLiaisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeuLiaisonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuLiaisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
