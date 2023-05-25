import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './lesInjectables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MotsComponent } from './mots/mots.component';
import { TraductionComponent } from './traduction/traduction.component';
import { TestComponent } from './test/test.component';
import { BoutiqueComponent } from './boutique/boutique.component';
import { JeuxComponent } from './jeux/jeux.component';
import { JeuLiaisonComponent } from './jeu-liaison/jeu-liaison.component';
import { JeuQuizzComponent } from './jeu-quizz/jeu-quizz.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    MotsComponent,
    TraductionComponent,
    TestComponent,
    BoutiqueComponent,
    JeuxComponent,
    JeuLiaisonComponent,
    JeuQuizzComponent,
    ConnexionComponent,
    InscriptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
