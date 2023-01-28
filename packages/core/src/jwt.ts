import { createSigner, createVerifier } from 'fast-jwt'

import { ENTROPY } from './config'

type TokenPayload = {
	id: string
	iss: string
	sub: string
	iat: number
	exp: number
}

const signSync = createSigner({
	key: ENTROPY,
	expiresIn: 604800000,
	iss: 'EXAM',
	sub: 'AUTH'
})

const verifySync = createVerifier({
	key: ENTROPY,
	cache: true,
	allowedIss: 'EXAM'
})

export const generateToken = (id: string) => {
	return signSync({ id })
}

export const verifyToken = (token: string): TokenPayload => {
	return verifySync(token)
}
