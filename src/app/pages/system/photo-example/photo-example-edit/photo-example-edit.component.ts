import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {MessageService} from '../../../../@core/utils/message.service';
import {PhotoExampleService} from '../../../../@core/data/system/photo-example.service';
import {PhotoExampleModel} from '../../../../@core/model/system/photo-example';

@Component({
  selector: 'ngx-photo-example-edit',
  templateUrl: './photo-example-edit.component.html',
  styleUrls: ['./photo-example-edit.component.scss'],
  providers: [PhotoExampleService],
})
export class PhotoExampleEditComponent implements OnInit {

  photoExampleModel = new PhotoExampleModel();
  constructor(
    private fb: FormBuilder,
    private message: MessageService,
    private photoExampleService: PhotoExampleService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p.id) {
        this.photoExampleService.get(p.id).then(res => {
          this.photoExampleModel = res  as PhotoExampleModel;
          this.form.patchValue(this.photoExampleModel);
          this.photos.source = 'id:' + this.photoExampleModel.photos.photoExample[0].id;
          this.photoForm.photoExample[0] = this.photoExampleModel.photos.photoExample[0];
        });
      }
    });
  }
  photos = {
    title: '示例照片',
    source: '',
  };
  filePath = null;
  photoForm={
    'photoExample': []
  };

  /**
   * 新的图片地址事件
   * @param $event
   * @param photo
   */
  onChangeSource($event, photo) {
    // this.message.info(photo.title + ' 的新图片地址', $event);
    this.filePath = $event;
    console.log("filepath",$event);
    this.photoForm.photoExample[0]={'filePath':$event};
  }

  /**
   * 表单定义
   * @type {FormGroup}
   */
  form: FormGroup = this.fb.group({

    photoExample: this.fb.group({
      photoType: [null, [Validators.required]],
      scale: [null, [Validators.required]],
      id: [null, [Validators.required]],
    }),

  });


  save() {
    // if (this.form.invalid) {
    //   return false;
    // }

    const codemap = this.form.value ;
    codemap.photos = this.photoForm;
    console.log('照片示例', codemap,this.photoForm);
    this.photoExampleService.saveEdit(codemap).then(res => {
      this.message.success('保存成功', '照片示例保存成功');
      // this.saved = true;
      this.back();
    }).catch(err => {
      this.message.error('保存失败', err.json().message);
    });
  }
  back(){
    this.router.navigateByUrl('/pages/system/photo-example');
  }

}