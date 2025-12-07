import { Component } from '@angular/core';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { MainContent } from './main-content/main-content';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Sidebar,
    MainContent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }