import { render } from '@redwoodjs/testing/web'

import Alert from './Alert'
import { AlertProvider, useAlert } from 'src/components/Alert/AlertContext'
import AlertCenter from 'src/components/Alert/AlertCenter'
import { fireEvent, screen } from '@testing-library/react'

describe('Alert', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <AlertProvider>
          <Alert id={'000'} message={'message'} />
        </AlertProvider>
      )
    }).not.toThrow()
  })
  it('requires id', () => {
    expect(() => {
      render(
        <AlertProvider>
          <Alert type={'warning'} message={'message'} />
        </AlertProvider>
      )
    }).toThrow('id is required')
  })
})

describe('AlertCenter', () => {
  const TestComponent = () => {
    const { addAlert, removeAlert, removeAllAlerts } = useAlert()

    return (
      <div>
        <button onClick={() => addAlert('Test Alert', 'info')}>
          Add Alert
        </button>
        <button onClick={removeAllAlerts}>Remove All</button>
        <AlertCenter />
      </div>
    )
  }

  it('renders added Alerts', () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    )
    fireEvent.click(screen.getByText('Add Alert'))

    const alert = screen.getByText('Test Alert')
    expect(alert).toBeInTheDocument()
  })

  it('removes a single alert', () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    )

    fireEvent.click(screen.getByText('Add Alert'))

    const alert = screen.getByText('Test Alert')
    expect(alert).toBeInTheDocument()

    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    expect(alert).not.toBeInTheDocument()
  })

  it('removes all alerts', () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    )

    fireEvent.click(screen.getByText('Add Alert'))
    fireEvent.click(screen.getByText('Add Alert'))

    const alerts = screen.getAllByTestId('alert')
    expect(alerts.length).toBe(2)

    fireEvent.click(screen.getByText('Remove All'))

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument()
  })
})
