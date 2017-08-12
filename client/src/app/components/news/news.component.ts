import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {


	isDisabled:boolean=true;
	message;
	messageClass;
	loadingPosts=false;
  form;
  processing=false;
  username;
  newsPosts;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private postService:PostService
    ) {
      this.createPostForm(); 
    }

  createPostForm(){
    this.form=this.formBuilder.group({
      body: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500)
        ])]
    });
  }

  enablePostForm(){
    this.form.get('body').enable();
  }

  disablePostForm(){
    this.form.get('body').disable();
  }

  // When the refresh button is hit
  reloadPosts(){
  	this.loadingPosts=true;
    console.log(this.authService.navbarUsernameSubject);
    this.getAllPosts();
  	//Get all blogs
  	setTimeout(()=>{
  		this.loadingPosts=false;
  	},3000);
  }


  onPostSubmit(){
    this.processing=true;
    this.disablePostForm();
    
    const post = {
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.postService.newPost(post).subscribe(data=>{
      if (!data.success) {
        this.messageClass="alert alert-danger";
        this.message=data.message;
        this.processing=false;
        this.enablePostForm();
      }
      else{
        this.messageClass="alert alert-success";
        this.message= data.message; 
        setTimeout(()=>{
          this.processing=false;
          this.message=false;
          this.form.reset();
          this.enablePostForm();
          window.location.reload(); // refresh page
        },2000);
      }
    });
  }

  getAllPosts(){
    this.postService.getAllPosts().subscribe(data=>{
      this.newsPosts=data.posts;
    });
  }

  ngOnInit() {

    // I take the user that is currently logged in to pass his name on post form
    this.authService.getProfile().subscribe(data=>{
      this.username=data.user.username;
    });
    this.getAllPosts();
  }

}
