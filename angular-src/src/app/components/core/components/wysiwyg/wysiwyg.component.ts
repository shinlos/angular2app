/* 
 * TODO 
 * rename to wysiwyg-editor
 * add autosave to title
 */

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/distinctUntilChanged';
import { IdService } from '../../services/id.service';

import { PostService } from '../../services/post.service';

import { Blogpost } from '../../models/blogpost';

@Component({
  selector: 'wysiwyg-editor',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.scss']
})
export class WysiwygComponent implements OnInit {
  @Input()
  blogpostId: string;

  blogpost: Blogpost;

  // Quill editor
  form: FormGroup;
  placeholderTexts = [
    "The course of true love never did run smooth.",
    // "Love looks not with the eyes but with the mind.\nAnd therefore is winged Cupid painted blind.",
    "O Helena, goddess, nymph, perfect, divine!",
    // "Come what come may,\nTime and the hour runs through the roughest day.",
    // "Do not go gentle into that good night.\nRage, rage against the dying of the light.",
    // "Two roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
    "A horse, a horse, my kingdom for a horse!"
  ];
  customQuillToolbar: any;

  constructor(
    private fb: FormBuilder,
    private idService: IdService,
    private postService: PostService,
  ) {
    this.form = fb.group({
      editor: []
    });
    this.customQuillToolbar = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        ['code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

        ['clean'],                                         // remove formatting button

        ['link', 'image']                         // link and image, video
      ]
    };
  }
  @ViewChild('editor') editor: QuillEditorComponent

  ngOnInit() {
    this.initializeQuill();
    this.postService.getBlogpostDraft(this.blogpostId)
    .then((blogpost: Blogpost) => {
      this.blogpost = blogpost;

    })
    .catch((res: any) => {
      // TODO handle error
      console.log(res);
    });
  }

  // Initialise quill editor
  private initializeQuill(): void {
      this.editor
      .onContentChanged.debounceTime(800)
      .distinctUntilChanged()
      .subscribe(data => {
        this.autoSave();
      });
      this.editor.modules = this.customQuillToolbar; //load custom toolbar
      this.editor.placeholder = this.placeholderTexts[Math.floor(Math.random() * this.placeholderTexts.length)];
  }

  //publish for unpublished posts (buttons)
  //update for published posts
  publishPost(): void {
    //TODO force save the form

    let currentDate = new Date().toLocaleString('en-US');

    // check if the post has ever been published
    if (!this.blogpost.firstPublished) {
      this.blogpost.firstPublished = currentDate;
    }

    // store/update the date of publish
    this.blogpost.lastUpdated = currentDate;

    this.postService.publishBlogpost(this.blogpost);
  }

  //this should be in a service
  private autoSave(): void {
    this.blogpost.content = this.form.controls.editor.value;
  
    this.postService.saveBlogpostDraft(this.blogpost)
    .then(res => {
      this.blogpost.lastAutosave = new Date().toLocaleString('en-US');
    })
    .catch(res => {
      console.log("unable to autosave");
    });
  }
}
