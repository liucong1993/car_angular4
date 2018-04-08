import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TradeService} from '../../../../@core/data/business/trade.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LocalstorageService} from '../../../../@core/cache/localstorage.service';
import {MessageService} from '../../../../@core/utils/message.service';
import {BusinessFormGroup} from '../../business.form-group';
import {TransferService} from '../../../../@core/data/business/transfer.service';
import {FileSystemService} from '../../../../@core/data/system/file-system.service';
import {BusinessTradeForm, FilingInfo, Merchant} from '../../../../@core/model/business/restruct/business.trade.form';

@Component({
  selector: 'ngx-trecording2',
  templateUrl: './trecording2.component.html',
  styleUrls: ['./trecording2.component.scss'],
})
export class Trecording2Component implements OnInit {
  public businessTradeForm: BusinessTradeForm = null;
  public archiveNo = '';
  // public trade: TradeForm = {preVehicle: {preVehicle: {filingInfo: {}, merchant: {}}}};
  public tradeList: [BusinessTradeForm];
  public _formGroupBuyer: FormGroup = this._formBuilder.group({
    // reviewPhotos: '',
    photos: {},
    trusteePhotos: {},
    buyer: this._businessFormGroup.buyer,
  });
  public _formGroupTransferVehicle: FormGroup = this._formBuilder.group({
    photos: {},
    transferVehicle: this._businessFormGroup.vehicleTransfer,
  });
  constructor(
    private _router: Router,
    private _trade: TradeService,
    private _message: MessageService,
    private _formBuilder: FormBuilder,
    private _businessFormGroup: BusinessFormGroup,
    private _localstorage: LocalstorageService,
    private _transfer: TransferService,
    private _file: FileSystemService,
  ) { }
  getTradeByArchiveNoComponent(trade: BusinessTradeForm) {
    // console.info('trade', trade);
    this.businessTradeForm = trade;
    // this._formGroup.controls.seller.patchValue(this.trade.seller.seller);
  }
  getTradeListByArchiveNoComponent(tradeList: [BusinessTradeForm]) {
    // console.info('tradeList', tradeList);
    this.tradeList = tradeList;
    // this.onChangeSelectedCar(tradeList[0]);
  }

  ngOnInit() {
    let trecording_trade_form = this._localstorage.get('business_trecording_trade_form') as BusinessTradeForm;
    if (trecording_trade_form) {
      this.businessTradeForm = trecording_trade_form;
    }
  }
  onSubmit() {
    /**
     * 发送提交请求
     */
    let _formGroupBuyer = this._localstorage.get('_formGroupBuyer');
    let _transferVehicle = this._localstorage.get('_transferVehicle');
    if ( !_formGroupBuyer ) {
      this._localstorage.set('_formGroupBuyer', this._formGroupBuyer.value);
    }
    if (!_transferVehicle) {
      this._localstorage.set('_transferVehicle', this._formGroupTransferVehicle.value);
    }
    _formGroupBuyer = this._localstorage.get('_formGroupBuyer');
    _transferVehicle = this._localstorage.get('_transferVehicle');
    // transferVehicle.vehicleManagement = {};
    _transferVehicle.transferVehicle.filingInfo = this.businessTradeForm.preVehicle.preVehicle.filingInfo as FilingInfo;
    _transferVehicle.transferVehicle.merchant = this.businessTradeForm.preVehicle.preVehicle.merchant as Merchant;
    delete _transferVehicle.transferVehicle.vehicleManagement;
    this._transfer.create(
      this.businessTradeForm.archiveNo,
      _formGroupBuyer,
      _transferVehicle,
    ).then(res => {
      console.info('res', res);
      this._localstorage.set( 'business_transfer_trecorded_trade', res);
      this._router.navigateByUrl('/pages/business/transfer/trecording-last');
    }).catch(e => {
      console.info('e', e);
      this._message.error('错误', e.message);
    });
  }

}
