import { act, renderHook } from '@testing-library/react'

import { AlertProvider, useAlert } from './AlertHook'

const renderAlertHook = () =>
  renderHook(() => useAlert(), {
    wrapper: ({ children }) => <AlertProvider>{children}</AlertProvider>,
  })

describe('useAlert', () => {
  it('throws outside of an AlertProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useAlert())).toThrow(
      'useAlert must be used within an AlertProvider'
    )
  })

  it('adds, removes and clears alerts', () => {
    const { result } = renderAlertHook()

    let firstId: string
    act(() => {
      firstId = result.current.addAlert('Erster', 'info')
      result.current.addAlert('Zweiter', 'error')
    })
    expect(result.current.alerts.map((a) => a.message)).toEqual([
      'Erster',
      'Zweiter',
    ])
    expect(result.current.alerts[1].type).toBe('error')

    act(() => result.current.removeAlert(firstId))
    expect(result.current.alerts.map((a) => a.message)).toEqual(['Zweiter'])

    act(() => result.current.removeAllAlerts())
    expect(result.current.alerts).toEqual([])
  })

  it('generates unique ids', () => {
    const { result } = renderAlertHook()
    const ids = new Set<string>()
    act(() => {
      for (let i = 0; i < 20; i++) ids.add(result.current.addAlert(`${i}`))
    })
    expect(ids.size).toBe(20)
  })
})
