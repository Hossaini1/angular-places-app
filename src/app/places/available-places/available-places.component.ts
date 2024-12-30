import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent, CommonModule],
})
export class AvailablePlacesComponent implements OnInit {

  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  errorMessage = signal('');
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  private placesService = inject(PlacesService);
  // alternative
  // constructor(private httpClient:HttpClient){}



  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
      next: (resArray: Place[]) => {
        this.places.set(resArray)
      },
      complete: () => {
        this.isFetching.set(false)
      },
      error: (err: Error) => {
        console.error(err)
        return this.errorMessage.set(err.message)
      }

    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  };

  onSelectPlace(selectedPlace:Place) {
   const subscription= this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => console.log(resData)

    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
}
