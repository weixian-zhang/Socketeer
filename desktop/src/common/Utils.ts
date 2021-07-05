import uniqid from 'uniqid';

export class Utils {

    public static Uid(): string {
        return uniqid();
    }

    public static IsUoN(prop: any): boolean {
        if(prop === undefined || prop === null) {
            return true;
        } else {
            return false;
        }
    }
}