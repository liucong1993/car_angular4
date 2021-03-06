import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TextCell} from '../../../../@core/ui/table/cell.text.component';
import {Router} from '@angular/router';
import {Menu, MenuCell} from '../../../../@core/ui/table/cell.menu.component';
import {Column} from '../../../../@core/ui/table/table.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Location} from '@angular/common';

@Component({
  selector: 'ngx-trade-details',
  templateUrl: './trade-details.component.html',
  styleUrls: ['./trade-details.component.scss'],
  styles: [`
    form {
      overflow: hidden;
    }
  `,
  ],
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
})
export class TradeDetailsComponent implements OnInit, OnChanges {
  constructor(
    private router: Router,
    private location: Location,
  ) { }

  visibility = 'hidden';
  showFilter = false;

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
  }

  // 列表搜索条件对象
  filter: any = {};
  // 列表列定义
  columns: Column[] = [
    {title: '流水号', titleClass: 'w-25 text-center', cell: new TextCell('code')} as Column,
    {title: '车牌号', titleClass: 'w-10 text-center', cell: new TextCell('name')} as Column,
    {title: '厂牌型号', titleClass: 'w-15 text-center', cell: new TextCell('name')} as Column,
    {title: '车辆类型', titleClass: 'w-10 text-center', cell: new TextCell('name')} as Column,
    {title: '使用年限', titleClass: 'w-20 text-center', cell: new TextCell('name')} as Column,
    {title: '累计里程', titleClass: 'w-20 text-center', cell: new TextCell('name')} as Column,
    {title: '交易价格', titleClass: 'w-20 text-center', cell: new TextCell('name')} as Column,
    {title: '卖家状态', titleClass: 'w-15 text-center', cell: new TextCell('name')} as Column,
    {title: '买家状态', titleClass: 'w-10 text-center', cell: new TextCell('name')} as Column,
    {
      title: '查看', titleClass: 'w-15 text-center', cell: new MenuCell(
        [
          new Menu('编辑', '', 'edit'),
          new Menu('禁用', '', this.disable),
        ],
        new Menu('查看', '', this.view), 'text-center',
      )} as Column,
  ];

  // 列表菜单回调
  view(row: any, drop: any) {
  }

  edit(row: any) {
  }

  disable(row: any) {

  }
  /*跳转*/
  banlance() {
    this.router.navigateByUrl('/pages/query-count/trade-query/see-message');
  }
  /*返回*/
  goBack() {
    this.location.back();
  }
}
