import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {VehicleModel} from '../../../../@core/model/business/vehicle.model';
import {FilingInfoModel} from '../../../../@core/model/business/filing.info.model';
import {LocalstorageService} from '../../../../@core/cache/localstorage.service';
import {MerchantModel} from '../../../../@core/model/business/merchant.model';
import {FilingService} from '../../../../@core/data/merchant/filing.service';
import {MessageService} from '../../../../@core/utils/message.service';
import {Codeitem} from '../../../../@core/model/system/codeitem';
import {CodeitemService} from '../../../../@core/data/system/codeitem.service';
import {PrejudicationService} from '../../../../@core/data/business/prejudication.service';
import {SellerForm} from '../../../../@core/model/business/trade/seller.form';
import {PreVehicleForm} from '../../../../@core/model/business/trade/preVehicle.form';
import {PersonModel} from '../../../../@core/model/business/trade/person.model';
import {PreVehicleModel} from '../../../../@core/model/business/trade/preVehicle/preVehicle.model';
import {TradeForm} from '../../../../@core/model/business/trade/trade.form';
import {Marketphotomap} from '../../../../@core/model/system/market-photo-map';
import {FileSystemService} from '../../../../@core/data/system/file-system.service';
import {BusinessFormGroup} from '../../business.form-group';
import {BusinessTradeForm} from '../../../../@core/model/business/restruct/business.trade.form';

/**
 * 预审录入4--接口与页面的交互逻辑
 * 1、显示所有录入的数据让用户确认是否有误
 * 2、本页数据不允许修改，要修改请返回上一页
 * 3、用户点击“确认提交”时则立即提交给后台接口并提示正在提交
 * 4、当收到后台接口返回的数据时则跳转到下一页，并附带后台返回的数据
 * 后台返回的数据应包含：预审流水号，批次号，二维码
 *  .
 * 表单传递显示，表单禁用，表单字段全体禁用或者只读
 */
@Component({
  selector: 'ngx-recording4',
  templateUrl: './recording4.component.html',
  styleUrls: ['./recording4.component.scss'],
})
export class Recording4Component implements OnInit, OnDestroy {
  public businessTradeForm: BusinessTradeForm = {};
  /**
   * 缓存服务的前缀
   * 缓存前缀名以业务为单位，一个缓存前缀对应一个业务，一个缓存业务完成则删除该前缀的所有缓存
   * @type {string}
   * @private
   */
  linkManData: FilingInfoModel[] = [];
  linkman: any = {};
  linkmanSelected: FilingInfoModel = {};
  dealer: MerchantModel = {};
  vehicle: VehicleModel = {plateNumber: ''};
  carLsnumPrefixDefault = '鄂A';
  carLsnumIsOk = false;
  dealerIsOk = false;
  useCharacter: Codeitem[];
  vehicleType: Codeitem[];
  vehicleSize: Codeitem[];
  public certType: Codeitem[];
  public certTypeSelected: Codeitem;
  public _formGroupSeller: FormGroup = this._formBuilder.group({
    seller: this._businessFormGroup.seller,
    photos: this._formBuilder.group({}),
  });
  public _formGroupVechile: FormGroup = this._formBuilder.group({
    preVehicle: this._businessFormGroup.vehicleAndData,
    photos: this._formBuilder.group({}),
  });
  /**
   * 商户搜索资源
   * @type {string}
   */
  constructor(
    private _formBuilder: FormBuilder,
    public _businessFormGroup: BusinessFormGroup,
    private _router: Router,
    private _message: MessageService,
    private _filingService: FilingService,
    private _localstorage: LocalstorageService,
  ) {}

  /**
   * 页面初始化事件
   */
  ngOnInit() {
    /**
     * 如果有缓存，则从缓存中恢复数据
     * @type {any | any}
     */
    // let maybe_businessTradeForm = this._localstorage.get('business_recording_trade_form');
    // if (maybe_businessTradeForm) {
    //   this.businessTradeForm = maybe_businessTradeForm as BusinessTradeForm;
    // }
    this.businessTradeForm = this._localstorage.get('business_recording_trade_form') as BusinessTradeForm;
    this._formGroupSeller.patchValue(this.businessTradeForm.seller);
    this._formGroupSeller.patchValue(this.businessTradeForm.preVehicle);
    // this._formGroup.patchValue(this.businessTradeForm);
    // console.info('_formGroup', this._formGroup.value);
    // /**
    //  * 默认车牌前缀
    //  */
    // if (this.vehicle.plateNumber.length < 1) {
    //   this.vehicle.plateNumber = this.carLsnumPrefixDefault;
    // }
    // /**
    //  * 读取车辆缓存数据：主要是车牌
    //  * @type {any}
    //  */
    // let maybe_vehicle = this._localstorage.get(this._cache_pre + 'vehicle');
    // console.info('maybe_vehicle', maybe_vehicle);
    // if (maybe_vehicle) {
    //   this.vehicle = maybe_vehicle;
    //   /**
    //    * 如果车牌确认填写了
    //    */
    //   if (5 < (this.vehicle.plateNumber).length) {
    //     this.carLsnumIsOk = true;
    //     /**
    //      * 读取缓存的商户
    //      * @type {any}
    //      */
    //     let maybe_dealer = this._localstorage.get(this._cache_pre + 'dealer');
    //     console.info('maybe_dealer', maybe_dealer);
    //     if (maybe_dealer) {
    //       this.dealer = maybe_dealer;
    //       /**
    //        * 缓存联系人相关数据
    //        * @type {boolean}
    //        */
    //       this.dealerIsOk = true;
    //       this.linkManData = this._localstorage.get(this._cache_pre + 'linkmandata');
    //       this.linkmanSelected = this._localstorage.get(this._cache_pre + 'linkmanSelected');
    //       this.linkman = this.linkmanSelected;
    //     }
    //     let maybe_certificate_type = this._localstorage.get(this._cache_pre + 'certType');
    //     if (maybe_certificate_type) {
    //       this.certTypeSelected = maybe_certificate_type;
    //     }
    //     let maybe_seller_form = this._localstorage.get(this._cache_pre + 'seller_form');
    //     // console.info('maybe_seller_form', maybe_seller_form);
    //     if (maybe_seller_form) {
    //       this._formGroup.patchValue({
    //         vehicle: maybe_vehicle,
    //         seller: maybe_seller_form.seller,
    //       });
    //     }
    //     this._codeitem.list('certType').then(res => this.certType = res as Codeitem[]);
    //     this._codeitem.list('useCharacter').then(res => this.useCharacter = res as Codeitem[]);
    //     this._codeitem.list('vehicleType').then(res => this.vehicleType = res as Codeitem[]);
    //     this._codeitem.list('vehicleSize').then(res => this.vehicleSize = res as Codeitem[]);
    //     console.info('当前页面初始化时数据 recording4 ', this._formGroup.value);
    //   }
    // }
  }
  onSubmit() {
    // let maybe_vehicle = this._localstorage.get(this._cache_pre + 'vehicle');
    // let preVehicle = maybe_vehicle as PreVehicleModel;
    // preVehicle.filingInfo = this.linkmanSelected;
    // let maybe_seller_form = this._localstorage.get(this._cache_pre + 'seller_form');
    // this._prejudicationService.create({
    //   // SellerForm
    //   photos: this._file.filterPhotosValue(this._localstorage.get('business_prejudication_recording_seller_photos')),
    //   trusteePhotos: {},
    //   seller: maybe_seller_form.seller as PersonModel,
    // } as SellerForm, {
    //   // PreVehicleForm
    //   photos: this._file.filterPhotosValue(this._localstorage.get('business_prejudication_recording_vehicle_photos')),
    //   preVehicle: preVehicle,
    //   // newCarsPrice: '',
    // } as PreVehicleForm).then(res => {
    //   let trade = res as TradeForm;
    //   /**
    //    * 接口返回成功
    //    * 且发现有  车辆流水号 archiveNo 则
    //    * 1、设定订单缓存
    //    * 2、删除预审录入缓存
    //    * 3、跳转到成功提示
    //    */
    //   if ( trade.archiveNo ) {
    //     this._localstorage.set(this._cache_pre + 'trade', trade);
    //     // this._localstorage.del(this._cache_pre + 'linkmanSelected');
    //     // this._localstorage.del(this._cache_pre + 'linkmandata');
    //     // this._localstorage.del(this._cache_pre + 'dealer');
    //     // this._localstorage.del(this._cache_pre + 'vehicle');
    //     // this._localstorage.del(this._cache_pre + 'seller_form');
    //     // this._localstorage.del('dynamic_photos_cardetail');
    //     // this._localstorage.del('dynamic_photos_seller_info');
    //     this._router.navigateByUrl('/pages/business/prejudication/recording-last');
    //   }
    // }).catch(e => {
    //   this._message.error('录入错误', e.message);
    // });
  }
  /**
   * 页面销毁前
   * @constructor
   */
  ngOnDestroy() {
  }

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
   * 联系人匹配函数
   * @param {FilingInfoModel} linkman1
   * @param {FilingInfoModel} linkman2
   * @returns {boolean | boolean}
   */
  linkmanCompareWithFunc(linkman1: FilingInfoModel, linkman2: FilingInfoModel) {
    return (linkman1 && linkman2) ? linkman1.phone === linkman2.phone : false;
  }
  /**
   * 选择好了联系人的事件
   */
  linkmanSelecteFunc() {
    // console.info(this.linkman);
    this.linkmanSelected = this.linkman;
    // console.info(this.linkmanSelected);
  }
  /**
   * 车牌号填写完的事件
   */
  carLsnumBlur() {
    /**
     * 检查车牌号
     * 是否已经重复录入
     * 是否属于黑名单
     * 是否属于公车拍卖，如果是应该要拿到公车拍卖的车辆信息
     */
    this.carLsnumIsOk = true;
    // this._carService.checkCarLsnum(lsnum).then(res => {
    //   this.carLsnumIsOk = true;
    //   return true;
    // }).catch(err => {
    //   this._message.error('错误', err);
    // });
  }
}
