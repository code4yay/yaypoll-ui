import React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { mainTheme as theme } from '../themes/main'
import { ApiProvider } from '../contexts/ApiContext'
import { SnackbarProvider } from 'notistack'

/**
 * MyApp component.
 *
 * @param props
 */
export default function MyApp(props: AppProps): React.ReactElement {
  const { Component, pageProps } = props

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <ApiProvider baseURL="https://dcj2020-contest-voting-system.herokuapp.com/">
            <Component {...pageProps} />
          </ApiProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}
