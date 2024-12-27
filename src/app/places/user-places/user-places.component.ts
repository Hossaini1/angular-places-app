import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  favoritePlaces = signal<Place[] | undefined>(undefined);
  isLoading = signal(false);
  errorMsg = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places')
      .pipe(
        map((resDataObj) => resDataObj.places), catchError((err) => {
          console.log(err);
          return throwError(() => new Error('Something went wrong fetching favorite places! please try again.'))
        })
      ).subscribe({
        next: (resData) => this.favoritePlaces.set(resData),
        complete: () => this.isLoading.set(false),
        error: (err) => this.errorMsg.set(err.message)
      })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
}
