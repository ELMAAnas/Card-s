import { Component } from '@angular/core';
import { TranslateService, TranslationStorageService, AuthService } from '../lesInjectables';

@Component({
  selector: 'app-traduction',
  templateUrl: './traduction.component.html',
  styleUrls: ['./traduction.component.css']
})
export class TraductionComponent {
  public sourceText = '';
  public translatedText = '';
  public userId!: string;
  public translations: any[] = [];

  constructor(
    private translateService: TranslateService,
    private translationStorageService: TranslationStorageService,
    private authService: AuthService
  ) {
    this.fetchUserIdAndTranslations();
    this.translationStorageService.translationAdded$.subscribe(() => {
      this.fetchTranslations();
    });
  }
  

  public fetchUserIdAndTranslations(): void {  
    const token = localStorage.getItem('token');  
    if (token) {  
      const userIdFromToken = this.authService.getUserIdFromToken(token);  
      if (userIdFromToken) {  
        this.userId = userIdFromToken;
        console.log('User ID:', this.userId);  // Log the user ID.
        this.fetchTranslations();  
      } else {  
        console.error('User ID not found in the token');  
      }  
    } else {  
      console.error('Token not found in local storage');  
    }  
  }  
  
  public fetchTranslations(): void {  
    this.translationStorageService.getTranslations(this.userId).subscribe(  
      translations => {  
        this.translations = translations;  
        console.log('Translations:', this.translations);  // Log the translations.
      },  
      error => console.error('Erreur lors de la récupération des traductions:', error)  
    );  
  }  

  public translateText(): void {
    console.log('Traduction en cours...');
    this.translationStorageService.checkDailyLimit(this.userId).subscribe((remainingTranslations) => {
      if (remainingTranslations > 0) {
        this.translateService.translate('en', 'fr', this.sourceText)
        .subscribe(
          response => {
            console.log('Réponse de la traduction:', response);
            if (Array.isArray(response)) {
              this.translatedText = response[0];
              console.log('Enregistrement de la traduction...');
              this.translationStorageService.saveTranslation(this.userId, this.sourceText, this.translatedText)
                .subscribe(
                  () => {
                    console.log('Traduction enregistrée avec succès.');
                    this.fetchTranslations();
                  },
                  error => console.error('Erreur lors de l\'enregistrement de la traduction:', error)
                );
            } else {
              console.error('Unexpected response format:', response);
            }
          },
          error => console.error('Erreur lors de la traduction:', error)
        );
      } else {
        console.error('Erreur lors de la traduction: La limite quotidienne de 5 traductions a été atteinte.');
      }
    });
  }
}
