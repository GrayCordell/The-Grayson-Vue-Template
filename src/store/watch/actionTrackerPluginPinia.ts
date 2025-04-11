import type { usePiniaStores } from '~/store/index'
// This is where you track pinia store mutations for logging purposes


const logs = [] as any[] // Simple array as example. You would likely want to save this to a file, put in local storage or send to a server.
export const actionTrackerPiniaPlugin = (allPiniaStores: ReturnType<typeof usePiniaStores>) => {
  Object.values(allPiniaStores).forEach((piniaStore) => {
    // Example
    // if (piniaStore.$id === 'basicStore') {
    //   console.log('basicStore found')
    //   const basicStore = piniaStore
    //   basicStore.$onAction(
    //     ({
    //       name, // name of the action
    //       store: _piniaStore, // store instance, same as `someStore`
    //       args, // array of parameters passed to the action
    //       after, // hook after the action returns or resolves
    //       onError: _onError, // hook if the action throws or rejects
    //     }) => {
    //       // Log whatever specific action you want
    //       // For example, if you want to log the action name and arguments
    //       if (name === 'setSomeNumber') {
    //         console.log('setSomeNumber action called')
    //         const timeStamp = Date.now()
    //         after((result: void) => {
    //           // The actual "result" would the thing set in args most likely.
    //           const saveLog = { name, args, result, timeStamp, storeId: _piniaStore.$id }
    //           console.log('saveLog', saveLog)
    //           logs.push(saveLog) // Or Json.stringify(saveLog),
    //         })
    //       }
    //       // ... other actions inside basicStore
    //     },
    //   )
    // }
  })
}
