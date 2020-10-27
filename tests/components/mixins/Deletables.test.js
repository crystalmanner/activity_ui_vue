import { deletables } from '../../../src/components/mixins/Deletables'
describe('Mixins Deletables', () => {
  describe('data()', () => {
    test('Deletables return initial data', () => {
      const data = deletables.data()
      expect(data).not.toBeNull()
      expect(data.deletables).toEqual([])
      expect(data.deletablesProcessing).toEqual(false)
      expect(data.deletablesParallelRequests).toEqual(4)
      expect(data.deletablesSleepTime).toEqual(100)
      expect(data.deletablesProgress).toEqual(0)
      expect(data.deletablesStatus).toEqual('')
    })
  })
  describe('methods', () => {
    test('Deletables chunk', () => {
      expect(deletables.methods.chunk([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]])
    })
    test('Deletables sleep', async () => {
      deletables.methods.sleep(500)
      await Promise.resolve()
    })
  })
})
