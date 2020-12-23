import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '../layouts/MainLayout'

/**
 * ScorePage component.
 */
export const ScorePage: NextPage = () => {
  const frag = useAuth('/realtime')
  if (frag) {
    return frag
  }

  const [data, setData] = useState({})
  const api = useApi()

  const update = async () => {
    const res = await api.getWorks()
    const votes = res.response.works.map(({ votes }) => votes).sort()

    setData({
      labels: ['', '', '', '', '', ''],
      datasets: [
        {
          label: '投票状況',
          data: votes,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgb(255, 206, 86)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    })
  }

  useEffect(() => {
    update()

    setInterval(update, 1000)
  }, [])

  if (!data) {
    return <></>
  }

  return (
    <>
      <Head>
        <title>投票状況 - DojoCon Japan 2020</title>
      </Head>
      <MainLayout>
        <Bar data={data} />
      </MainLayout>
    </>
  )
}

export default ScorePage
