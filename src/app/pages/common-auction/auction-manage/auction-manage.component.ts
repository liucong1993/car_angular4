import {Component, OnChanges, OnInit, SimpleChanges,TemplateRef,ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CodemapCell, CustomCell} from '../../../@core/ui/table/cell';
import {Router} from '@angular/router';
import {TextCell} from '../../../@core/ui/table/cell.text.component';
import {Menu, MenuCell} from '../../../@core/ui/table/cell.menu.component';
import {commonAutionBalanceService} from  '../../../@core/data/common-aution/balance.service';
import {MessageService} from '../../../@core/utils/message.service';
import {Column, TableComponent} from '../../../@core/ui/table/table.component';

@Component({
  selector: 'ngx-auction-manage',
  templateUrl: './auction-manage.component.html',
  styleUrls: ['./auction-manage.component.scss'],
 /* styles: [`
    form {
      overflow: hidden;
    }
  `,
  ],*/
  // 定义动画
  animations: [
    trigger('visibilityChanged', [
      // state 控制不同的状态下对应的不同的样式
      state('shown', style({height: 'auto'})),
      state('hidden', style({height: '0px', opacity: '0'})),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('shown <=> hidden', [animate('100ms ease-in-out'), animate('100ms')]),
    ]),
  ],
  providers:[commonAutionBalanceService],
})
export class AuctionManageComponent implements OnInit, OnChanges {
  @ViewChild(TableComponent) itemList: TableComponent;
  constructor(private router: Router,
              private commonAutionBalanceService:commonAutionBalanceService,
              private message:MessageService) { }

  visibility = 'hidden';
  showFilter = false;

  @ViewChild('createTimeCell') private createTimeCell: TemplateRef<any>;
  // 列表搜索表单隐藏显示切换
  toggle() {
    this.showFilter = !this.showFilter;
    this.visibility = this.showFilter ? 'shown' : 'hidden';
  }

  // ngOnChanges 可监控组件变量
  ngOnChanges(changes: SimpleChanges): void {
  }

  // 组件初始华
  ngOnInit(): void {
    this.columns = [
      {title: '项目名称', titleClass: 'w-15 text-center', cell: new TextCell('name')} as Column,
      {title: '项目编号', titleClass: 'w-10 text-center', cell: new TextCell('id')} as Column,
      {title: '状态', titleClass: 'w-5 text-center', cell: new CodemapCell('status','saleProjectStatus')} as Column,
      {title: '商户', titleClass: 'w-10 text-center', cell: new TextCell('merchant.name')} as Column,
      {title: '已返现/总返现', titleClass: 'w-5 text-center', cell: new TextCell('')} as Column,
      {title: '已过户/总台数', titleClass: 'w-5 text-center', cell: new TextCell('')} as Column,
      {title: '创建时间', titleClass: 'w-20 text-center', cell: new CustomCell(this.createTimeCell)} as Column,
      {
        title: '', titleClass: 'w-10 text-center', cell: new MenuCell(
        [
          new Menu('编辑', '', this.edit.bind(this)),
          new Menu('删除', '', this.delete.bind(this)),
        ],
        new Menu('车辆管理', '', this.carLink.bind(this)), 'text-center',
      )} as Column,
    ];
  }


  // 列表搜索条件对象
  filter: any = {};
  // 列表列定义
  columns: Column[] ;

  carLink(row: any){
    this.router.navigate(['/pages/common-auction/auction-manage/cars-manage', { id:row.id}]);
  }

  // 列表菜单回调
  view(row: any, drop: any) {
  }

  edit(row: any) {
    this.router.navigate(['/pages/common-auction/auction-manage/edit-project', { id:row.id}]);
  }
  delete(row:any){
    this.commonAutionBalanceService.delete(row.id).then(res=>{
      this.message.success('','删除成功！');
      this.itemList.reload();
    }).catch(err=>{
      this.message.error('删除失败',err.json().message);
    });
  }

  disable(row: any) {

  }
  /*跳转*/
  banlance() {
    this.router.navigateByUrl('/pages/common-auction/auction-manage/add-project');
  }

}
