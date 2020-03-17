import { Component, OnInit } from '@angular/core';
import { CountryDetail } from './countryDetail';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})



export class AppComponent  implements OnInit {
  title = 'emp';
  countryDetail: CountryDetail[];
  modifiedText: any;
  private data:any = [];
  confirmed :Number;
  deaths   :Number ;
  recovered  :Number;
  lastUpdated:any;
  url='https://covid19.mathdro.id/api/countries';
  
  constructor(private http:HttpClient){
    let emp=[]
    this.http.get(this.url).toPromise()
   .then(data => {
     for (let contry in data['countries']){
                let myJson = {"Country" : contry,"CountryCode": data['countries'][contry]};
                emp.push(myJson);
       }
   this.countryDetail = [...emp];
   })
   .catch(err=>console.log(err.message))

   
  }

  ngOnInit(){
     this.onCountrySelect('world')
    }

 async onCountrySelect(value:string){
   let cUrl=`https://covid19.mathdro.id/api/countries/${value}`;

   if(value=='world'){
    return await this.http.get(`https://covid19.mathdro.id/api`).toPromise()
    .then(
      (data)=>{
        this.lastUpdated=new Date(data['lastUpdate']);
        console.log(this.lastUpdated.getDate(),'okay ....');

        this.confirmed=data['confirmed']['value'];
        this.deaths=data['deaths']['value'];
        this.recovered=data['recovered']['value'];
      }
    )
    .catch(e => {
       alert('something went wrong')
    })
  }


   return await this.http.get(cUrl).toPromise()
    .then(
      (data)=>{
        this.lastUpdated=new Date(data['lastUpdate']);
        this.confirmed=data['confirmed']['value'];
        this.deaths=data['deaths']['value'];
        this.recovered=data['recovered']['value'];
      }
    )
    .catch(e => {
      this.confirmed=0;
        this.deaths=0;
        this.recovered=0;

    })

}

}






