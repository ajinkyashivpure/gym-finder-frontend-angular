import {Component, OnInit} from '@angular/core';
import {Gym} from '../../models/gym';
import {GymService} from '../../services/gym.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-admin-gym-list',
  imports:[CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Gyms</h2>
        <button class="btn btn-primary"  (click)="addNewGym()">Add New Gym</button>
      </div>

      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Equipment</th>
              <th>Trainers</th>
              <th>Plans</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let gym of gyms">
              <td>{{ gym.name }}</td>
              <td>{{ gym.ownerName }}</td>
              <td>{{ gym.contactNumber }}</td>
              <td>{{ gym.address }}</td>
              <td>{{ gym.equipment?.length || 0 }}</td>
              <td>{{ gym.trainers?.length || 0 }}</td>
              <td>{{ gym.subscriptionPlans?.length || 0 }}</td>
              <td>
                <button class="btn btn-sm btn-info me-2" (click)="editGym(gym)">Edit</button>
                <button class="btn btn-sm btn-danger" (click)="deleteGym(gym.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminGymListComponent implements OnInit {
  gyms: Gym[] = [];

  constructor(
    private gymService: GymService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    this.gymService.getAllGyms().subscribe({
      next: (gyms) => this.gyms = gyms,
      error: (error) => console.error('Error loading gyms:', error)
    });
  }

  editGym(gym: Gym): void {
    this.router.navigate(['/admin/gyms/edit', gym.id]);
  }

  deleteGym(id: number): void {
    if (confirm('Are you sure you want to delete this gym?')) {
      this.gymService.deleteGym(id).subscribe({
        next: () => {
          this.loadGyms();
        },
        error: (error) => console.error('Error deleting gym:', error)
      });
    }
  }
  addNewGym(): void {
    this.router.navigate(['/admin/gyms/create']);
  }
}
