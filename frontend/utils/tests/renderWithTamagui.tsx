import React from 'react'
import { TamaguiProvider, createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { render } from '@testing-library/react-native'

const config = createTamagui(defaultConfig)

export function renderWithTamagui(ui: React.ReactElement) {
  return render(
    <TamaguiProvider config={config} defaultTheme="light">
      {ui}
    </TamaguiProvider>
  )
}
