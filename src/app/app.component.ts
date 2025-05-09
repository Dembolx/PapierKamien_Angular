import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule],
})
export class AppComponent {
  // Dostępne wybory
  choices = [
    { id: 'kamien', name: 'Kamień', image: 'assets/kamien1.png' },
    { id: 'papier', name: 'Papier', image: 'assets/papier1.png' },
    { id: 'nozyce', name: 'Nożyce', image: 'assets/nozyce1.png' },
  ];

  // Wybory gracza
  playerSelections: string[] = [];

  // Wybory komputera
  computerSelections: string[] = [];

  // Aktualna faza gry
  gamePhase: 'selection' | 'round1' | 'round2' | 'result' = 'selection';

  // Wyniki
  round1Result = '';
  round2Result = '';
  finalResult = '';
  playerScore = 0;
  computerScore = 0;

  // Wybór gracza na rundę
  selectedForRound?: string;

  // Wybór gracza
  selectChoice(choice: string) {
    if (this.playerSelections.length < 2) {
      this.playerSelections.push(choice);

      // Automatyczne przejście do gry po wybraniu 2 opcji
      if (this.playerSelections.length === 2) {
        this.prepareComputerSelections();
        this.gamePhase = 'round1';
      }
    }
  }

  // Przygotowanie wyborów komputera
  prepareComputerSelections() {
    const shuffled = [...this.choices].sort(() => Math.random() - 0.5);
    this.computerSelections = [shuffled[0].id, shuffled[1].id];
  }

  // Wybór na rundę
  selectForRound(choice: string) {
    this.selectedForRound = choice;
  }

  // Rozpoczęcie rundy
  startRound(round: number) {
    if (!this.selectedForRound) return;

    const playerChoice = this.selectedForRound;

    // Losowy wybór komputera z jego dwóch dostępnych opcji
    const computerChoice =
      this.computerSelections[
        Math.floor(Math.random() * this.computerSelections.length)
      ];

    const result = this.determineWinner(playerChoice, computerChoice);

    if (round === 1) {
      this.round1Result = `Ty: ${playerChoice}, Komputer: ${computerChoice} → ${result.message}`;
      if (result.winner === 'player') this.playerScore++;
      if (result.winner === 'computer') this.computerScore++;
      this.gamePhase = 'round2';
    } else {
      this.round2Result = `Ty: ${playerChoice}, Komputer: ${computerChoice} → ${result.message}`;
      if (result.winner === 'player') this.playerScore++;
      if (result.winner === 'computer') this.computerScore++;
      this.determineFinalResult();
      this.gamePhase = 'result';
    }

    this.selectedForRound = undefined;
  }

  // Logika określania zwycięzcy
  determineWinner(player: string, computer: string) {
    if (player === computer) {
      return { winner: 'draw', message: 'Remis!' };
    }

    const winConditions: Record<string, string> = {
      kamien: 'nozyce',
      papier: 'kamien',
      nozyce: 'papier',
    };

    if (winConditions[player] === computer) {
      return { winner: 'player', message: 'Wygrałeś rundę!' };
    } else {
      return { winner: 'computer', message: 'Przegrałeś rundę!' };
    }
  }

  // Określenie końcowego wyniku
  determineFinalResult() {
    if (this.playerScore > this.computerScore) {
      this.finalResult = 'Wygrałeś cały pojedynek!';
    } else if (this.computerScore > this.playerScore) {
      this.finalResult = 'Przegrałeś cały pojedynek.';
    } else {
      this.finalResult = 'Remis w całym pojedynku!';
    }
  }

  // Reset gry
  resetGame() {
    this.playerSelections = [];
    this.computerSelections = [];
    this.playerScore = 0;
    this.computerScore = 0;
    this.round1Result = '';
    this.round2Result = '';
    this.finalResult = '';
    this.gamePhase = 'selection';
    this.selectedForRound = undefined;
  }
}
