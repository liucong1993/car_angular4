import { Component, OnInit } from '@angular/core';
import {MessageService} from '../../../../@core/utils/message.service';

@Component({
  selector: 'ngx-trecording',
  templateUrl: './trecording.component.html',
  styleUrls: ['./trecording.component.scss'],
})
export class TrecordingComponent implements OnInit {

  constructor(
    private message: MessageService,
  ) { }
  photos: any[] = [{
    title: '',
    source: 'assets/images/camera1.jpg',
  }];
  /**
   * 新的图片地址事件
   * @param $event
   * @param photo
   */
  onChangeSource($event, photo) {
    this.message.info(photo.title + ' 的新图片地址', $event);
  }
  ngOnInit() {
    this.credentials = {type: '1'};
  }
  /*证件类型*/
  credentials: {
    type: string;
  };

}
