import { fireEvent, render, screen } from '@testing-library/react-native'
import { TamaguiProvider } from '@tamagui/core'
import testTamaguiConfig from '../../test/tamagui.config'
import ListItem from '.'
import { Text } from 'react-native'

describe('ListItem', () => {
  it('should render correctly', () => {
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <ListItem item={{}} label={'Item!'} />
      </TamaguiProvider>,
    )

    expect(screen.getByText('Item!')).toBeVisible()
  })

  it('should render correctly with sublabel', () => {
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <ListItem item={{}} label="item!" subLabel="sublabel!" />
      </TamaguiProvider>,
    )

    expect(screen.getByText('sublabel!')).toBeVisible()
  })

  it('should call onSelect if pressed', () => {
    const mockOnSelect = jest.fn()
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <ListItem item={{}} label="item!" onSelect={mockOnSelect} />
      </TamaguiProvider>,
    )

    fireEvent.press(screen.getByText('item!'))
    expect(mockOnSelect).toHaveBeenCalled()
  })

  it('should render iconAfter if defined', () => {
    render(
      <TamaguiProvider config={testTamaguiConfig}>
        <ListItem
          item={{}}
          label="item!"
          iconAfter={<Text>{'icon after'}</Text>}
        />
      </TamaguiProvider>,
    )

    expect(screen.getByText('icon after')).toBeVisible()
  })
})
