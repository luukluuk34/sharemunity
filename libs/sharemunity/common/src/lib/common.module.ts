import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataTransferService } from './datatransfer/datatransfer.service';

@NgModule({
    imports: [AngularCommonModule, HttpClientModule],
    providers:[DataTransferService]
})
export class CommonModule {}
