import { CookieOptions } from '@supabase/ssr'

export interface CookieMethodsServer {
  get(name: string): string | undefined
  set(name: string, value: string, options?: CookieOptions): void
  remove(name: string, options?: CookieOptions): void
}
