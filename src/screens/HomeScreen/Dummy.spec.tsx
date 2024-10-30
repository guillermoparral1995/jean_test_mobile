import { render, screen } from '@testing-library/react-native'
import Dummy from '.'

describe('Dummy', () => {
  it('should render the title', () => {
    render(<Dummy />)
    expect(screen.getByText('JeanTest')).toBeTruthy()
  })
})
