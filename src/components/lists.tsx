import { useRequest } from 'ahooks'
import { DotLoading, InfiniteScroll } from 'antd-mobile'
import { useEffect, useState } from 'react'
import NetworkError from './network-error'
import ListEmpty from './empty'

type Result<T = any> = {
  records: T[]
  current: number
  pages: number
}

type ListsProps<T = any> = {
  request: (params?: any) => Promise<Result>
  children: (list: T, loading: boolean) => React.ReactNode
}
export default function Lists(props: ListsProps) {
  const [hasMore, setHasMore] = useState(true)
  const [pageNumber, setPageNumber] = useState(0)
  const [list, setList] = useState<any[]>([])

  const { data, run, loading, error, refresh } = useRequest(() => props.request({
    pageNumber: pageNumber + 1
  }))

  useEffect(() => {
    if (data) {
      setHasMore(data.pages > data.current)
      setPageNumber(data.current)
      if (data.current === 1) {
        setList(data.records)
      } else {
        setList([...list, ...data.records])
      }
    }
  }, [data])

  const loadMore = async () => {
    if (loading || error || !hasMore) return
    run()
  }

  return (
    <>
      {props.children?.(list, loading)}
      {/* {!data?.records.length && !loading && !error && <ListEmpty/>} */}
      <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
        {loading ? <DotLoading/> : null}
        {error && !loading ? <NetworkError refresh={refresh}/> : null}
      </InfiniteScroll>
    </>
  )
}
