import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, 
  AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring what our objects from the database should look like
interface Post {
  title: string;
  content: string;
}

interface PostId extends Post {
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  postDoc: AngularFirestoreDocument<Post>;
  postsCol: AngularFirestoreCollection<Post>;
  posts: any;
  singlePost: Observable<Post>;

  constructor(private afs: AngularFirestore) {}

  // POST input from forms, 2 way data binding bby
  title: string;
  content: string;

  addPost() {
    // Using .add() generates autoid via firebase
    this.afs.collection('posts').add({'title': this.title, 'content': this.content})

    // Using .doc() and .set() lets you set your own custom id
    this.afs.collection('posts').doc('customidwow').set({'title': this.title, 'content': this.content})
  }

  getPost(postId) {
    this.postDoc = this.afs.doc('posts/'+postId);
    this.singlePost = this.postDoc.valueChanges();
  }

  deletePost(postId) {
    this.afs.doc('posts/'+postId).delete();
  }

  ngOnInit() {
    this.postsCol = this.afs.collection('posts');
    this.posts = this.postsCol.snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return { id, data };
        });
      }));
  }
}
