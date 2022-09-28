import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketUpdateComponent } from './ticket-update/ticket-update.component';
import { TicketDeleteComponent } from './ticket-delete/ticket-delete.component';
import { TicketStatusComponent } from './ticket-status/ticket-status.component';

@NgModule({
  declarations: [
    TicketComponent,
    TicketListComponent,
    TicketDetailComponent,
    TicketUpdateComponent,
    TicketDeleteComponent,
    TicketStatusComponent,
  ],
  imports: [CommonModule, TicketRoutingModule],
})
export class TicketModule {}
