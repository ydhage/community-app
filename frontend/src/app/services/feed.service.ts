import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  // सर्व पोस्ट्स मिळवा
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // नवीन पोस्ट तयार करा
  createPost(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData);
  }

  // पोस्टला लाईक द्या
  likePost(postId: number, user: string, ownerId?: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/like`, { user, ownerId  });
  }

  // // पोस्टवर कमेंट जोडा
  // addComment(postId: number, comment: { user: string; text: string , ownerId?: number}): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/${postId}/comment`, { user, text, ownerId  });
  // }
    // 🔹 Add Comment
  addComment(postId: number, comment: { user: string; text: string; ownerId?: number }): Observable<any> {
  return this.http.post(`${this.apiUrl}/posts/${postId}/comment`, comment);
}

}
