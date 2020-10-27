import { createStoreFromProviders } from '@freshinup/core-ui/src/App'
import Provider from './../src/Provider'
import CoreProvider from '@freshinup/core-ui/src/Provider'

export default (initialState = {}, options = {}) => {
  return createStoreFromProviders(
    [
      CoreProvider(),
      Provider()
    ],
    {
      navigationAdmin: {
        headerImage: '/images/header-background.png'
      },
      userNotifications: {
        fetchInterval: 0
      },
      ...initialState
    },
    {
      ...options
    }
  )
}
