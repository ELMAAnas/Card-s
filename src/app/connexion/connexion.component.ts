import { Component } from '@angular/core';
import { AuthService } from '../lesInjectables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  pseudo = '';
  mot_de_passe = '';

  constructor(private authService: AuthService, private router: Router) {}

  onConnexion() {
    console.log("La méthode onConnexion est appelée");
    const credentials = {
      pseudo: this.pseudo,
      mot_de_passe: this.mot_de_passe
    };
  
    this.authService.connexion(credentials)
      .subscribe(response => {
        console.log('Connexion avec succès : ', response);
        
        // Stocker l'userId et le token dans le localStorage
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('token', response.token);

        // Connecté avec succès
        this.router.navigate(['/Mots']);
      }, error => {
        console.error(error);
        // Gérer l'erreur, par exemple en affichant un message d'erreur
      });
  }
}
