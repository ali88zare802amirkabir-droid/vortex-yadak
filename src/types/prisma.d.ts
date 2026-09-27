// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module "@prisma/client" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export class PrismaClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vehicle: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vendor: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reservation: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productCompatibility: any;
  }
}