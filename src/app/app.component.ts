import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlamasComponent } from './llamas/llamas.component';
import { LlamasGetterComponent } from './llamas-getter/llamas-getter.component';
import { LlamasRxjsComponent } from './llamas-rxjs/llamas-rxjs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LlamasComponent,
    LlamasGetterComponent,
    LlamasRxjsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
