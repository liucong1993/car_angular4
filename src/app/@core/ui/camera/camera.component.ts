import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output} from '@angular/core';
import {MessageService} from '../../utils/message.service';
import {WebcamService} from '../../device/webcam.service';
import {ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CameraModalComponent} from './camera-modal/camera-modal.component';
import {DeviceService} from '../../device/device.service';
import {CameraCarexcnFileDescrption, FileSystemService} from './../../data/system/file-system.service';

@Component({
  selector: 'ngx-ys-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => CameraComponent),
  }],
})
export class CameraComponent implements OnInit, ControlValueAccessor, OnChanges {
  /**
   * 传入参数
   * example:
   * title = '行驶证';
   * source = 'assets/images/camera1.jpg';
   * source = 'tmp:123456789.jpg';
   * source = 'id:12346156fd564';
   */
  @Input() title;
  @Input() source: string | CameraCarexcnFileDescrption;
  /**
   * 当照片值为空时显示示例照片
   */
  @Input() example_source;
  /**
   * 是否显示上传按钮
   * @type {boolean}
   */
  @Input() btn_show = true;
  /**
   * 是否显示 check 按钮(一般用于审核操作)
   * @type {boolean}
   */
  @Input() btn_check = false;
  @Input() col_sm_6 = 'col-sm-6';
  /**
   * 图片新地址
   * @type {EventEmitter<any>}
   * @private
   */
  @Output() _changeSource = new EventEmitter();
  /**
   * 是否勾选当前照片
   * @type {EventEmitter<any>}
   * @private
   */
  @Output() _wrong_checked = new EventEmitter();
  protected webcam_has_show = false;
  protected wrong_checked = false;
  protected uploadProgress = 0;

  /**
   * 构造函数
   * @param {MessageService} message
   * @param {WebcamService} webcam
   * @param {FileUploadModule} upld
   */
  constructor(
    protected message: MessageService,
    protected webcam: WebcamService,
    protected modalService: NgbModal,
    protected device: DeviceService,
    protected file: FileSystemService,
  ) {
  }

  writeValue(obj: any): void {
    if ( 'string' === typeof(obj) ) {
      if ( 'string' === typeof(this.source) ) {
        this.source = obj;
      } else if ( 'object' === typeof(this.source) ) {
        this.source.frontendField = 'tmp:' + obj;
      }
    } else if ( 'object' === typeof(obj) ) {
      this.source = obj;
    }
    this.ngOnChanges();
  }

  registFunc(value: any) {}
  registerOnChange(fn: any): void {
    this.registFunc = fn;
  }

  registerOnTouched(fn: any): void {
  }
  ngOnChanges() {
    console.info('图片对应数据：', this.source);
    if (this.source) {
      this.imageUrl = this.file.getRealFileUrl(this.source);
    } else {
      this.imageUrl = this.file.getRealFileUrl(this.example_source);
    }
    console.info('图片最终显示地址：' + this.imageUrl);
  }
  imageUrl = '';
  ngOnInit() {
  }

  /**
   *  显示或隐藏摄像头窗口
   */
  showCamera() {
    if (this.webcam_has_show) {
      this.webcam.hideWebcam();
      this.webcam_has_show = false;
      this.message.info('摄像头', '当前关闭');
    } else {
      this.webcam.showWebcam();
      this.webcam_has_show = true;
      this.message.info('摄像头', '当前开启');
    }
  }

  /**
   * 审核打回照片的集合的索引数据
   * @returns {string}
   */
  getWrongCheckedIndex() {
    // return this.title + '_' + this.source;
  }
  /**
   * 是否选中的状态切换
   */
  changeChecked() {
    this.wrong_checked = !this.wrong_checked;
    this._wrong_checked.emit({status: this.wrong_checked, title: this.title, source: this.source});
  }

  /**
   * 显示模态框的放大图
   * @param picSource
   */
  showPicModal(picSource) {
    console.info('this.showPicModal url : ' + picSource);
    const activeModal = this.modalService.open(CameraModalComponent, { size: 'lg', container: 'nb-layout', windowClass: 'text-center'});
    activeModal.componentInstance.modalHeader = '查看图片';
    activeModal.componentInstance.pic_source = this.file.getRealFileUrl(picSource);
  }

  /**
   * 拿到图片后统一处理的事
   * @param {string} file
   */
  afterGetFileName(fileTmp: string, value: string) {
    /**
     * 显示当前新图片
     */
    console.info('显示当前新图片', this.source);
    console.info('图片', fileTmp);
    if ( 'string' === typeof(this.source) ) {
      this.imageUrl = this.file.getFileUrlByTmp(fileTmp);
      this.source = fileTmp;
    } else if ('object' === typeof(this.source)) {
      this.source = this.source as CameraCarexcnFileDescrption;
      this.source.frontendField = fileTmp;
      this.imageUrl = this.file.getFileUrlByTmp(fileTmp);
    }
    console.info('显示当前新图片', this.source);
    this._changeSource.emit(this.source);
    this.registFunc(this.source);
  }

  /**
   * 拍照并自动上传
   */
  paizhao() {
    this.message.info('摄像头', '拍照并上传');
    this.webcam.snapshot(false, 'a', 'b').then((res) => {
      this.afterGetFileName('tmp:' + res.file[0], res.file[0]);
    });
  }

  /**
   * 设置上传进度条
   * @param event
   */
  onProgressGrow(event) {
    this.uploadProgress = Number(event);
  }

  /**
   * 本地照片上传成功时显示
   * @param source
   */
  onUploadComplete(source) {
    this.afterGetFileName('tmp:' + source, source);
  }
}
