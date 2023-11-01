import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { Llama } from './llama';
import { LlamasService } from './llamas.service';

const AVAILABLE_WIDTH = 620;
const INITIAL_POSITION = AVAILABLE_WIDTH / 2;
const STEP_SIZE = AVAILABLE_WIDTH / 100;

type Position = 'left' | 'right';

@Component({
  selector: 'app-llamas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './llamas.component.html',
  styleUrls: ['./llamas.component.scss'],
})
export class LlamasComponent implements OnInit {
  private readonly llamasService = inject(LlamasService);
  private readonly snackBar = inject(MatSnackBar);

  protected searchText = signal('');

  protected llamas = signal<Llama[]>([]);
  protected selectedLlama = signal<Llama | undefined>(undefined);

  protected llamaPosition = signal(INITIAL_POSITION);
  protected llamaDirection = signal<Position>('left');

  protected resultCount = computed(() => this.filteredLlamas().length);

  protected filteredLlamas = computed(() => {
    if (this.searchText() !== '') {
      return this.llamas().filter((llama) =>
        llama.name.toLowerCase().includes(this.searchText().toLowerCase())
      );
    } else {
      return this.llamas();
    }
  });

  constructor() {
    effect(() => {
      console.log(`Result count changed: ${this.resultCount()}`);
    });
  }

  ngOnInit(): void {
    this.llamasService
      .fetchLlamas()
      .pipe(first())
      .subscribe((llamas) => this.llamas.set(llamas));
  }

  protected walkTheLlama(llama: Llama): void {
    this.snackBar.open(
      `Good boy, ${llama.name}.`,
      '*pet* *pet* *feeding with carrot*',
      { horizontalPosition: 'right', verticalPosition: 'top', duration: 2000 }
    );
    this.selectedLlama.set(llama);
  }

  protected searchTextChanged(value: string): void {
    this.searchText.set(value);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      if (this.llamaPosition() > 0) {
        this.llamaPosition.update((value) => value - STEP_SIZE);
        this.llamaDirection.set('left');
      }
    } else if (event.key === 'ArrowRight') {
      if (this.llamaPosition() < AVAILABLE_WIDTH) {
        this.llamaPosition.update((value) => value + STEP_SIZE);
        this.llamaDirection.set('right');
      }
    }
  }
}
