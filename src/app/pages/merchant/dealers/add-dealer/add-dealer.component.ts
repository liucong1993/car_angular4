import { Component, OnInit } from '@angular/core';
import {MessageService} from '../../../../@core/utils/message.service';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MerchantService} from '../../../../@core/data/merchant/merchant.service';
import {MerchantForm} from '../../../../@core/model/bussiness/merchant.form';
import {Http} from '@angular/http';
import {MerchantModel} from '../../../../@core/model/bussiness/merchant.model';
import {Codeitem} from "../../../../@core/model/system/codeitem";
import {Router} from "@angular/router";


/**
 * 添加商户
 */
@Component({
  selector: 'ngx-add-dealer',
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.scss'],
})
export class AddDealerComponent implements OnInit {
  /**
   * 构造函数
   * @param {MessageService} message
   * @param {Location} location
   */
  constructor(
    private router: Router,
    private http: Http,
    private message: MessageService,
    private location: Location,
    private fb: FormBuilder,
    private merchantService: MerchantService,
  ) { }

  ngOnInit() {
  }
  photos: any[] = [{
    title: '机构证正面',
    source: 'assets/images/camera1.jpg',
  }, {
    title: '机构证反面',
    source: 'assets/images/camera2.jpg',
  }];
  // saved = false;
  _formGroup: FormGroup = this.fb.group({
    // name: ['', [Validators.required, Validators.maxLength(64)]],
    // code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{4,8}$/)]],
    // certCode: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{8}-[a-zA-Z0-9]$|^[A-Z0-9]{18}$/)]],
    // address: ['', [Validators.maxLength(50)]],
    // phone: ['', [Validators.required, Validators.pattern(/^1(3|4|7|5|8)([0-9]{9})|0[0-9]{2,3}-[0-9]{8}$/)]],
    // endDate: ['', [
    //   Validators.required,
    //   Validators.pattern(/^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^\u957f\u671f$/)],
    // ],
    // discount: ['', [Validators.maxLength(50)]],
    // isCarRental: ['', [Validators.required]],
    // isDeal: ['', [Validators.required]],
    // isPersonal: ['', [Validators.required]],
    // TODO: 去除模拟数据
    name: ['汉口北二手车市场', [Validators.required, Validators.maxLength(64)]],
    code: ['HKB3', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{4,8}$/)]],
    certCode: ['hankoube-3', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{8}-[a-zA-Z0-9]$|^[A-Z0-9]{18}$/)]],
    address: ['湖北武汉汉口', [Validators.maxLength(50)]],
    phone: ['17012345678', [Validators.required, Validators.pattern(/^1(3|4|7|5|8)([0-9]{9})|0[0-9]{2,3}-[0-9]{8}$/)]],
    endDate: ['20181212', [
      Validators.required,
      Validators.pattern(/^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^\u957f\u671f$/)],
    ],
    discount: ['1', [Validators.maxLength(50)]],
    isCarRental: ['1', [Validators.required]],
    isDeal: ['1', [Validators.required]],
    isPersonal: ['1', [Validators.required]],
  });
  /**
   * 新的图片地址事件
   * @param $event
   * @param photo
   */
  onChangeSource($event, photo) {
    this.message.info(photo.title + ' 的新图片地址', $event);
  }
  /*返回*/
  goBack() {
    this.location.back();
  }
  private api_url_base = '/rest/merchant';
  save() {
    if (this._formGroup.invalid) {
      this.message.error('填写错误', JSON.stringify(this._formGroup.errors));
      return false;
    } else {
      let merchant = this._formGroup.value as MerchantModel;
      merchant.cloudUser = '0001'; // TODO: 设置登陆用户
      // TODO: 以后在此处 MerchantForm 添加 photos 添加附件
      this.merchantService.add({ merchant: merchant} as MerchantForm).then(res => {
        this.message.success('创建成功', '创建商户成功');
        this.router.navigateByUrl('/pages/merchant/bussinessman');
      }).catch(err => {
        this.message.error('操作失败', err.json().message);
      });
    }
  }
  merchant: MerchantModel;
  edit(row) {
    this.merchant = row;
    console.info(this.merchant);
  }
}