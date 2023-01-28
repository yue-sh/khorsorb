/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'

export const SERVER_HOST: string = process.env.ANIME_HOST! || 'localhost'
export const SERVER_PORT: number = +process.env.ANIME_HOST! || 4000

export const CLIENT_HOST: string = process.env.AUTH_HOST! || 'localhost'
export const CLIENT_PORT: number = +process.env.AUTH_PORT! || 3000

// ENV

export const isDevelopment: boolean = process.env.NODE_ENV === 'development'

// AUTH

export const ENTROPY: string = process.env.ENTROPY
