import { EnumDefaultTheme } from "./typings"

/**
 * rgba opacity:
 * - 0.05 = 0D
 * - 0.10 = 1A
 * - 0.15 = 26
 * - 0.20 = 33
 */

export const DEFAULT_THEMES = {
  [EnumDefaultTheme.RAINBOW]: [
    {
      label: 'red',
      color: '#ff00001A'
    },
    {
      label: 'orange',
      color: '#FF45001A'
    },
    {
      label: 'yellow',
      color: '#FFFF0026'
    },
    {
      label: 'green',
      color: '#90EE9026'
    },
    {
      label: 'blue',
      color: '#0000FF0D'
    },
    {
      label: 'purple',
      color: '#8000801A'
    }
  ],
  [EnumDefaultTheme.DAY3024]: [
    {
      label: '',
      color: '#C8E6F533'
    },
    {
      label: '',
      color: '#AA82A033'
    },
    {
      label: '',
      color: '#51AFE233'
    },
    {
      label: '',
      color: '#FAEB5A33'
    },
    {
      label: '',
      color: '#4DA96D33'
    },
    {
      label: '',
      color: '#D0504533'
    }
  ],
  [EnumDefaultTheme.MORANDI]: [
    {
      label: '',
      color: '#B7B1A526'
    },
    {
      label: '',
      color: '#D8CAAF26'
    },
    {
      label: '',
      color: '#C9C0D326'
    },
    {
      label: '',
      color: '#F0A48D26'
    },
    {
      label: '',
      color: '#96545426'
    }
  ]
}
