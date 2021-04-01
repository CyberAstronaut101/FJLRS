import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Material } from 'src/assets/interfaces';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/material";

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private materials: Material[] = [];
  private materialsUpdated = new Subject<Material[]>();

  constructor(
    private http: HttpClient,
    public router: Router) { }

  getMaterials(){
    this.http
        .get<{message: string, materials: Material[]}>(BACKEND_URL)
        .subscribe(ret => {
            console.log("MaterialService loaded Materials:");
            console.log(ret);
            this.materials = ret.materials;
            this.materialsUpdated.next([...this.materials]);
        })
  }

  addMaterial(Name: string, Type: string, Price: string) {

    const newMaterial = {
        id: "",
        materialName: Name,
        materialType: Type,
        materialPrice: Price
    }
    
    console.log('addMaterial() --> submitting new material to API');
    console.log(newMaterial);

    // post @ /api/material
    this.http
      .post<{message: string, material: Material}>(BACKEND_URL, newMaterial)
      .subscribe(ret => {
        console.log("PrinterService Added Printers:");
        console.log(ret);
        this.materials.push(ret.material);
        this.materialsUpdated.next([...this.materials]);
    });
  }

  getMaterialsUpdateListener(){
    return this.materialsUpdated.asObservable();
}



deleteMaterial(name: string) {
  this.http.delete(BACKEND_URL + '/' + name)
      .subscribe(() => {
          console.log('http delete request finished');
          // keep the elements that are not the same id
          const updatedMaterials = this.materials.filter(materials => materials.materialName!== name );
          this.materials = updatedMaterials;

          this.materialsUpdated.next([...this.materials]);
      })

}
}
