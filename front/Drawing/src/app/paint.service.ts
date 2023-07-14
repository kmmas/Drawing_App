import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shape } from './shape';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaintService {

  constructor(private http: HttpClient) { }
  saveShapes(shapeList : shape[]) : Observable<String>{
    return this.http.post<String>("http://localhost:8080/shapes", shapeList);
}
  sendPath(path : String) : Observable<String>{
    return this.http.post<String>("http://localhost:8080/path", path);
}
  loadShapes(path:String) : Observable<shape[]>{
    return this.http.post<shape[]>("http://localhost:8080/load",path);
  }

}
