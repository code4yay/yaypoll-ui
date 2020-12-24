import { NextPage } from 'next'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Container,
  Divider,
  makeStyles,
  TextField,
  Typography,
  LinearProgress,
  Chip,
} from '@material-ui/core'
import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { useRouter } from 'next/dist/client/router'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(8),
  },
  alertSpacing: {
    marginTop: theme.spacing(2),
  },
}))

/**
 * LoginPage component.
 */
export const LoginPage: NextPage = () => {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  const api = useApi()
  const router = useRouter()

  const onNextClicked = async () => {
    setError('')
    setLoading(true)
    const result = await api.requestLogInToken(email)
    setLoading(false)

    if (result.errors.length === 0) {
      setPage(1)
    } else {
      setError(result.errors[0].message)
    }
  }

  const onLoginClicked = async () => {
    setError('')
    setLoading(true)
    const result = await api.login(email, token)
    setLoading(false)

    if (result.errors.length === 0) {
      if (typeof router.query.next === 'string') {
        router.push(router.query.next)
      } else {
        router.push('/')
      }
    } else {
      setError(result.errors[0].message)
    }
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Card className={classes.card}>
          {loading && <LinearProgress />}
          <CardContent>
            <Typography variant="h5" component="h2">
              ログイン
            </Typography>
            {router.query.next && (
              <Alert severity="info">
                ログイン後、 <Chip label={router.query.next} color="primary" />{' '}
                へ遷移します。
              </Alert>
            )}
          </CardContent>
          <Divider />
          <Collapse in={page === 0}>
            <CardContent>
              <TextField
                error={!!error}
                helperText={error}
                label="メールアドレス"
                variant="filled"
                fullWidth
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
                disabled={loading}
              />
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                variant="contained"
                disableElevation
                fullWidth
                onClick={onNextClicked}
                disabled={loading}
              >
                次へ
              </Button>
            </CardActions>
          </Collapse>
          <Collapse in={page === 1}>
            <CardContent>
              <Alert severity="info">
                <Chip label={email} color="primary" />{' '}
                宛にログインに必要なトークンを送信いたしました。
              </Alert>
              <div className={classes.alertSpacing}></div>
              <TextField
                error={!!error}
                helperText={error}
                label="トークン"
                variant="filled"
                fullWidth
                onChange={({ target: { value } }) => setToken(value)}
              />
            </CardContent>
            <CardActions>
              <Button onClick={() => setPage(0)}>戻る</Button>
              <Button
                color="primary"
                variant="contained"
                disableElevation
                onClick={onLoginClicked}
                style={{ marginLeft: 'auto' }}
                disabled={loading}
              >
                ログイン
              </Button>
            </CardActions>
          </Collapse>
        </Card>
      </Container>
    </>
  )
}

export default LoginPage
