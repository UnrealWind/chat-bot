import { Component } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'scroll',
  templateUrl: 'scroll.html'
})
export class ScrollComponent {

  constructor() {
    this.scroll();
  }

  scroll = function () {
    let scroll = $('.question-symptom:last').offset().top
      -$('.scroll-content').offset().top +$('.scroll-content').scrollTop();
    $('.scroll-content').animate({
      scrollTop:scroll
    }, 500);
  }

}
