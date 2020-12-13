import { Container, CssBaseline, makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'

const useStyles = makeStyles({
  content: {
    marginTop: '32px',
  },
})

/**
 * MainLayout component.
 */
export const MainLayout: React.FC = (props) => {
  const classes = useStyles()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="lg">
        {show && <div className={classes.content}>{props.children}</div>}
      </Container>
    </>
  )
}
