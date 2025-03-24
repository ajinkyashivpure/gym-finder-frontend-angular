import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GymService} from '../../services/gym.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'./admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  gymForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isEditMode = false;
  gymId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private gymService: GymService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.gymForm = this.fb.group({
      name: ['', Validators.required],
      ownerName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9+]{10,}$')]],
      address: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      equipment: this.fb.array([]),
      trainers: this.fb.array([]),
      subscriptionPlans: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode by looking for gym ID in route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.gymId = +params['id'];
        this.loadGymData(this.gymId);
      }
    });
  }

  private loadGymData(id: number): void {
    this.gymService.getGymById(id).subscribe({
      next: (gym) => {
        this.gymForm.patchValue({
          name: gym.name,
          ownerName: gym.ownerName,
          contactNumber: gym.contactNumber,
          address: gym.address,
          latitude: gym.latitude,
          longitude: gym.longitude
        });

        // Load equipment
        gym.equipment?.forEach(eq => {
          this.addEquipment();
          const lastIndex = this.equipment.length - 1;
          this.equipment.at(lastIndex).patchValue(eq);
        });

        // Load trainers
        gym.trainers?.forEach(trainer => {
          this.addTrainer();
          const lastIndex = this.trainers.length - 1;
          this.trainers.at(lastIndex).patchValue(trainer);
        });

        // Load subscription plans
        gym.subscriptionPlans?.forEach(plan => {
          this.addSubscriptionPlan();
          const lastIndex = this.subscriptionPlans.length - 1;
          this.subscriptionPlans.at(lastIndex).patchValue(plan);
        });
      },
      error: (error) => {
        console.error('Error loading gym:', error);
      }
    });
  }


  get equipment() {
    return this.gymForm.get('equipment') as FormArray;
  }

  get trainers() {
    return this.gymForm.get('trainers') as FormArray;
  }

  get subscriptionPlans() {
    return this.gymForm.get('subscriptionPlans') as FormArray;
  }

  createEquipmentFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      description: [''],
      imageUrl: ['']
    });
  }

  createTrainerFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      specialization: [''],
      contactNumber: [''],
      imageUrl: ['']
    });
  }

  createSubscriptionPlanFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      description: [''],
      price: [''],
      durationInMonths: ['']
    });
  }

  // Methods to add new items to form arrays
  addEquipment() {
    this.equipment.push(this.createEquipmentFormGroup());
  }

  addTrainer() {
    this.trainers.push(this.createTrainerFormGroup());
  }

  addSubscriptionPlan() {
    this.subscriptionPlans.push(this.createSubscriptionPlanFormGroup());
  }

  // Methods to remove items from form arrays
  removeEquipment(index: number) {
    this.equipment.removeAt(index);
  }

  removeTrainer(index: number) {
    this.trainers.removeAt(index);
  }

  removeSubscriptionPlan(index: number) {
    this.subscriptionPlans.removeAt(index);
  }




  onSubmit() {
    if (this.gymForm.valid) {
      if (this.isEditMode && this.gymId) {
        this.gymService.updateGym(this.gymId, this.gymForm.value).subscribe({
          next: () => {
            console.log('Gym updated successfully');
            this.router.navigate(['/admin/gyms']);
          },
          error: (error) => {
            console.error('Error updating gym:', error);
          }
        });
      } else {
        console.log('Submitting gym data:', this.gymForm.value);
        this.gymService.createGym(this.gymForm.value).subscribe({
          next: (response) => {
            console.log('Gym created:', response);
            this.successMessage = 'Gym created successfully!';
            this.errorMessage = '';
            this.gymForm.reset();
            // Clear form arrays
            while (this.equipment.length) {
              this.equipment.removeAt(0);
            }
            while (this.trainers.length) {
              this.trainers.removeAt(0);
            }
            while (this.subscriptionPlans.length) {
              this.subscriptionPlans.removeAt(0);
            }
          },
          error: (error) => {
            console.error('Error creating gym:', error);
            this.errorMessage = error.error?.message || 'Failed to create gym';
            this.successMessage = '';
          }
        });
      }
    }
    else {
      console.log('Form is invalid:', this.gymForm.errors); // Debug log
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/gyms']);
  }


  onImageSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploading file:', file); // Debug log
      this.gymService.uploadImage(file).subscribe({
        next: (response) => {
          console.log('Upload response:', response); // Debug log
          const equipmentControls = this.equipment.at(index) as FormGroup;
          equipmentControls.patchValue({
            imageUrl: response.fileUrl
          });
        },
        error: (error) => {
          console.error('Upload failed:', error);
        }
      });
    }
  }

  onTrainerImageSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.gymService.uploadImage(file).subscribe({
        next: (response) => {
          console.log('Trainer image upload response:', response);
          const trainerControls = this.trainers.at(index) as FormGroup;
          trainerControls.patchValue({
            imageUrl: response.fileUrl
          });
        },
        error: (error) => {
          console.error('Trainer image upload failed:', error);
        }
      });
    }
  }
}
