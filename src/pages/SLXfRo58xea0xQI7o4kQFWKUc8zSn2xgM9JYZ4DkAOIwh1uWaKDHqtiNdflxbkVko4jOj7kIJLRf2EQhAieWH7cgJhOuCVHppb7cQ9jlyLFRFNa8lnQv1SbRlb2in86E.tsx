import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Hotkeys from 'react-hot-keys'
import { Bar } from 'react-chartjs-2'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '../layouts/MainLayout'

/**
 * ScorePage component.
 */
export const ScorePage: NextPage = () => {
  const frag = useAuth(
    '/SLXfRo58xea0xQI7o4kQFWKUc8zSn2xgM9JYZ4DkAOIwh1uWaKDHqtiNdflxbkVko4jOj7kIJLRf2EQhAieWH7cgJhOuCVHppb7cQ9jlyLFRFNa8lnQv1SbRlb2in86E'
  )
  if (frag) {
    return frag
  }

  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])
  const [maxVotes, setMaxVotes] = useState(0)
  const [updateRate, setUpdateRate] = useState(1000)
  const [mosaicVotes, setMosaicVotes] = useState(true)
  const [displayTitle, setDisplayTitle] = useState(false)
  const [show, setShow] = useState(false)
  const api = useApi()

  const toggleDisplayTitle = () => setDisplayTitle(!displayTitle)

  const toggleMosaicVotes = () => setMosaicVotes(!mosaicVotes)

  const toggleUpdateRate = () =>
    setUpdateRate(updateRate === 1000 ? 5000 : 1000)

  const toggleShow = () => setShow(!show)

  const update = async () => {
    const res = await api.getWorks()
    const works = res.response.works

    const labels = works.map(({ title }) => title)
    const votes = works.map(({ votes }) => votes)
    const maxVotes = votes.reduce((c, v) => Math.max(c, v), -Infinity)

    setMaxVotes(maxVotes)
    setLabels(labels)
    setData(votes)

    setTimeout(update, updateRate)
  }

  useEffect(() => {
    update()
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
        {show ? (
          <>
            <Bar
              options={{
                title: {
                  text: `DojoCon Japan 2020 プログラミングコンテスト ニンジャ部門`,
                  display: true,
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        min: 0,
                      },
                    },
                  ],
                },
              }}
              data={{
                labels: displayTitle
                  ? mosaicVotes
                    ? labels
                    : labels.map((l, i) => l + `(${data[i]}票)`)
                  : labels.map(() => ''),
                datasets: [
                  {
                    label: '投票状況',
                    data: mosaicVotes ? data.map((d) => d / maxVotes) : data,
                    backgroundColor: displayTitle
                      ? [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                        ]
                      : [
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                        ],
                    borderWidth: 1,
                  },
                ],
              }}
            />

            <div>全体の票数{data.reduce((v, d) => v + d, 0)}</div>
            <div>投票人数{data.reduce((v, d) => v + d, 0) / 3}</div>
          </>
        ) : (
          <div></div>
        )}
      </MainLayout>
      <Hotkeys keyName="shift+t" onKeyDown={toggleDisplayTitle}></Hotkeys>
      <Hotkeys keyName="shift+v" onKeyDown={toggleMosaicVotes}></Hotkeys>
      <Hotkeys keyName="shift+u" onKeyDown={toggleUpdateRate}></Hotkeys>
      <Hotkeys keyName="shift+s" onKeyDown={toggleShow}></Hotkeys>
    </>
  )
}

export default ScorePage
