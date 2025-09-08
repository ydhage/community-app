// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-feed',
//   templateUrl: './feed.component.html',
//   styleUrls: ['./feed.component.scss']
// })
// export class FeedComponent {
//   posts = [
//     { user: 'Alice', time: '1h', caption: 'Hello world!', image: '', likes: 12, comments: 3 },
//     { user: 'Bob', time: '2h', caption: 'Another post', image: '', likes: 5, comments: 1 }
//   ];
// }

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-feed',
//   templateUrl: './feed.component.html',
//   styleUrls: ['./feed.component.scss']
// })
// export class FeedComponent {
//   posts: any[] = [
//     {
//       username: 'Alice',
//       caption: 'Hello world!',
//       imageUrl: 'assets/dummy-image.webp',
//       likes: 12,
//       comments: [{ user: 'Bob', text: 'Nice!' }],
//       showComments: false,
//       time: '1h'
//     },
//     {
//       username: 'Bob',
//       caption: 'Another post',
//       imageUrl: '',
//       likes: 5,
//       comments: [],
//       showComments: false,
//       time: '2h'
//     }
//   ];

//   newPost: any = { caption: '', image: null };

//   onFileSelected(event: any) {
//     this.newPost.image = event.target.files[0];
//   }

//   createPost() {
//     const newPost = {
//       username: 'You',
//       caption: this.newPost.caption,
//       imageUrl: this.newPost.image ? URL.createObjectURL(this.newPost.image) : '',
//       likes: 0,
//       comments: [],
//       showComments: false,
//       time: 'Just now'
//     };
//     this.posts.unshift(newPost);
//     this.newPost = { caption: '', image: null };
//   }

//   likePost(post: any) {
//     post.likes++;
//   }

//   toggleComments(post: any) {
//     post.showComments = !post.showComments;
//   }

//   addComment(post: any) {
//     if (post.newComment && post.newComment.trim() !== '') {
//       post.comments.push({ user: 'You', text: post.newComment });
//       post.newComment = '';
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  baseUrl = environment.apiUrl;
  posts: any[] = [];
  newPost = { caption: '', imageUrl: '', user: '' };
  currentUser = 'Alice'; // TODO: लॉगिन केलेल्या युजरनेम/ID ने सेट करा
  selectedFile: File | null = null;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  // 🔹 सर्व पोस्ट्स लोड करा
  loadPosts(): void {
    this.feedService.getPosts().subscribe({
      next: (data) => (this.posts = data),
      error: (err) => console.error('Error loading posts', err)
    });
  }

createPost() {
  if (!this.newPost.caption.trim() && !this.selectedFile) return;
  const formData = new FormData();
  formData.append('caption', this.newPost.caption);
  formData.append('user', this.currentUser);
  if (this.selectedFile) formData.append('image', this.selectedFile, this.selectedFile.name);

  this.feedService.createPost(formData).subscribe({
    next: (post) => {
      this.posts.unshift(post);
      this.newPost.caption = '';
      this.selectedFile = null;
    },
    error: err => console.error('Error creating post', err)
  });
}

  // 🔹 नवीन पोस्ट तयार करा
//  createPost(): void {
//   if (!this.newPost.caption.trim()) return;

//   this.newPost.user = this.currentUser;

//   this.feedService.createPost(this.newPost).subscribe({
//     next: () => {
//       this.newPost.caption = '';
//       this.newPost.imageUrl = '';
//       this.loadPosts();
//     },
//     error: (err) => console.error('Error creating post', err)
//   });
// }


onFileSelected(event: any) {
  const f = event.target.files[0];
  if (f) this.selectedFile = f;
}

//   onFileSelected(event: any) {
//   const file: File = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.newPost.imageUrl = reader.result as string; // base64 string
//     };
//     reader.readAsDataURL(file);
//   }
// }
  
  // 🔹 File select
  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //   }
  // }

  // 🔹 पोस्टला लाईक द्या
  likePost(post: any): void {
    this.feedService.likePost(post.id, this.currentUser).subscribe({
      next: () => this.loadPosts(),
      error: (err) => console.error('Error liking post', err)
    });
  }

  // 🔹 कमेंट जोडा
  addComment(post: any): void {
    if (!post.newComment || !post.newComment.trim()) return;

    this.feedService.addComment(post.id, { user: this.currentUser, text: post.newComment }).subscribe({
      next: () => {
        post.newComment = '';
        this.loadPosts();
      },
      error: (err) => console.error('Error adding comment', err)
    });
  }
}

