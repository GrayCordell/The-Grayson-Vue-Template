import { env } from '~/app/environment/environment.config'


/**
 * Description: This function is used to freeze an object only for development mode.
 * Will cause errors if you try to modify the object, but only in development mode.
 * It does not return a Readonly type, if you need that use Object.freeze(obj) or freezeReadonlyDev.
 */
export const freezeDev = <T extends object>(obj: T): T =>
  env.getIsDev()
    ? Object.freeze(obj) as T
    : obj
/**
 * Description: This function is used to freeze an object only for development mode.
 * Will cause errors if you try to modify the object, but only in development mode.
 * It returns a Readonly type, if you don't need that use freezeDev.
 */
export const freezeReadonlyDev = <T extends object>(obj: T): Readonly<T> =>
  env.getIsDev()
    ? Object.freeze(obj) as Readonly<T>
    : obj as Readonly<T>
