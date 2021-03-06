import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Marketphotomap} from '../../../model/system/market-photo-map';
import {MarketService} from '../../../data/system/market.service';
import {LocalstorageService} from '../../../cache/localstorage.service';
import {CameraCarexcnFileDescrption} from '../../../data/system/file-system.service';

export class YsCarexcnCamera {
  constructor(
    public title: string,
    public source: CameraCarexcnFileDescrption,
    public example_source: string,
    public btn_show: boolean,
    public formControl: AbstractControl[],
    public btn_check: boolean,
  ) {}
}

@Component({
  selector: 'ngx-ys-dynamic-photo-form',
  templateUrl: './dynamic-photo-form.component.html',
  styleUrls: ['./dynamic-photo-form.component.scss'],
})
export class DynamicPhotoFormComponent implements OnInit, OnChanges {
  // 把选择证件类型之后，的动态组件相关操作都移动到动态组件当中去，由动态组件完成该操作
  // 不用传递这么多参数
  /**
   * 图片FormGroup
   * 需要构建出一个支持 赋值和读取的 photos form
   * 能够 this._photosForm.values 拿到值，方便的构建成如下数据结构
   * eg: photos:{'身份证正面':['1.jpg','2.jpg']}
   * 更新时，从后台拿到数据值能直接赋值上去组件能够正常显示图片
   * @type {FormGroup}
   * @private
   */
  @Input() photos: FormGroup;
  /**
   * 证件类型表单获取的配置
   */
  @Input() certificateFormConfig: Marketphotomap;
  /**
   * 一般用于多次组件封装时使用
   * 公共组件不必反复传递参数，使用组件默认缓存名
   * 调用方只需按照约定设置好缓存即可自动读取。
   * @type {string}
   */
  @Input() data_localStrong_name = '';
  @Input() data: {[index: string]: Array<string>};
  /**
   * 一般用于直接调用本组件时使用
   * @type {string}
   */
  @Input() cache_data_localStrong_name = '';
  @Input() btn_show = true;
  @Input() btn_show_check = false;
  /**
   * 勾选照片的集合(一般用于审核打回操作)
   * @type {EventEmitter<any>}
   * @private
   */
  @Output() _wrong_checked = new EventEmitter();
  private wrong_checked: Array<ChangeCheckedValueModel> = [];
  public photos_name: Object;
  public objectKeys = Object.keys;
  constructor(
    private _market: MarketService,
    private fb: FormBuilder,
    private _localstorage: LocalstorageService,
  ) {}
  ngOnInit() {
    console.info('input data', this.data);
    this.setCertificateConfig();
  }

  /**
   * 动态图片中是否选中状态的切换
   */
  changeChecked(v: ChangeCheckedValueModel) {
    // if (v.status) {
    //   /**
    //    * 要添加到屏蔽项
    //    */
    //   this.wrong_checked.push(v);
    // } else {
    //   /**
    //    * 如果在屏蔽项中，要移除出去
    //    */
    //   this.wrong_checked = this.wrong_checked.filter(r => r.title !== v.title);
    // }
    // this._wrong_checked.emit(this.wrong_checked);
    // console.info(v);
    /**
     * 提交所有事件给调用组件处理，他们会处理的更顺手。
     */
    this._wrong_checked.emit(v);
  }

  /**
   * 获取打叉的要打回的图片集合
   */
  getPhotoChecked() {
    console.info(this.wrong_checked);
  }

  ngOnChanges() {
  }

  /**
   * 得到图片表单控件列表
   * @param {string} photoType
   * @returns {Array<AbstractControl>}
   */
  getPhotoFormControls(photoType: string): Array<AbstractControl> {
    let controls = (this.photos.get(photoType) as FormArray).controls;
    // TODO: 只有两个图片的页面中，执行了很多次，要想办法查出原因，优化性能
    // console.info('controls:', controls.length, controls);
    return controls;
  }
  /**
   * 配置证件类型
   */
  setCertificateConfig() {
    console.info('取照片证件的条件配置 certificateFormConfig', this.certificateFormConfig);
    this._market.getCertificateConfig(this.certificateFormConfig)
      .then(res => {
        console.info('拿到照片证件数据', res);
        this.initPhotoMap(res as [Marketphotomap]);
      });
  }

  /**
   * 根据缓存的名字拿到缓存的数据，在初始化的过程中，完成对表单的默认赋值
   * 注意判断名字是否为空和名字拿到的缓存名是否为空
   * 缓存名的缓存本来也该判断是否为空，但是循环中就可以判断了
   */
  getMaybeMarketphotoMap() {
    /**
     * 如果设定数据
     * 就直接转发对应的数据
     */
    if (this.data) {
      // console.info('传递数据:', this.data);
      return this.data;
      /**
       * 如果有设定缓存名
       * 就直接取对应的缓存取数据
       */
    } else if (this.cache_data_localStrong_name) {
      // console.info('缓存名:' + this.cache_data_localStrong_name);
      return this._localstorage.get(this.cache_data_localStrong_name);
    /**
     * 如果有设定缓存名
     * 就从缓存名对应的缓存取数据
     */
    } else if (this.data_localStrong_name) {
      let cache_name = this._localstorage.get(this.data_localStrong_name);
      // console.info('缓存名2:' + cache_name);
      if (null !== cache_name) {
        return this._localstorage.get(cache_name);
      }
    }
    return null;
  }

  /**
   * 为当前动态组件添加一张照片
   */
  addPhoto({photoType, photoValue, photoDisable = false}: {photoType: string, photoValue: string, photoDisable?: boolean}): void {
    /**
     * TODO: 这里还将考虑手动增加照片的情况
     * 添加照片的按钮，
     * 添加按钮所需要的参数数据
     * 添加按钮后的逻辑与结合
     * TODO: 照片选拍的情况
     */
    this.photos.addControl(photoType, new FormArray([
      new FormControl({
        value: photoValue,
        disabled: photoDisable,
      }, Validators.required, // 目前添加的照片均为必拍照片
      ),
    ]));
  }
  /**
   * 处理动态图片表单初始化
   * @param {[Marketphotomap]} marketphotomap_arr
   */
  initPhotoMap(marketphotomap_arr: [Marketphotomap]) {
    console.info('拿到照片证件数据2', marketphotomap_arr);
    console.info('==========[' + this.certificateFormConfig.formName + ']动态表单');
    /**
     * 需要处理的事情：
     * 拿到 sort，name，min，max，photoType
     * 需要处理的最终数据为：
     * photos:{photoType:['1.jpg','2.jpg','3.jpg']}
     */
    let photo_name_tmp = {}; let photo_url_tmp = {};
    // 在循环开始之前的该处，要拿到缓存的数据，循环时使用
    let marketphotomap_cache = this.getMaybeMarketphotoMap();
    console.info('表单缓存数据', marketphotomap_cache);
    marketphotomap_arr.forEach(r => {
      console.info('-----------[' + r.name + ']');
      photo_name_tmp[r.photoType] = r.name;
      if ( r.photoExample ) {
        /**
         * 示例图片的值，暂存在此处
         * 不能作为直接的值存储和使用，只能作为拍照上传控件的备用图片使用
         * @type {string}
         */
        photo_url_tmp[r.photoType] = 'id:' + (r.photoExample ? r.photoExample.fileId : '');
        let i = 0;
        while (i < r.min) {
          /**
           * 在初始化的过程中，根据循环的photoType判断是否有缓存好的值，来完成对表单的默认赋值
           */
          let photo_value = '';
          if (null !== marketphotomap_cache && marketphotomap_cache[r.photoType]) {
            photo_value = marketphotomap_cache[r.photoType][i] ? marketphotomap_cache[r.photoType][i] : '';
            console.info('照片取值[' + r.photoType + ']', photo_value);
          } else {
            console.info('照片取值[' + r.photoType + '] 空 ', '' + r.photoType, marketphotomap_cache);
          }
          this.addPhoto({photoType: r.photoType, photoValue: photo_value});
          i++;
        }
      } else {
        throw new Error('表单为“' + r.formName + '”的“' + r.name + '”缺少关联的示例图片，请添加');
      }
    });
    this.photos_name = photo_name_tmp;
    this.photos_url = photo_url_tmp;
    this.photoTypeArray = Object.keys(this.photos.controls);
    if (this.photoTypeArray.length) {
      // this.preDataNotInTemplate();
    }
    console.info('==========END photos cnt:' + this.photoTypeArray.length + ' ');
  }

  /**
   * 图片参数最终形态
   * 为优化在模板中循环产生的执行顺序问题
   * 将在此处保存好最终形态给模板循环
   */
  preYsCameraDataTmp: YsCarexcnCamera[] = [];
  preYsCameraDataLast: YsCarexcnCamera[] = [];
  photoTypeArray: Array<string> = [];
  /**
   * 此处处理数据，原先是在模板中处理的多重循环
   * 循环中有数据不匹配的可能性，模板中并不方便匹配和排查，而且调用控制器函数性能也不好
   * 所以
   * 在此处处理好所有数据，模板只负责简单的展示工作
   * 当出现有数据不符合预期时也可及时排查
   */
  preDataNotInTemplate() {
    // <!--先循环出 photos(formGroup)中的photoType(controls)-->
    this.photoTypeArray.forEach((photoType, idx, array) => {
      // <!--再循环出photoType中的各个照片数组-->
      let photo = (this.photos.get(photoType) as FormArray).controls;
      // <!--数组中的每个元素都是一个最终的 controls 值-->
      this.preYsCameraDataTmp.push(new YsCarexcnCamera(
        this.photos_name[photoType],
        photo.values() as CameraCarexcnFileDescrption,
        this.photos_url[photoType],
        this.btn_show,
        photo,
        this.btn_show_check,
      ));
      console.info(':::photoType', photoType);
    });
    this.preYsCameraDataLast = this.preYsCameraDataTmp;
    // console.info(':::this.preYsCameraDataLast', this.preYsCameraDataLast);
  }

  /**
   * 初始化动态图片表单
   * @param {[Marketphotomap]} marketphotomap_arr
   */
  // public photos_name = {}; // 动态图片表单要用的照片名称
  public photos_url = {}; // 图片局部放大指令要用的示例图片地址
  getPhotoValue(photoType: string, photo: string): any {
    return this.photos.get(photoType).get(photo).value;
  }
  getPhotoControl(photoType: string, photo: string): FormControl {
    return this.photos.get(photoType).get(photo) as FormControl;
  }
  getPhotoType(photoType: string): FormArray {
    return this.photos.get(photoType) as FormArray;
  }
}

export class ChangeCheckedValueModel {
  status: boolean;
  title: string;
  source: string;
}
