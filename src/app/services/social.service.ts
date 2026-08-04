import { Injectable, signal } from '@angular/core';
import { socialConfig } from '../config/brand/social';
import { Social } from '../models/social.model';


@Injectable({
    providedIn: 'root'
})
export class SocialService {


    private readonly socialState =
        signal<Social>(socialConfig);


    readonly social =
        this.socialState.asReadonly();


}