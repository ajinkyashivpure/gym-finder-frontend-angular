import {Component, OnInit} from '@angular/core';
import {Gym} from '../../models/gym';
import {GymService} from '../../services/gym.service';
import {catchError, of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-gym-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './gym-list.component.html'
})
export class GymListComponent implements OnInit {
  gyms: Gym[] = [];
  searchTerm: string = '';

  constructor(private gymService: GymService) {}

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    this.gymService.getAllGyms().pipe(
      catchError((error) => {
        console.error('Error loading gyms:', error);
        return of([]); // Return empty array in case of error
      })
    ).subscribe(gyms => this.gyms = gyms);
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.gymService.searchGyms(this.searchTerm).pipe(
        catchError((error) => {
          console.error('Error searching gyms:', error);
          return of([]); // Return empty array in case of error
        })
      ).subscribe(gyms => this.gyms = gyms);
    } else {
      this.loadGyms();
    }
  }
}
