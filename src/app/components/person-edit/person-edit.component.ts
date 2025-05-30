import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person.interface';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements OnInit {
  personForm: FormGroup;
  isEditMode = false;
  personId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.personId = +id;
      this.loadPerson(this.personId);
    }
  }

  loadPerson(id: number): void {
    this.peopleService.getPerson(id).subscribe(
      (person) => {
        this.personForm.patchValue(person);
      },
      (error) => {
        this.snackBar.open('Error loading person', 'Close', { duration: 3000 });
        this.router.navigate(['/people']);
      }
    );
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const person: Person = this.personForm.value;
      
      if (this.isEditMode && this.personId) {
        this.peopleService.updatePerson(this.personId, person).subscribe(
          () => {
            this.snackBar.open('Person updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/people']);
          },
          (error) => {
            this.snackBar.open('Error updating person', 'Close', { duration: 3000 });
          }
        );
      } else {
        this.peopleService.createPerson(person).subscribe(
          () => {
            this.snackBar.open('Person created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/people']);
          },
          (error) => {
            this.snackBar.open('Error creating person', 'Close', { duration: 3000 });
          }
        );
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/people']);
  }
} 