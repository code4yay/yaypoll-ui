import {
  CardHeader,
  Card,
  Button,
  Grid,
  Divider,
  CardActions,
  Typography,
} from '@material-ui/core'
import { NextPage } from 'next'
import Head from 'next/head'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '../layouts/MainLayout'
import { Work } from '../types/Work'
import { Alert } from '@material-ui/lab'

/**
 * HomePage component.
 */
export const HomePage: NextPage = () => {
  // const frag = useAuth()
  // if (frag) {
  //   return frag
  // }

  const api = useApi()
  const { enqueueSnackbar } = useSnackbar()
  const [works, setWorks] = useState<Work[]>([])
  const [votedWorks, setVotedWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)
  const [startTime] = useState(new Date('2020/12/27 12:00:00').getTime())
  const [endTime] = useState(new Date('2020/12/27 16:00:00').getTime())
  const [time, setTime] = useState(Date.now())
  const [timeMessage, setTimeMessage] = useState<'wait_for_start' | 'vote_end'>(
    'wait_for_start'
  )
  const [isVoteStarted, setIsVoteStarted] = useState(false)

  const updateWorks = async () => {
    const works = await api.getWorks().then((r) => r.response.works)
    setWorks(() => works)

    const votedWorks = await api.votedWorks().then((r) => r.response.votedWorks)
    setVotedWorks(() => votedWorks)
  }

  const getTimeString = (t: number) => {
    const date = new Date(t)

    return `${date.getHours()}時${date.getMinutes()}分`
  }

  const updateTime = async () => {
    const time = Date.now()
    setTime(time)

    setIsVoteStarted(time >= startTime && time <= endTime)

    if (time < startTime) {
      setTimeMessage('wait_for_start')
    }

    if (time > endTime) {
      setTimeMessage('vote_end')
    }
  }

  useEffect(() => {
    updateWorks()
    updateTime()
    setInterval(() => {
      updateTime()
    }, 1000)
  }, [])

  if (!works) {
    return <></>
  }

  const vote = async (work: Work) => {
    setLoading(true)
    const res = await api.voteWork(work.id)

    if (res.errors.length > 0) {
      res.errors.forEach((e) =>
        enqueueSnackbar(e.message, { variant: 'error' })
      )

      setLoading(false)
      return
    }

    await updateWorks()
    setLoading(false)
    enqueueSnackbar(`「${work.title}」に投票しました！`, { variant: 'info' })
  }

  const unvote = async (work: Work) => {
    setLoading(true)
    const res = await api.unvoteWork(work.id)

    if (res.errors.length > 0) {
      res.errors.forEach((e) =>
        enqueueSnackbar(e.message, { variant: 'error' })
      )

      setLoading(false)
      return
    }

    await updateWorks()
    setLoading(false)
    enqueueSnackbar(`「${work.title}」への投票をキャンセルしました`, {
      variant: 'info',
    })
  }

  const isVotedWork = (work: Work) => {
    return !!votedWorks.find((w) => w.id === work.id)
  }

  return (
    <>
      <Head>
        <title>投票 - DojoCon Japan 2020</title>
      </Head>
      <MainLayout>
        {isVoteStarted ? (
          <>
            <Typography variant="h3" component="h1">
              ファイナリストの作品
            </Typography>
            <Typography variant="h4" component="div">
              投票できる数: {3 - votedWorks.length}
            </Typography>
            <p>
              <ul>
                <li>
                  各作品の「この作品に投票する」ボタンを押すと投票ができます。
                </li>
                <li>
                  投票のキャンセルは、投票済みの作品に表示される「投票をキャンセル」ボタンを押すことでキャンセルができます。
                </li>
                <li>投票の締切は16:00です。</li>
                <li>1人3票まで投票可能です。</li>
                <li>代理投票はやめてください。</li>
              </ul>
            </p>
            <Grid container spacing={2} justify="center">
              {works.map((w) => {
                return (
                  <Grid key={w.id} item xs={12} md={3} lg={4}>
                    <Card>
                      <CardHeader
                        title={
                          <Typography variant="h5" component="h6">
                            {w.title}
                          </Typography>
                        }
                      />
                      <Divider />
                      <CardActions>
                        {isVotedWork(w) ? (
                          <Button
                            variant="text"
                            color="secondary"
                            fullWidth
                            disabled={loading}
                            onClick={() => unvote(w)}
                          >
                            投票をキャンセル
                          </Button>
                        ) : (
                          <Button
                            variant="text"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            onClick={() => vote(w)}
                          >
                            この作品に投票する
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </>
        ) : (
          <Alert severity="info" variant="filled">
            {timeMessage === 'wait_for_start' ? (
              <>
                {`投票は${getTimeString(
                  startTime
                )}から開始します！（あと${Math.floor(
                  (startTime - time) / 1000
                )}秒）`}
              </>
            ) : (
              <>{`投票の受付を終了しました！`}</>
            )}
          </Alert>
        )}
      </MainLayout>
    </>
  )
}

export default HomePage
