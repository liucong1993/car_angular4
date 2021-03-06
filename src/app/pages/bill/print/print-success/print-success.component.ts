import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'ngx-print-success',
  templateUrl: './print-success.component.html',
  styleUrls: ['./print-success.component.scss']
})
export class PrintSuccessComponent implements OnInit {


  billNo:string;
  constructor(  private route: ActivatedRoute, public router: Router,) {
    this.route.params.subscribe(p => {
    if (p.billNo) {
      this.billNo=p.billNo;
    }
  }); }

  ngOnInit() {
  }

  back(){
    this.router.navigate( ['/pages/bill/print']);
  }

  createOrder(){
    this.router.navigate( ['/pages/money/payment']);
  }

}
