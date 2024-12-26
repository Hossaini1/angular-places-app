import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent,CommonModule],
})
export class AvailablePlacesComponent implements OnInit {
  isFetching = signal(false);
  errorMessage = signal('');
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  // alternative
  // constructor(private httpClient:HttpClient){}

  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{places:Place[]}>('http://localhost:3000/places'
    ).pipe(map((resDataObj)=>resDataObj.places),catchError((error)=>{
      console.error(error);
      return throwError(()=>new Error('Something is wrog! Please try again!!!'))
      
    })).subscribe({
      next: (resArray) => {
        this.places.set(resArray)
        console.log(resArray);
        
      },
      complete:()=>{
        this.isFetching.set(false)
      },
      error:(err:Error)=>{
        console.error(err)
        return this.errorMessage.set(err.message)
      }

    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe())

  }
}
