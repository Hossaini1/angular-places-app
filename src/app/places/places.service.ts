import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Something went wrong fetching the available places! Please try again!!!')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Something went wrong fetching your favorite places! Please try again!!!')
      .pipe(tap((userPlaces) => this.userPlaces.set(userPlaces)))
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.some((p)=> p.id===place.id)) {
      
      this.userPlaces.set([...prevPlaces,place]);
    }

    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId : place.id
    }).pipe(catchError((error) =>{
      this.userPlaces.set(prevPlaces);
      return throwError(()=>new Error('Failed to store selected place.'))
    }))
  }

  removeUserPlace(place: Place) { }

  private fetchPlaces(url: string, errorMsg: string) {

    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((resDataObj) => resDataObj.places), catchError((error) => {
        console.error(error);
        return throwError(() => new Error(errorMsg))

      }))

  }
}
