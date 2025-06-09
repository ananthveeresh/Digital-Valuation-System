import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  printDiv(divId: string) {
    // // // // console.log( divId)
    const printContents = document.getElementById(divId)?.innerHTML;
    // // // // console.log( )
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();  // Reload to restore the original state
    }
  }
}