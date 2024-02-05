/**  @noSelfInFile */
declare module "dkjson" {
      /**
   * @noSelf
   *
   * Method Parameters:
   *  - (String arg0): void
   */
   export function encode(value: any, options?: { indent?: boolean }): string;

   /**
   * @noSelf
   *
   * Method Parameters:
   *  - (String arg0): void
   */
    export function decode(str: string): any;
    // Add other dkjson functions you intend to use
}