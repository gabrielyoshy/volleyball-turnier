import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QRCodeModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
