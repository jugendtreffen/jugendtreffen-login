// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { logger } from './logger'

declare global {
  var __db: PrismaClient | undefined
}

export const db = global.__db || new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
})

if (process.env.NODE_ENV === 'development') {
  global.__db = db
}

handlePrismaLogging({
  db,
  logger,
  logLevels: ['info', 'warn', 'error'],
})