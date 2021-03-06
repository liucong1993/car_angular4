import {Component, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Dropdown, SelectItem} from 'primeng/primeng';
import {CodeitemService} from '../../data/system/codeitem.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Codeitem} from '../../model/system/codeitem';
@Component({
  selector: 'ngx-ys-codeitem-droplist',
  templateUrl: './codeitem-droplist.component.html',
  styleUrls: ['./codeitem-droplist.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => CodeitemDroplistComponent),
  }],
})
export class CodeitemDroplistComponent implements OnInit, ControlValueAccessor {
  items: SelectItem[] = [];

  @Input() codeMap = '';
  @Input() pleaseSelect = '请选择';
  @Input() ifDisabled = false;
  @Output() _selectedValue? = new EventEmitter();
  @ViewChild(Dropdown) private ppdropdown: Dropdown;
  private value: any;
  private change(val: any): void {}
  private touched(): void {}

  constructor(private codeitem: CodeitemService) {
  }
  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.touched = fn;
  }
  ngOnInit2ObjValue() {
    this.codeitem.list(this.codeMap).then((res) => {
      // this.items.push({label: this.pleaseSelect, value: null});
        for (const r in res) {
          if (res.hasOwnProperty(r)) {
            this.items.push({label: res[r]['name'], value: r});
          }
          // console.info(r + ' ' + res[r]['name']);
        }
    });
  }
  ngOnInit() {
    this.codeitem.convert(this.codeMap).then((res) => {
      // this.items.push({label: this.pleaseSelect, value: null});
      for (const r in res) {
        if (res.hasOwnProperty(r)) {
          this.items.push({label: res[r], value: r});
        }
        // console.log(r + ' ' + res[r]);
      }
      this.ppdropdown.writeValue(this.value);
    });
  }
  _onChange(event) {
    this.change(this.value);
    this._selectedValue.emit(this.value);
  }

  /**
   * 证件类型匹配函数
   * @param {Codeitem} code1
   * @param {Codeitem} code2
   * @returns {boolean | boolean}
   */
  compareWithFunc(code1: Codeitem, code2: Codeitem) {
    return (code1 && code2) ? code1.code === code2.code : false;
  }
}
