import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Event } from 'src/app/interfaces/event';
import { ImageWithUser } from 'src/app/interfaces/image';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { ImageService } from 'src/app/services/image.service';
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';
import { JoinEventDialogComponent } from './join-event-dialog/join-event-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  uid: string;
  user$: Observable<User> = this.authService.user$;
  images: ImageWithUser[];

  eventId$: Observable<string> = this.route.paramMap.pipe(
    map((param) => {
      return param.get('id');
    })
  );

  myOwnedEvents$: Observable<Event[]> = this.user$.pipe(
    switchMap((user) => {
      const id = user?.uid;
      return this.eventService.getMyOwnedEvents(id);
    })
  );

  joinedEvents$: Observable<Event[]> = this.user$.pipe(
    switchMap((user) => {
      const uid = user?.uid;
      return this.eventService.getJoinedEvents(uid);
    })
  );

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.eventId$.subscribe((id) => {
      if (id) {
        this.openJoinEventDialog(id);
      }
    });
    this.user$.subscribe((user) => {
      this.uid = user.uid;
    });
    this.imagesInit();
  }

  async imagesInit(): Promise<void> {
    this.images = await (
      await this.imageService.getRecentImagesInJoinedEvents(this.uid)
    )
      .pipe(take(1))
      .toPromise();
  }

  openJoinEventDialog(id?: string) {
    this.dialog.open(JoinEventDialogComponent, {
      maxWidth: '100vw',
      minWidth: '50%',
      autoFocus: false,
      restoreFocus: false,
      data: { id },
    });
  }

  openCreateEventDialog() {
    this.dialog.open(CreateEventDialogComponent, {
      maxWidth: '100vw',
      minWidth: '50%',
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
