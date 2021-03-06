import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {MessageService} from '../../../utils/message.service';
import {MerchantModel} from '../../../model/business/merchant.model';
import {ErrorMessage} from '../../valid-error/valid-error.component';
import {Marketphotomap} from '../../../model/system/market-photo-map';
import {CodeitemService} from '../../../data/system/codeitem.service';
import {Codeitem} from '../../../model/system/codeitem';
import {IdcardService} from '../../../device/idcard.service';
import {FilingInfoModel} from '../../../model/business/filing.info.model';
import {FilingService} from '../../../data/merchant/filing.service';
import {BusinessTradeForm} from '../../../model/business/restruct/business.trade.form';
import {LocalstorageService} from '../../../cache/localstorage.service';

@Component({
  selector: 'ngx-ys-buyer-info',
  templateUrl: './buyer-info.component.html',
  styleUrls: ['./buyer-info.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
})
export class BuyerInfoComponent implements OnInit {
  /**
   * 拍照上传按钮是否显示
   * @type {boolean}
   */
  @Input() btn_show = true;
  /**
   * 证件表单配置
   */
  @Input() certificateFormConfig: Marketphotomap;
  /**
   * 默认选择的卖家的商户，或当前选择商户实例
   */
  @Input() merchant: MerchantModel = {id: null};
  /**
   * 默认选择的卖家的车商，或当前选择的车商
   * @type {string}
   */
  @Input() cheshang: FilingInfoModel;
  /**
   * 证件类型清单
   */
  @Input() certType?: Codeitem[];
  /**
   * 买家表单,包含照片等字段
   */
  @Input() buyerObj: FormGroup;
  /**
   * 买家表单,不包含照片
   * 后期删除该属性，平滑过度属性
   */
  @Input() buyer: FormGroup;
  /**
   * 错误实例
   * @type {{}}
   */
  @Input() errors = {
    certType: [
      new ErrorMessage('required', '必填'),
    ],
    certCode: [
      new ErrorMessage('required', '必须填写证件号码！'),
    ],
    name: [
      new ErrorMessage('required', '必须填写姓名！'),
      new ErrorMessage('maxLength', '姓名太长了！'),
    ],
    endDate: [
      new ErrorMessage('required', '必须填写有效期！'),
    ],
    phone: [
      new ErrorMessage('required', '必须填写手机！'),
    ],
    trusteeType: [
      new ErrorMessage('required', '必须填写是否委托！'),
    ],
    address: [
      new ErrorMessage('required', '必须填写地址！'),
    ],
    buyerAddress: [
      new ErrorMessage('required', '必须填写地址！'),
    ],
  };
  @Input() showCheshang = true;

  /**
   * 构造函数
   * @param {IdcardService} idcard
   * @param {MessageService} message
   */
  constructor(
    private idcard: IdcardService,
    private fb: FormBuilder,
    private _codeitem: CodeitemService,
    private _message: MessageService,
    private _filingService: FilingService,
    private _localstorage: LocalstorageService,
  ) {}

  /**
   * 是否委托变更事件
   */
  trusteeTypeChange() {
    // 默认不用填写委托人
    // 一旦勾选有委托人，则必须填写委托人
    if ( this.buyer.get('trusteeType').value === '1' ) {
      this.buyer.controls.Trustee.enable();
    } else {
      this.buyer.controls.Trustee.disable();
    }
  }
  businessTradeForm: BusinessTradeForm;

  /**
   * 页面初始化事件
   */
  ngOnInit() {
    console.info('certificateFormConfig', this.certificateFormConfig);
    let maybe_businessTradeForm = this._localstorage.get('business_trecording_trade_form');
    if (maybe_businessTradeForm) {
      this.businessTradeForm = maybe_businessTradeForm as BusinessTradeForm;
    }
    /**
     * 重新定义 狭义的 卖家，让照片产生在广义的卖家里，表单可直接使用
     */
    if (this.buyerObj && !this.buyer) {
      this.buyer = this.buyerObj.get('buyer') as FormGroup;
      console.info('buyerObj', this.buyerObj);
    }
    /**
     * 默认不用填写委托人
     */
    this.buyer.controls.Trustee.disable();
    /**
     * 设置好证件类型
     */
    if (! this.certType) {
      this._codeitem.list('certType').then(res => this.certType = res as Codeitem[]);
    }
    // console.info('this.buyer.value', this.buyer.value);
    this.certTypeSelecteFunc(this.buyer.controls.certType.value);
  }
  /**
   * 初始化照片动态表单
   */
  certTypeSelecteFunc(event) {
    console.info('初始化动态表单值event', event);
    this.certificateFormConfig.certificateCode = event;
    let buyerPhotos = this.buyerObj.get('photos') as FormGroup;
    if (buyerPhotos) {
      this.buyerObj.removeControl('photos');
    }
    this.buyerObj.addControl('photos', this.fb.group({}));
  }

  /**
   * 选择车商事件
   * 将选中的车商数据复制到买家表单中
   * @param value
   */
  getSelectedCheshang(value) {
    value.certCode = value.filingPerson.certCode;
    // console.info(value);
    this.buyer.patchValue(value);
  }

  dealerIsOk = false;
  linkman: any = {};
  linkmanSelected: FilingInfoModel = {};
  linkManData: FilingInfoModel[] = [];
  dealer: MerchantModel = {};
  /**
   * 选择好了商户的事件
   * @param value
   */
  getSelectedDealer(dealer) {
    this.dealer = dealer;
    this._message.info('获取商户', dealer.name);
    this._filingService.agency(dealer.id).then(res => {
      this.dealerIsOk = true;
      this.linkman = ''; // 使 --请选择--  选项高亮
      this.linkManData = res as FilingInfoModel[];
      // console.info(this.linkManData);
      // console.info(this.linkmanSelected);
    });
  }

  /**
   * 读取IC卡并将读取的信息赋值到买家表单中
   */
  readIdCard() {
    // this._message.info('身份证', '读取卖方身份证');
    this.idcard.prepare().then((res) => {
      // this._message.info('身份证', '初始化完毕');
      if (res) { // 初始化读卡器正常
        this.idcard.read().then((idcardData) => {
          this._message.success('身份证', '读取成功');
          // console.info(idcardData);
          this.buyer.patchValue({
            address: idcardData.Address,
            // birthday: idcardData.Birthday,
            certCode: idcardData.IdCardNo,
            name: idcardData.Name,
            // sex: idcardData.Sex,
            endDate: idcardData.UseEnd,
          });
        });
      }
    }).catch(e => {
      this._message.error('身份证', '读取身份证失败');
    });
  }
}
