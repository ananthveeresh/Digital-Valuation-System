import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { data } from 'jquery';
import { SemesterService } from 'src/app/core/services/semester.service';

@Component({
  selector: 'app-createinvoice',
  templateUrl: './createinvoice.component.html',
  styleUrls: ['./createinvoice.component.css']
})
export class CreateinvoiceComponent {

  public logininfo: any = [];
  public randomNumber: any;
  public show_status = false;
 

  constructor(private route: ActivatedRoute, private router: Router, private _semesterService: SemesterService) { }

  ngOnInit() {
    

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log(this.logininfo)


    var total_id = this.route.snapshot.params['id'];
    var reference_id = total_id.split('/')[0]
    var unique_ref_id = total_id.split('/')[1]
    // // // // console.log(reference_id)
    // // // // console.log(unique_ref_id)


    this.randomNumber = generateRandomString();
    var postobj = {
      "token": unique_ref_id,
      "txid": reference_id
    }
    if (localStorage.getItem("tran_count") == "0") {
      
      this._semesterService.post_payment(postobj).subscribe((data1: any) => {
        // // // // console.log(data1)
        data1[0].feeinfo[0].cashier_id = 0;
        data1[0].feeinfo[0].gst_percent = 0;
        data1[0].feeinfo[0].gst_paid = 0;
        data1[0].feeinfo[0].fine_amount = 0;
        data1[0].feeinfo[0].cheque_no = reference_id;
        data1[0].feeinfo[0].payment_type = 4;
        data1[0].feeinfo[0].cheque_date = new Date();
        data1[0].feeinfo[0].bank_name = 'Online';
        data1[0].feeinfo[0].amount_paid = data1[0].amount;

        this._semesterService.post_invoice(data1[0].feeinfo).subscribe((data2: any) => {
          // // // // console.log(data2)
          data1[0].feeinfo[0].reciept_no = data2.result
          var obj = {
            "suc": this.logininfo.stdSuc,
            "payment": data1[0].feeinfo[0]
          }

          this._semesterService.payment_update(obj).subscribe((data3: any) => {
            // // // // console.log(data3)
            localStorage.setItem('tran_count', "1");
            this.show_status = true;
          })
        })
      })
    }
    else {
      let encoded_obj = window.btoa(this.randomNumber);
      this.router.navigate(['/student/payfee', encoded_obj]);
    }

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