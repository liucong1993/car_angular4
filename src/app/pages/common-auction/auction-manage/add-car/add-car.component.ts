import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import {commonAutionService} from  '../../../../@core/data/common-aution/project.service';
import {MessageService} from '../../../../@core/utils/message.service';

@Component({
  selector: 'ngx-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
  providers:[commonAutionService],
})
export class AddCarComponent implements OnInit {

  constructor(private location: Location,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private commonAutionService:commonAutionService,
              private message: MessageService) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p.id) {
       this.form.patchValue({projectId:p.id})
      }
    });
  }
  saleCarform:FormGroup =this.fb.group({
    plateNumber: ['', [Validators.required]],
    fee: ['', [Validators.required]],
    discount: ['', [Validators.required]],
  });
  form: FormGroup = this.fb.group({
    saleCar:this.saleCarform,
    projectId:[''],
  });
  /*返回*/
  goBack() {
    this.location.back();
  }
  save(){
     console.log('车辆对象',this.form.value);
     this.commonAutionService.saveCar(this.form.value).then(res=>{
         this.message.success('','车辆添加成功！');
         this.goBack();
     }).catch(err=>{
         this.message.error('添加失败',err.json().message);
     })
  }
}
