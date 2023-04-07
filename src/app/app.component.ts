import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { UserInfos } from './models/userInfo';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent {
  title = 'coding-test';
  hobby: string;
  cities: any[];
  selectedCity: any;
  filteredCities: any[];
  distance: number;
  userInfo = {} as UserInfos;
  hasValue: boolean = false;
  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit() {
    this.userService.getCities().then((cities) => {
      this.cities = cities;
    });
  }

  filterCity(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.cities.length; i++) {
      let city = this.cities[i];
      if (city.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(city);
      }
    }

    this.filteredCities = filtered;
  }

  loadData() {
    this.userService.getUserInfo().subscribe(data => {
      if (data) {
        this.hasValue = true;
        this.userInfo = data;
        this.hobby = this.userInfo.Hobby;
        this.selectedCity = this.cities.find(x => x.name == this.userInfo.Location);
        this.distance = this.userInfo.Distance;
      }

    })
  }

  saveUserInfo() {
    this.userInfo.Hobby = 'abc';
    this.userInfo.Location = this.selectedCity.name;
    this.userInfo.Distance = this.distance;

    this.userService.saveUserInfo(this.userInfo).subscribe(data => {
      if (data) {
        this.showSuccessMsg();
        this.clearData();
      }
    })
  }
  clearData()
  {
    this.hobby="";
    this.selectedCity=null;
    this.distance=0;
  }
  showSuccessMsg() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved Successfully' });
  }
}
