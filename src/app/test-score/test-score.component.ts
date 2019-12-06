import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id: number,
  testName: string,
  pointsPossible: number,
  pointsReceived: number,
  percentage: number,
  grade: string
}
@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  names = '';

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadTests();

  }

  async loadTests() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
    } else {
      tests = await this.loadTestsFromJson();
    }
    this.tests = tests;
    return tests;
  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }


  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null
    }
    this.tests.unshift(test);
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }

  deleteTest(index: number) {
    this.tests.splice(index, 1);
    localStorage.setItem('tests', JSON.stringify(this.tests))
  }

  saveTests() {
    localStorage.setItem('tests', JSON.stringify(this.tests))
    this.toastService.showToast('success', 5000, "Success: item saved!")
  }

  name() {
    const scores = this.calcualte();

    if (this.names === '') {
      this.toastService.showToast('danger', 5000, "Name must not be null");
    } else if (this.names.indexOf(', ') === -1) {
      this.toastService.showToast('danger', 5000, "Must have a comma and space!")
    } else {
      this.router.navigate(['home', scores]);
    }
    localStorage.setItem('calculatedData', JSON.stringify(scores));
  }

  calcualte() {
    let pointsPossible = 0;
    let pointsReceived = 0;
    let totalPrecentage = 0;
    for (let i = 0; i < this.tests.length; i++) {
      pointsPossible += this.tests[i].pointsPossible
      pointsReceived += this.tests[i].pointsReceived
      totalPrecentage += this.tests[i].percentage
      totalPrecentage = pointsReceived / pointsPossible
      var p = totalPrecentage.toFixed(2)

      if (totalPrecentage >= .90) {
        this.tests[i].grade = 'A'
      } else if (totalPrecentage >= .80) {
        this.tests[i].grade = 'B'
      } else if (totalPrecentage >= .70) {
        this.tests[i].grade = 'C'
      } else if (totalPrecentage >= .60) {
        this.tests[i].grade = 'D'
      } else if (totalPrecentage >= .50) {
        this.tests[i].grade = 'F'
      } 
  
    }
    return {
      students: this.names,
      pointsPossible: pointsPossible,
      pointsRecieved: pointsReceived,
      percentage: p,
      grade: this.tests[1].grade
      
    }
  }


}
