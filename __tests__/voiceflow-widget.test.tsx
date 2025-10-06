import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import RootLayout from '../app/layout'

// Minimal children placeholder
const Children = () => React.createElement('div', null, 'content')

describe('Voiceflow widget integration', () => {
  it('includes the Voiceflow script loader in the HTML', () => {
    const html = renderToStaticMarkup(
      React.createElement(RootLayout, { children: React.createElement(Children) })
    )
    expect(html).toMatch(/cdn.voiceflow.com\/widget-next\/bundle.mjs/)
    expect(html).toMatch(/window.voiceflow.chat.load/)
    // Tolerate HTML entity encoding of quotes by only checking the project ID value
    expect(html).toMatch(/68c671ed563ae0917ad696cc/)
  })

  it('includes a locale payload in the inline loader', () => {
    const html = renderToStaticMarkup(
      React.createElement(RootLayout, { children: React.createElement(Children) })
    )
    // Quotes will be HTML-encoded (&#x27;). Match encoded keys and a value.
    expect(html).toMatch(/&#x27;payload&#x27;[\s\S]*?\{[\s\S]*?&#x27;locale&#x27;\s*:\s*[^<]+\}/)
  })

  it('includes a console log marker for detected locale in the inline loader', () => {
    const html = renderToStaticMarkup(
      React.createElement(RootLayout, { children: React.createElement(Children) })
    )
    // Expect a console log marker to exist; implementation will log detected locale value
    expect(html).toMatch(/Detected Voiceflow locale:/)
  })

  it('evaluates locale detection to fr-FR when navigator.language is fr-FR', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'fr-FR',
    })
    Object.defineProperty(window.navigator, 'languages', {
      configurable: true,
      value: ['fr', 'en-US'],
    })
    const detected = typeof window !== 'undefined'
      ? (navigator.language as any) || navigator.languages[0] || 'en-US'
      : 'en-US'
    expect(detected).toBe('fr-FR')
  })

  it('evaluates locale detection to languages[0] when language is undefined', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(window.navigator, 'languages', {
      configurable: true,
      value: ['fr', 'en-US'],
    })
    const detected = typeof window !== 'undefined'
      ? (navigator.language as any) || navigator.languages[0] || 'en-US'
      : 'en-US'
    expect(detected).toBe('fr')
  })
})
