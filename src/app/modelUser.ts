export interface User {
  nom: string;
  prenom: string;
  pseudo: string;
  date_naissance: Date;
  mot_de_passe: string;
  translations: Translation[];
  translationCount: number;
  lastTranslationDate: Date;
}

export interface Translation {
  sourceText: string;
  translatedText: string;
  displayText?: string;
  isIncorrect?: boolean;
  userId: string;
  createdAt: Date;
  user?: User;
}
