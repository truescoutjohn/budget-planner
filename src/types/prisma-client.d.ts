declare module '@prisma/client' {
  // Workaround for broken generated .d.ts where PrismaClient isn't declared,
  // while runtime still exports it. Keeps editor/TS happy.
  export class PrismaClient {
    // Allow model delegates like `prisma.user` while keeping this shim minimal.
    [key: string]: any
    constructor(...args: any[])
  }
}

