import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoutiqueComponent } from './boutique/boutique.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { JeuLiaisonComponent } from './jeu-liaison/jeu-liaison.component';
import { JeuQuizzComponent } from './jeu-quizz/jeu-quizz.component';
import { JeuxComponent } from './jeux/jeux.component';
import { MotsComponent } from './mots/mots.component';
import { TestComponent } from './test/test.component';
import { TraductionComponent } from './traduction/traduction.component';
import { GuardConnexionGuard } from './GuardConnexion/guard-connexion.guard';

const routes: Routes = [
  { path: 'Mots', component: MotsComponent, canActivate: [GuardConnexionGuard] },
  { path: 'Traduction', component: TraductionComponent, canActivate: [GuardConnexionGuard] },
  { path: 'Boutique', component: BoutiqueComponent, canActivate: [GuardConnexionGuard]},
  { path: 'Jeux', component: JeuxComponent, canActivate: [GuardConnexionGuard]},
  { path: 'Jeux/jeu_de_liaison', component: JeuLiaisonComponent, canActivate: [GuardConnexionGuard]},
  { path: 'Jeux/jeu_quizz', component: JeuQuizzComponent, canActivate: [GuardConnexionGuard]},
  { path: 'Test', component: TestComponent},
  { path: 'Connexion', component: ConnexionComponent},
  { path: 'Inscription', component: InscriptionComponent},

  //Page d'accueil par défaut 
  { path: '', redirectTo: 'Connexion', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
