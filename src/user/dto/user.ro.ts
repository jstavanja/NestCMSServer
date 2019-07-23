/**
 * User return object, which makes sure we don't send back the password in responses.
 */

export class UserRO {
    id: string;
    username: string;
    created: Date;
    token?: string;
}
