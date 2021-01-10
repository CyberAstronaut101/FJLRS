import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/admin/manage-news/news.service';
import { Subscription } from 'rxjs';
import { News } from 'src/assets/interfaces';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.css']
})
export class NewsViewComponent implements OnInit {

  public newsList: News[];
  public newsArticleSub: Subscription;

  constructor(private newsService: NewsService) { }

  /*
    TODO
      Add Pagenation and limit to the first 3 articles?
  */

  ngOnInit() {
    console.log("NewsViewComponent::onInit()");
    this.newsService.getNews();

    this.newsArticleSub = this.newsService.getNewsUpdateListener()
      .subscribe(newArticles => {
        console.log('NewsView New articles -->');
        console.log(newArticles);

        this.newsList = [];
        this.newsList = newArticles;
      })

  }

}
