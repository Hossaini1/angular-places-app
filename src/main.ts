import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Observable } from 'rxjs';

function logginInspector(request:HttpRequest<unknown>,next:HttpHandlerFn):Observable<HttpEvent<unknown>>{

    // Hier nur infos sehen
    // console.log('Outputing Request');
    // console.log(request);
    // return next(request);

    // Hier infos sehen und etwas hinzufügen in header!
    // mit clone und new request konnen wir ZB. header ändern

    // const modifierteRequest = request.clone({
    //     headers:request.headers.set('X-DEBUG','TESTING')
    // })
    console.log('Outputing Request');
    console.log(request);
    // return next(modifierteRequest);
    return next(request);
}

bootstrapApplication(AppComponent,{
    providers:[provideHttpClient(withInterceptors([logginInspector]))]
}).catch((err) => console.error(err));
