import Provider from '../src/Provider'
import CoreProvider from '@freshinup/core-ui/src/Provider'
import Vue from 'vue'

const providers = [
  CoreProvider(),
  Provider()
]

export default {
  providers,
  Vue
}
