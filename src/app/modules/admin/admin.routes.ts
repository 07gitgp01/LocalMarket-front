import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({ standalone: true, template: 'Admin Dashboard' })
class AdminDashboardStub { }

export const ADMIN_ROUTES: Routes = [
    { path: '', component: AdminDashboardStub }
];
