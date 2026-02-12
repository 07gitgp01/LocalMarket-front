import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({ standalone: true, template: 'Vendor Dashboard' })
class VendorDashboardStub { }

export const VENDOR_ROUTES: Routes = [
    { path: '', component: VendorDashboardStub }
];
