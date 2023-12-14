// home.component.ts

import { Component, OnInit } from '@angular/core';
import { HomeServiceService } from '../home-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  featuredToys: any[] = [];

  constructor(private homeApiService: HomeServiceService) {}

  ngOnInit(): void {
    this.loadFeaturedToys();
  }

  loadFeaturedToys(): void {
    this.homeApiService.getRandomToys().subscribe(
      (toys) => {
        this.featuredToys = toys.slice(0, 3);
      },
      (error) => {
        console.error('Error fetching featured toys:', error);
      }
    );
  }
  truncateText(text: string, wordLimit: number): string {
    if (text) {
      const words = text.split(' ');
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ');
      } else {
        return text;
      }
    }
    return '';
  }
}
