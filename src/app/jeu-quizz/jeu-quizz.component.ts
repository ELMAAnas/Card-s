import { Component, OnInit } from '@angular/core';
import { UserService, AuthService, TranslationStorageService } from '../lesInjectables';
import { Translation } from '../modelUser';

@Component({
  selector: 'app-jeu-quizz',
  templateUrl: './jeu-quizz.component.html',
  styleUrls: ['./jeu-quizz.component.css']
})
export class JeuQuizzComponent implements OnInit {
  translations: Translation[] = [];
  wordToTranslate!: string;
  correctAnswer!: string;
  answerOptions: string[] = [];
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private translationStorageService: TranslationStorageService
  ) {}

  async ngOnInit() {
    const userId = await this.userService.getUserId().toPromise();
    if (userId) {
      const translations = await this.translationStorageService.getTranslations(userId).toPromise();
      if (translations) {
        this.translations = translations;
      }
      this.initGame();
    }
  }

  initGame() {
    const randomTranslation = this.translations[Math.floor(Math.random() * this.translations.length)];
    this.wordToTranslate = randomTranslation.sourceText;
    this.correctAnswer = randomTranslation.translatedText;

    this.answerOptions = [this.correctAnswer];
    while (this.answerOptions.length < 4) {
      const randomOption = this.translations[Math.floor(Math.random() * this.translations.length)].translatedText;
      if (!this.answerOptions.includes(randomOption)) {
        this.answerOptions.push(randomOption);
      }
    }

    this.answerOptions = this.shuffleArray(this.answerOptions);
    this.updateProgressBar();
  }

  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
  
    if (answer === this.correctAnswer) {
      setTimeout(() => {
        if (this.currentQuestionIndex + 1 < this.translations.length) {
          this.currentQuestionIndex++;
          this.initGame();
        }
      }, 1000);
      console.log("Bonne réponse !");
    } else {
      setTimeout(() => {
        this.selectedAnswer = null;
      }, 1000);
      console.log("Mauvaise réponse, essayez encore.");
    }
  }
  
  

  updateProgressBar() {
    const progressPercentage = ((this.currentQuestionIndex + 1) / this.translations.length) * 100;
    const progressBarElement = document.querySelector('.progressbar_color') as HTMLElement;
    progressBarElement.style.width = `${progressPercentage}%`;
  }
}
