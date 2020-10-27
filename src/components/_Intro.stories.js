import { MAIN } from '../../.storybook/categories'

export default {
  title: `${MAIN}|Introduction`,
  id: 'introduction'
}

/**
 * https://storybook.js.org/docs/guides/guide-vue/#step-4-write-your-stories
 */
export const Welcome = () => ({
  template: `
      <v-container>
        <v-layout column>
            <v-flex>Activity StyleGuide to ensure compliance with the Design Team and Client direction through the theming of the FreshPlatform UI</v-flex>
            <v-flex>Use the menu on the left to navigate through the available components</v-flex>
        </v-layout>
      </v-container>
    `
})
