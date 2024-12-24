import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  // alternative
  // constructor(private httpClient:HttpClient){}

  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    const subscription = this.httpClient.get<{places:Place[]}>('http://localhost:4000/places'
    ).pipe(map((resDataObj)=>resDataObj.places)).subscribe({
      next: (resArray) => {
        this.places.set(resArray)
        console.log(resArray);
        
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe())

  }


}
