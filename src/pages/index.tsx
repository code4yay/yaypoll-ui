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
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '../layouts/MainLayout'
import { Work } from '../types/Work'
/**
 * HomePage component.
 */
export const HomePage: NextPage = () => {
  const frag = useAuth()
  if (frag) {
    return frag
  }

  const api = useApi()
  const { enqueueSnackbar } = useSnackbar()
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)

  const updateWorks = async () => {
    const works = await api.getWorks().then((r) => r.response.works)
    setWorks(() => works)
  }

  useEffect(() => {
    updateWorks()
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

    updateWorks()
    setLoading(false)
    enqueueSnackbar(`「${work.title}」に投票しました！`, { variant: 'info' })
  }

  return (
    <MainLayout>
      <h1>
        ファイナリストの作品
        <Button
          variant="text"
          color="secondary"
          onClick={() =>
            api.unvote().then(() =>
              enqueueSnackbar('投票権をリセットしました。', {
                variant: 'info',
              })
            )
          }
        >
          投票権をリセット（デバック用）
        </Button>
      </h1>
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
                  <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    onClick={() => vote(w)}
                  >
                    この作品に投票する
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </MainLayout>
  )
}

export default HomePage
