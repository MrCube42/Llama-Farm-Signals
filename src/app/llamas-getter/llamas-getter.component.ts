import { CommonModule } from '@angular/common';
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
import { first } from 'rxjs';
import { Llama } from 'src/app/llamas/llama';
import { LlamasService } from 'src/app/llamas/llamas.service';

const AVAILABLE_WIDTH = 620;
const INITIAL_POSITION = AVAILABLE_WIDTH / 2;
const STEP_SIZE = AVAILABLE_WIDTH / 100;

type Position = 'left' | 'right';

@Component({
  selector: 'app-llamas-getter',
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
  templateUrl: './llamas-getter.component.html',
  styleUrls: ['../llamas/llamas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlamasGetterComponent implements OnInit {
  private readonly llamasService = inject(LlamasService);
  private readonly snackBar = inject(MatSnackBar);

  protected searchText = '';
  protected llamas: Llama[] = [];

  protected selectedLlama: Llama | undefined = undefined;

  protected llamaPosition = INITIAL_POSITION;
  protected llamaDirection: Position = 'left';

  protected get filteredLlamas(): Llama[] {
    console.log('Getter "filteredLlamas" is called.');
    if (this.searchText !== '') {
      return this.llamas.filter((llama) =>
        llama.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      return this.llamas;
    }
  }

  protected get resultCount(): number {
    return this.filteredLlamas.length;
  }

  ngOnInit(): void {
    this.llamasService
      .fetchLlamas()
      .pipe(first())
      .subscribe((llamas) => (this.llamas = llamas));
  }

  protected walkTheLlama(llama: Llama): void {
    this.snackBar.open(
      `Good boy, ${llama.name}.`,
      '*pet* *pet* *feeding with carrot*',
      { horizontalPosition: 'right', verticalPosition: 'top', duration: 2000 }
    );
    this.selectedLlama = llama;
  }

  protected searchTextChanged(value: string): void {
    this.searchText = value;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      if (this.llamaPosition > 0) {
        this.llamaPosition -= STEP_SIZE;
        this.llamaDirection = 'left';
      }
    } else if (event.key === 'ArrowRight') {
      if (this.llamaPosition < AVAILABLE_WIDTH) {
        this.llamaPosition += STEP_SIZE;
        this.llamaDirection = 'right';
      }
    }
  }
}
