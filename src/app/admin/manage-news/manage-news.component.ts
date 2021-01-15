import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscribable, Subscription } from 'rxjs';

import { NewsService } from './news.service';
import { News } from 'src/assets/interfaces';
import { AuthService } from 'src/app/auth/auth.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'admin-manage-news',
  templateUrl: './manage-news.component.html',
  styleUrls: ['./manage-news.component.css']
})
export class ManageNewsComponent implements OnInit, OnDestroy {

  enteredContent = "";
  enteredTitle = "";
  text1: string;

  news: News;
  isLoading = true;
  mode = 'create';
  showEdit = false;

  private newsId: string;
  private authStatusSub: Subscription;
  private newsSub: Subscription;

  public newsList: News[] = [];
  // private newsList: News = [];

  // Variables for storing the table data
  newsTableData: News[] = [];
  newsDataSource;
  resultsLength = 0;
  checked;

  // Variables needed for the search and selecting articles with pagenation
  displayedColumns: string[] = ['select', 'Article Headline', 'Posted Date', 'Content'];
  selection = new SelectionModel<News>(true, []);
  selectionLength = Selection.length;

  constructor(
    private newsService: NewsService,
    public authService: AuthService
  ) { }

  ngOnInit() {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }      
    );
    

    // Setup listener for the 
    this.newsService.getNews();
    console.log("news items:");
    this.newsSub = this.newsService.getNewsUpdateListener()
        .subscribe((news: News[]) => {
            console.log('news subscription updated with new values!');
            this.isLoading = false;

            // Set the table data
            this.newsTableData = news;
            this.newsDataSource = new MatTableDataSource(this.newsTableData);
            this.resultsLength = this.newsTableData.length;

            this.newsList = news;
    });
    console.log(this.newsList);
    
  }

  // =============================================================================================
  // |News Data Table Functions

  // ============ FILTER for searching within user table
  applyFilter(filterValue: string) {
    this.newsDataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    // console.log('checking if all rows are sleected');
    const numSelected = this.selection.selected.length;
    const numRows = this.newsDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.selection.clear();
    // this.isAllSelected() ?
    //   this.selection.clear() :
    //   this.newsDataSource.data.forEach(row => this.selection.select(row));
  }

  onItemSelected(row: News){
    console.log(!this.selection.isSelected(row));

    if(!this.selection.isSelected(row)) {
      console.log('Item Selected:');
      console.log(row);
      this.loadRowForEdit(row);
    } else {
      console.log('clicked already selected item, clearing selection...');
      this.clearEditPanel();
      this.selection.toggle(row);
    }
    
    // if(this.selection.isSelected(row)) {
    //   // clicking it again, therefore deselect it
    //   this.selection.clear();
    // } else {
    //   // Clicking an item for the first time
    //   console.log('item selected:');
    //   console.log(row);
  
    //   // TODO Set this article up for editing
    //   this.loadRowForEdit(row);
    // }
  }

  // ===========================================================================================


  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }

  onSaveNews(form: NgForm) {
    console.log('\nonSaveNews() --> saving new news article');
    if(form.invalid) {
        return;
    }


    this.isLoading = true;

    if (this.mode == 'create') {
      console.log('creating new News Article');
      this.newsService.addNewsArticle(
        form.value.title,
        form.value.content
      );
    } else if(this.mode == 'edit') {
      console.log('updating old News Article');
      this.newsService.updateNewsArticle(
        this.news.id,
        form.value.title,
        form.value.content
      );
    }

    // Reset the create/edit var regardless of create/edit call
    this.clearEditPanel();

  }


  clearEditPanel() {
    // Hide the panel
    this.showEdit = false;
    // Set mode to 'create/post'
    this.mode = 'create';

    // Clear the class members that hold the news article/ news id
    this.news = null;
    this.newsId = null;

    // Uncheck any marks in the table
    this.selection.clear();
  }



  onCreateNewsPrep() {
    // This will clear out the edit panel to a virgin state, ready to create a new news artice
    // Show the Edit MatCard
    this.showEdit = true;

    // Set the submit mode to CREATE/POST
    this.mode = 'create';

    // Clear the edit news object, and clear the newsId 
    this.news = null;
    this.newsId = null;
  }

    // FOR ADMIN-PANEL VIEW/EDIT NEWS POSTS

    loadNewsForEdit(id: string){
      // change mode --> 'edit'
      // search newslist for article with id == this
      // set news to the news artcile to edit
      
      // Show the Edit MatCard
      this.showEdit = true;
      // Set the submit mode to EDIT/PUT REQUEST
      this.mode = 'edit';
      console.log('Loading Article for EDIT');
      
      // Find the News Article that matches the id passed
      let editNewsIndex = this.newsList.findIndex(n => n.id === id);
      this.news = this.newsList[editNewsIndex];
      this.newsId = this.news.id; 
  }

  loadRowForEdit(newsArticle: News){
    this.showEdit = true;
    this.mode = 'edit';
    this.news = newsArticle;
    this.newsId = newsArticle.id;
  }

  onDeleteNews(form: NgForm) {
    // only have the option if the article is in edit mode
    // use this.news.id and send that to newsService to delete it
    console.log('current news id in edit box:');
    console.log(this.newsId);
    if(!this.newsId) {
      return;
    }
    else {
      // Make Request to API to delete the news article
      this.newsService.deleteNewsArticle(this.newsId);
      
      // Hide and clear the edit panel form
      this.clearEditPanel();
    }
    
  
  }

}
