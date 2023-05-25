import { Component, OnInit } from '@angular/core';
import { UserService, TranslationStorageService } from '../lesInjectables';
import { Translation } from '../modelUser';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-jeu-liaison',
  templateUrl: './jeu-liaison.component.html',
  styleUrls: ['./jeu-liaison.component.css']
})
export class JeuLiaisonComponent implements OnInit {
  translations: Translation[] = [];
  selectedTranslations: Translation[] = [];
  canSelectCards: boolean = true;
  selectedCards: Translation[] = [];
  matchedCards: Translation[] = [];
  progressBarValue: number = 0;

  constructor(
    private userService: UserService,
    private translationStorageService: TranslationStorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    const userId = await firstValueFrom(this.userService.getUserId());
    if (userId) {
      const translations = await firstValueFrom(this.translationStorageService.getTranslations(userId));
      if (translations) {
        this.translations = translations;
      }
      this.initGame();
    }
  }
  

  initGame() {
    this.selectedTranslations = this.shuffleArray([...this.translations]).slice(0, 6);

    const mixedCards = this.selectedTranslations.flatMap(translation => [
      { ...translation, displayText: translation.sourceText },
      { ...translation, displayText: translation.translatedText },
    ]);

    this.selectedTranslations = this.shuffleArray(mixedCards);
  }

  shuffleArray(array: Translation[]): Translation[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  selectCard(card: Translation) {
    if (!this.canSelectCards || this.selectedCards.includes(card) || this.matchedCards.includes(card)) {
      return;
    }
  
    this.selectedCards.push(card);
  
    if (this.selectedCards.length === 2) {
      this.canSelectCards = false;
      setTimeout(() => this.checkMatch(), 1000);
    }
  }

  isCardCorrect(card: Translation): boolean {
    return (card as any)['isCorrect'];
  }
  
  isCardIncorrect(card: Translation): boolean {
    return (card as any)['isIncorrect'];
  }  

  checkMatch() {
    const [card1, card2] = this.selectedCards;
  
    if ((card1.sourceText === card2.translatedText && card1.translatedText === card2.sourceText) ||
        (card1.translatedText === card2.translatedText && card1.sourceText === card2.sourceText)) {
      this.matchedCards.push(...this.selectedCards);
      this.selectedCards.forEach(card => {
        (card as any)['isCorrect'] = true;
      });
  
      this.progressBarValue += 100 / 6;

      if (this.progressBarValue >= 100) {
        this.router.navigate(['/Jeux']);
      }
  
      setTimeout(() => {
        this.selectedCards.forEach(card => {
          delete (card as any)['isCorrect'];
          (card as any)['isDimmed'] = true;
        });
        this.selectedCards = [];
        this.canSelectCards = true;
      }, 500);
    } else {
      this.selectedCards.forEach(card => {
        (card as any)['isIncorrect'] = true;
      });
      setTimeout(() => {
        this.selectedCards.forEach(card => {
          delete (card as any)['isIncorrect'];
          delete (card as any)['isDimmed'];
        });
        this.selectedCards = [];
        this.canSelectCards = true;
        }, 500);
      }
    }
    
    isCardDimmed(card: Translation): boolean {
      return (card as any)['isDimmed'];
    }
    
    trackByCard(_: number, card: Translation): string {
      return card.sourceText + card.translatedText;
  }
}
