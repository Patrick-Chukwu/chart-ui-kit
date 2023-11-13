import type { ThemeProps } from '../themes/theme.types'

type ThemeDictProps = {
  name: keyof ThemeProps
  cssVarName: string
}

const themeDict: ThemeDictProps[] = [
  // Typography
  { name: 'fontFamily', cssVarName: '--propel-font-family' },
  { name: 'fontSize', cssVarName: '--propel-font-size' },
  { name: 'fontWeight', cssVarName: '--propel-font-weight' },
  { name: 'lineHeight', cssVarName: '--propel-font-height' },

  { name: 'tinyFontSize', cssVarName: '--propel-tiny-font-size' },
  { name: 'tinyFontWeight', cssVarName: '--propel-tiny-font-weight' },
  { name: 'tinyLineHeight', cssVarName: '--propel-tiny-line-height' },

  { name: 'h1FontSize', cssVarName: '--propel-h1-font-size' },
  { name: 'h1FontWeight', cssVarName: '--propel-h1-font-weight' },
  { name: 'h1LineHeight', cssVarName: '--propel-h1-line-height' },

  // Space
  { name: 'spaceXxs', cssVarName: '--propel-space-xxs' },
  { name: 'spaceXs', cssVarName: '--propel-space-xs' },

  // Utils
  { name: 'componentHeight', cssVarName: '--propel-component-height' },

  // Colors
  { name: 'successPrimary', cssVarName: '--propel-success-primary' },
  { name: 'successSecondary', cssVarName: '--propel-success-secondary' },
  { name: 'errorPrimary', cssVarName: '--propel-error-primary' },
  { name: 'errorSecondary', cssVarName: '--propel-error-secondary' },

  { name: 'colorPrimary', cssVarName: '--propel-color-primary' },
  { name: 'bgPrimary', cssVarName: '--propel-bg-primary' },
  { name: 'bgSecondary', cssVarName: '--propel-bg-secondary' },
  { name: 'textPrimary', cssVarName: '--propel-text-primary' },
  { name: 'textSecondary', cssVarName: '--propel-text-secondary' },
  { name: 'borderPrimary', cssVarName: '--propel-border-primary' },
  { name: 'accent', cssVarName: '--propel-accent' },
  { name: 'accentHover', cssVarName: '--propel-accent-hover' },
  { name: 'colorGradient', cssVarName: '--propel-color-gradient' }
]

export const parseComputedStyle = (themeContainer: HTMLElement) => {
  const computedStyle = getComputedStyle(themeContainer)
  const theme: Partial<ThemeProps> = {}

  themeDict.forEach((item) => {
    const cssVarValue = computedStyle.getPropertyValue(item.cssVarName)
    if (cssVarValue) {
      theme[item.name as string] = cssVarValue
    }
  })
  return theme
}

export const clearContainerStyle = (themeContainer: HTMLElement) => {
  themeDict.forEach((item) => {
    themeContainer.style.setProperty(item.cssVarName, '')
  })
}

export const setContainerStyle = (themeContainer: HTMLElement, theme: ThemeProps) => {
  themeDict.forEach((item) => {
    const themePropValue = theme[item.name as string]
    if (themePropValue) {
      themeContainer.style.setProperty(item.cssVarName, themePropValue)
    }
  })
}
