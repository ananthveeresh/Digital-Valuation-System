import { Component } from '@angular/core';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {

  public responsecode: any;
  public randomNumber: any;
  public show_payment: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Get query parameters
    this.randomNumber = generateRandomString();
    this.randomNumber = window.btoa(this.randomNumber);
    this.route.queryParams.subscribe((queryParams) => {
      // // // // console.log('Query Parameters:', queryParams);
      // this.responsecode = { "surl": "https://w.aditya.ac.in/dev/rk/semisterdemo", "exurl": "student/success", "Response Code": "E000", "Unique Ref Number": "241130209439327", "Service Tax Amount": "0.00", "Processing Fee Amount": "0.00", "Total Amount": "1.00", "Transaction Amount": "1", "Transaction Date": "30-11-2024 15:10:10", "Interchange Value": "", "TDR": "", "Payment Mode": "UPI_ICICI", "SubMerchantId": "11", "ReferenceNo": "674add555f15be215cbeb578", "ID": "382099", "RS": "af013d4eedae2d503c98725df58c547f5f8f3f2600d86c9dbb52bb5be4121f1b4d362fdb099256776e25564696b30911cff5f538c26fb7a08e607f86180da9fc", "TPS": "null", "mandatory fields": "674add555f15be215cbeb578|11|1|DEV ABHINAY GANDEPALLI DEV ABHINAY GANDEPALLI -2443640323-269043|8374847317|gandepallidevabhinay@gmail.com", "optional fields": "null", "RSV": "f84295a38fad8b6d4229e32f94d577df626d7799a13fecc77d5f8c13c959d79c37744e50c6fe13b5737a0f693452044186e1eda831bf26a57c6c621c7f209c8f" }

      this.responsecode = queryParams;
      // // // console.log(this.responsecode)
      if (this.responsecode['Response Code'] == "E000") {
        var params = this.responsecode['ReferenceNo'] + "/" + this.responsecode['Unique Ref Number']
        this.router.navigate(['/student/createinvoice', params]);
      }
      else {
        this.show_payment = false
      }

    });
  }

  navigateTohallticket() {
    this.router.navigate(['/student/hallticket']);
  }

}

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}