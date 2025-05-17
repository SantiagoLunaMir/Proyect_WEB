// frontend/src/app/tech/delivery-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { DeliveryService, Delivery } from '../services/delivery.service';
import { Work }                     from '../services/work.service';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  available: Work[] = [];
  checked: Record<string, boolean> = {};

  my: Delivery[] = [];

  constructor(private svc: DeliveryService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.getAvailableWorks().subscribe(a => (this.available = a));
    this.svc.myDeliveries().subscribe(d => (this.my = d));
    this.checked = {};
  }

  toggle(id: string, ev: Event) {
    this.checked[id] = (ev.target as HTMLInputElement).checked;
  }

  assign() {
    const ids = Object.keys(this.checked).filter(k => this.checked[k]);
    if (!ids.length) return;
    this.svc.assign(ids).subscribe(() => this.load());
  }

  markDelivered(deliveryId: string) {
    const input = window.prompt('Monto cobrado:');
    const amount = input ? parseFloat(input) : 0;
    this.svc.markDelivered(deliveryId, amount).subscribe(() => this.load());
  }

  allSelected(): boolean {
    return Object.values(this.checked).some(v => v);
  }
}
