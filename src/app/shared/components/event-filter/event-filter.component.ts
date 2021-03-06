import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseComponent } from './../../../base.component';
import { showAllEventFilter, EventFilter } from './../../helpers/event-filter.helpers';
import { EventMetadataService } from './../../services/event-metadata.service';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.scss']
})
export class EventFilterComponent extends BaseComponent {
  @Input() filter = showAllEventFilter;
  @Output() filterChange = new EventEmitter<EventFilter>();

  readonly locations: Observable<string[]>;
  readonly tags: Observable<string[]>;
  readonly types: Observable<string[]>;

  constructor(private eventMetadataService: EventMetadataService) {
    super();

    this.locations = this.getLocations().shareReplay(1);
    this.tags = this.getTags().shareReplay(1);
    this.types = this.getTypes().shareReplay(1);
  }

  updateLocationFilter(value: string) {
    this.filterChange.next({ ...this.filter, location: value });
  }

  updateTagFilter(value: string) {
    this.filterChange.next({ ...this.filter, tag: value });
  }

  updateTypeFilter(value: string) {
    this.filterChange.next({ ...this.filter, type: value });
  }

  private getLocations() {
    return this.eventMetadataService.getEventLocationsAsArray()
      .map(locations => locations.map(location => location.address));
  }

  private getTags() {
    return this.eventMetadataService.getEventTagsAsArray()
      .map(tags => tags.map(tag => tag.name));
  }

  private getTypes() {
    return this.eventMetadataService.getEventTypesAsArray()
      .map(types => types.map(type => type.name));
  }
}
