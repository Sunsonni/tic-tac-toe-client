import { Component } from '@angular/core';
import { ApiFetchService } from './service/api-fetch.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  board = ["", "", "", "", "", "", "", "", ""];
  form;
  constructor(
    private apiservice: ApiFetchService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      gameId: new FormControl('')
    })
  }

  ngOnInit() {
  }

  public async onSubmit() {
    this.board = await this.apiservice.getData('foo');
  }
}
