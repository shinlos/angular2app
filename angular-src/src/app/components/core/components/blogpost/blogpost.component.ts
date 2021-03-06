import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Blogpost } from '../../models/blogpost';

@Component({
  selector: 'blogpost',
  templateUrl: './blogpost.component.html',
  styleUrls: ['./blogpost.component.scss']
})
export class BlogpostComponent implements OnInit {
  @Input()
  blogpost: Blogpost;

  ngOnInit() {
  }

}
