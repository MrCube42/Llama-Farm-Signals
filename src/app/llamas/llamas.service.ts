import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Llama } from './llama';

@Injectable({ providedIn: 'root' })
export class LlamasService {
  fetchLlamas(): Observable<Llama[]> {
    return of([
      {
        id: 1,
        name: "D'Artagnan",
        leashColor: 'red',
      },
      {
        id: 2,
        name: 'Athos',
        leashColor: 'green',
      },
      {
        id: 3,
        name: 'Porthos',
        leashColor: 'blue',
      },
      {
        id: 4,
        name: 'Aramis',
        leashColor: 'yellow',
      },
    ]);
  }
}
