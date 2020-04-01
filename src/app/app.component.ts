import { Component, OnInit } from '@angular/core';
import { CountryDetail } from './countryDetail';
import { HttpClient } from "@angular/common/http";
import { StateDetails } from './stateDetails';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})



export class AppComponent implements OnInit {
  countryDetail: CountryDetail[];
  modifiedText: any;
  confirmed: Number;
  deaths: Number;
  recovered: Number;
  lastUpdated: any;
  url = 'https://covid19.mathdro.id/api/countries';
  statewiseUrl='https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise';
  stateswiseDetails:StateDetails[];
  indConfirmed:number;
  indRecovered:number;
  indDeaths:number;
  indActive:number;

  stateLastUpdated:any;




  constructor(private http: HttpClient) {
    let countryData = []
    this.http.get(this.url).toPromise()
      .then(data => {
        for (let contry in data['countries']) {
          let myJson = { 
            "Country" : data['countries'][contry]['name'],
            "CountryCode": data['countries'][contry]['iso2']
          };
          countryData.push(myJson);
        }
        this.countryDetail = [...countryData];
      })
      .catch(err => console.log(err.message))


//  fetch statewise data
 let stateData=[];
 this.http.get(this.statewiseUrl).toPromise()
 .then(data => {
   for (let states in data["data"]["statewise"]) {
     let myJson = {
         "state":data["data"]["statewise"][states]["state"],
         "confirmed":data["data"]["statewise"][states]["confirmed"],
         "recovered":data["data"]["statewise"][states]["recovered"],
         "deaths":data["data"]["statewise"][states]["deaths"],
         "active":data["data"]["statewise"][states]["active"],
       };
     stateData.push(myJson);
   }
  //  total 
      // let myJson = {
      //   "state":"Total",
      //   "confirmed":data["data"]["total"]["confirmed"],
      //   "recovered":data["data"]["total"]["recovered"],
      //   "deaths":data["data"]["total"]["deaths"],
      //   "active":data["data"]["total"]["active"],
      //   };
      //   this.indiaTotal.push(myJson);
      this.indConfirmed=data["data"]["total"]["confirmed"];
      this.indRecovered=data["data"]["total"]["recovered"];
      this.indDeaths=data["data"]["total"]["deaths"];
       this.indActive=data["data"]["total"]["active"];

   // last Refreshed
  //  this.stateLastUpdated= new Date(data["data"]["lastRefreshed"])
   let updatedTime= new Date(data["data"]["lastRefreshed"]);
   let nowTime =new Date();
   let diffTime=nowTime.getTime() - updatedTime.getTime();

   let resultTime = Math.round(diffTime / 60000);
   this.stateLastUpdated = resultTime;

   this.stateswiseDetails = [...stateData];
   console.log( this.stateswiseDetails);

 })
 .catch(err => alert(`something went wrong`))
  }






  ngOnInit() {
    this.onCountrySelect('world');      
  }

  async onCountrySelect(value: string) {
    let cUrl = `https://covid19.mathdro.id/api/countries/${value}`;

    if (value == 'world') {
      return await this.http.get(`https://covid19.mathdro.id/api`).toPromise()
        .then(
          (data) => {
            this.lastUpdated = new Date(data['lastUpdate']);
            console.log(this.lastUpdated.getDate(), 'okay ....');
            this.confirmed = data['confirmed']['value'];
            this.deaths = data['deaths']['value'];
            this.recovered = data['recovered']['value'];
          }
        )
        .catch(e => {
          alert('something went wrong')
        })
    }


    return await this.http.get(cUrl).toPromise()
      .then(
        (data) => {
          this.lastUpdated = new Date(data['lastUpdate']);
          this.confirmed = data['confirmed']['value'];
          this.deaths = data['deaths']['value'];
          this.recovered = data['recovered']['value'];
          console.log(value);

        }
      )
      .catch(e => {
        this.confirmed = 0;
        this.deaths = 0;
        this.recovered = 0;

      })
      
  }

 
 
}








