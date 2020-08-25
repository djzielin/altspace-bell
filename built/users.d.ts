/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
/**
 * The main class of this app. All the logic goes here.
 */
interface UserProperties {
    name: string;
    user: MRE.User;
    userID: MRE.Guid;
    lHand: MRE.Actor;
    rHand: MRE.Actor;
    isModerator: boolean;
}
export default class Users {
    private ourApp;
    allUsers: UserProperties[];
    moderatorUsers: string[];
    constructor(ourApp: App);
    showHands(): void;
    isAuthorized(user: MRE.User): boolean;
    isAuthorizedString(user: string): boolean;
    userJoined(user: MRE.User): void;
    findUserRecord(userID: MRE.Guid): UserProperties;
    userLeft(user: MRE.User): void;
    private addHands;
    private createHand;
}
export {};
//# sourceMappingURL=users.d.ts.map