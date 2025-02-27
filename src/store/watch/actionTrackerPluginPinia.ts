// This is where you track pinia store mutations for logging purposes


export const actionTrackerPiniaPlugin = (piniaStores: any) => {
  Object.values(piniaStores).forEach((piniaStore: any) => {
    // Example
    if (piniaStore?.$id === 'userMap' || piniaStore?.$id === 'userMapStore') {
      // console.log('userMapStore found')
      // const userMapStore = piniaStore() as UserMapStore
      // userMapStore.$onAction(
      //  ({
      //    name, // name of the action
      //    store: _piniaStore, // store instance, same as `someStore`
      //    args, // array of parameters passed to the action
      //    after, // hook after the action returns or resolves
      //    onError: _onError, // hook if the action throws or rejects
      //  }) => {
      //    const timeStamp = Date.now()
      //    after((result: any) => {})
      //  },
      // )
    }
  })
}
