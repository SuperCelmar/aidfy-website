import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import RootLayout from '../app/layout'

// Minimal children placeholder
const Children = () => React.createElement('div', null, 'content')

describe('Voiceflow widget removal', () => {
  it('does not include the Voiceflow script loader in the HTML', () => {
    const html = renderToStaticMarkup(
      React.createElement(RootLayout, { children: React.createElement(Children) })
    )
    expect(html).not.toMatch(/cdn.voiceflow.com\/widget-next\/bundle.mjs/)
    expect(html).not.toMatch(/window.voiceflow.chat.load/)
    expect(html).not.toMatch(/68c671ed563ae0917ad696cc/)
  })

  it('does not include any Voiceflow locale logging marker', () => {
    const html = renderToStaticMarkup(
      React.createElement(RootLayout, { children: React.createElement(Children) })
    )
    expect(html).not.toMatch(/Detected Voiceflow locale:/)
  })
})
