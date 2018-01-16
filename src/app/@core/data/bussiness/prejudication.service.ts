import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TradeForm} from '../../model/bussiness/trade/trade.form';
import {ReviewForm} from '../../model/bussiness/review/review.form';
import {SellerForm} from '../../model/bussiness/trade/seller.form';
import {PreVehicleForm} from '../../model/bussiness/trade/preVehicle.form';
import {AuthSessionToken} from '../security/auth-session-token';
import {NbAuthService} from '@nebular/auth';
import {MarketStaff} from '../../model/system/market-staff';

@Injectable()
export class PrejudicationService {
  user: MarketStaff;
  constructor(
    private authService: NbAuthService,
    private http: Http,
  ) {
    this.authService.onTokenChange().subscribe((token: AuthSessionToken) => {
      this.user = token.getPayload();
    });
  }
  private api_url_base = '/rest/business/trade/prejudication';

  /**
   * 创建预审车辆
   * @param {SellerForm} seller
   * @param {PreVehicleForm} preVehicle
   * @returns {Promise<any>}
   */
  public create(seller: SellerForm, preVehicle: PreVehicleForm): Promise<any> {
    return this.http.post(this.api_url_base, {
      cloudUser: this.user.cloudUser,
      seller: seller,
      preVehicle: preVehicle,
    } as TradeForm).toPromise();
  }
  /**
   * 获取车辆列表
   * @param {TradeForm} form  clouduser  seller卖方对象实例  PreVehicle对象实例
   * @returns {Promise<any>} TODO: 检查完善
   */
  public carList(archiveNo: string): Promise<any> {
    return this.http.get(this.api_url_base + '?archiveNo=' + archiveNo).toPromise();
  }

  /**
   * 增加预审车辆
   * @param {string} id    trade.prejudication.id
   * @param {TradeForm} form  clouduser  PreVehicle对象实例
   * @returns {Promise<any>}
   */
  public addCar(id: string, preVehicle: PreVehicleForm): Promise<any> {
    return this.http.post(this.api_url_base + '/' + id, {
      cloudUser: this.user.cloudUser,
      preVehicle: preVehicle,
    } as TradeForm).toPromise();
  }

  /**
   * 预审审核
   * @param {string} id   prejudication.bussiness.id
   * @returns {Promise<any>}
   */
  public review(id: string, tradeIds: Array<string>): Promise<any> {
    return this.http.put(this.api_url_base, {
      prejudication: {
        cloudUser: this.user.cloudUser,
        id: id,
      },
      seller: {}, // TODO: seller.reviewPhotos
      tradeIds: tradeIds,
    } as ReviewForm).toPromise();
  }
}