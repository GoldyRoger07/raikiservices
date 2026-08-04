import { Injectable, signal } from '@angular/core';
import { Company } from '../models/company.model';
import { companyConfig } from '../config/brand/company';



@Injectable({
    providedIn: 'root'
})
export class CompanyService {


    private readonly companyState =
        signal<Company>(companyConfig);


    readonly company =
        this.companyState.asReadonly();


}