import { Component } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public exam_info: any[] = [];
  papercodeLength: any[] = [];
  ExamsLength: any[] = [];
  DashBoardData: any[] = [];
  constructor(private dashboardService: DashboardService) { }
  ngOnInit() {
    
    this.dashboardService.get_exammasterlist().subscribe((res: any) => {
      this.exam_info = res;
      this.papercodeLength = Array.from(new Set(this.exam_info.map(ele => ele.papercode))).map(id => { return this.exam_info.find(ele => ele.papercode === id); });
      this.ExamsLength = Array.from(new Set(this.exam_info.map(ele => ele.examId))).map(id => { return this.exam_info.find(ele => ele.examId === id); });
    });

    this.dashboardService.getDashBoardReport().subscribe(data => {
      this.DashBoardData = data;
    })
  }
}
