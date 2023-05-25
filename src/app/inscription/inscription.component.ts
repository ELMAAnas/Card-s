import { Component } from '@angular/core';
import { User } from '../modelUser';
import { UserService } from '../lesInjectables';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  nom!: string;
  prenom!: string;
  pseudo!: string;
  dateNaissance!: Date;
  motDePasse!: string;

  constructor(private userService: UserService) {}

  onSubmit() {
    const user: User = {
      nom: this.nom,
      prenom: this.prenom,
      pseudo: this.pseudo,
      date_naissance: new Date(this.dateNaissance),
      mot_de_passe: this.motDePasse,
      translations: [],
      translationCount: 0,
      lastTranslationDate: new Date(),
    };
    this.userService.addUser(user)
      .subscribe(
        (response) => {
          console.log('Utilisateur ajouté :', response.pseudo);
        },
        (error) => {
          if (error.error && error.error.message && error.error.message.includes('E11000')) {
            console.log('Erreur : Le pseudo existe déjà dans la base de données.');
          } else {
            console.log('Erreur lors de l\'ajout de l\'utilisateur :', error);
          }
        }
      );
  }
  
}
