import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeopleService } from '../../services/people.service';
import { Person } from '../../models/person.interface';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'actions'];
  dataSource: Person[] = [];

  constructor(
    private peopleService: PeopleService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.peopleService.getAllPeople().subscribe(
      (people) => {
        this.dataSource = people;
      },
      (error) => {
        this.snackBar.open('Error loading people', 'Close', { duration: 3000 });
      }
    );
  }

  editPerson(id: number): void {
    this.router.navigate(['/people/edit', id]);
  }

  deletePerson(id: number): void {
    if (confirm('Are you sure you want to delete this person?')) {
      this.peopleService.deletePerson(id).subscribe(
        () => {
          this.loadPeople();
          this.snackBar.open('Person deleted successfully', 'Close', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open('Error deleting person', 'Close', { duration: 3000 });
        }
      );
    }
  }

  addNewPerson(): void {
    this.router.navigate(['/people/new']);
  }
} 