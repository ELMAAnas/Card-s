import { AuthService } from '../lesInjectables';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslationStorageService } from '../lesInjectables';

@Component({
  selector: 'app-mots',
  templateUrl: './mots.component.html',
  styleUrls: ['./mots.component.css']
})
export class MotsComponent {
  public translations: any[] = [];
  public userId!: string;

  constructor (
    private translationStorageService: TranslationStorageService,
    private authService: AuthService
  ) {
    this.fetchUserIdAndTranslations();
  }

  public fetchUserIdAndTranslations(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = this.authService.getUserIdFromToken(token);
      if (userId) {
        this.userId = userId;
        this.fetchTranslations();
      } else {
        console.error('Invalid token or user ID not found in token');
      }
    } else {
      console.error('Token not found in local storage');
    }
  }
  

  public fetchTranslations(): void {
    this.translationStorageService.getTranslations(this.userId)
      .subscribe(
        translations => this.translations = translations,
        error => console.error('Erreur lors de la récupération des traductions:', error)
      );
  }

  @ViewChild('deleteButton', { static: false }) deleteButton!: ElementRef;
  @ViewChild('threeDots', { static: false }) threeDots!: ElementRef;

  public showDeleteButton() {
    this.threeDots.nativeElement.style.display = 'none';
    this.deleteButton.nativeElement.style.display = 'block';
  }
  
  public hideDeleteButton() {
    this.threeDots.nativeElement.style.display = 'block';
    this.deleteButton.nativeElement.style.display = 'none';
  }

  public deleteTranslation(translation: any): void {
    this.translationStorageService.deleteTranslation(this.userId, translation._id)
        .subscribe(
            () => {
                console.log('Traduction supprimée avec succès');
                // Mettre à jour la liste des traductions
                this.fetchTranslations();
            },
            error => console.error('Erreur lors de la suppression de la traduction:', error)
        );
  }
}
