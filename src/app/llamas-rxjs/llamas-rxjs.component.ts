import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  first,
  map,
  tap,
} from 'rxjs';
import { Llama } from 'src/app/llamas/llama';
import { LlamasService } from 'src/app/llamas/llamas.service';

const AVAILABLE_WIDTH = 620;
const INITIAL_POSITION = AVAILABLE_WIDTH / 2;
const STEP_SIZE = AVAILABLE_WIDTH / 100;

type Position = 'left' | 'right';

@Component({
  selector: 'app-llamas-rxjs',
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
  templateUrl: './llamas-rxjs.component.html',
  styleUrls: ['../llamas/llamas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlamasRxjsComponent {
  private readonly llamasService = inject(LlamasService);
  private readonly snackBar = inject(MatSnackBar);

  protected searchText$ = new BehaviorSubject('');
  protected llamas$: Observable<Llama[]> = this.llamasService.fetchLlamas();
  protected selectedLlama$ = new Subject<Llama | undefined>();

  protected llamaPosition$ = new BehaviorSubject(INITIAL_POSITION);
  protected llamaDirection$ = new BehaviorSubject<Position>('left');

  protected filteredLlamas$: Observable<Llama[]> = combineLatest([
    this.searchText$,
    this.llamas$,
  ]).pipe(
    map(([searchText, llamas]) => {
      console.log('Recalculating Observable "filteredLlamas$".');
      if (searchText !== '') {
        return llamas.filter((llama) =>
          llama.name.toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        return llamas;
      }
    })
  );

  protected resultCount: Observable<number> = this.filteredLlamas$.pipe(
    map((filteredLlamas) => filteredLlamas.length)
  );

  protected walkTheLlama(llama: Llama): void {
    this.snackBar.open(
      `Good boy, ${llama.name}.`,
      '*pet* *pet* *feeding with carrot*',
      { horizontalPosition: 'right', verticalPosition: 'top', duration: 2000 }
    );
    this.selectedLlama$.next(llama);
  }

  protected searchTextChanged(value: string): void {
    this.searchText$.next(value);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      if (this.llamaPosition$.getValue() > 0) {
        this.llamaPosition$.next(this.llamaPosition$.getValue() - STEP_SIZE);
        this.llamaDirection$.next('left');
      }
    } else if (event.key === 'ArrowRight') {
      if (this.llamaPosition$.getValue() < AVAILABLE_WIDTH) {
        this.llamaPosition$.next(this.llamaPosition$.getValue() + STEP_SIZE);
        this.llamaDirection$.next('right');
      }
    }
  }
}
