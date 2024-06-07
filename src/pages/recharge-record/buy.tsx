import dayjs from 'dayjs'
import styles from './index.module.less'
import WalletBg from '../wallet/icons/wallet-bg.png'
import request from '@/helpers/request'
import Lists from '@/components/lists'
import numberParse from '@/helpers/number'

export default function Buy() {
  return (
    <div className="mx-4">
      <Lists
        request={async (params) => {
          const { result } = await request.get('/mining/product/page', {
            params
          })

          return result
        }}>
        {(records) =>
          records?.map((item: any) => (
            <div
              key={item.createTime}
              className="bg-cover bg-no-repeat px-6 py-4 h-52 flex flex-col justify-between mt-6"
              style={{
                backgroundImage: `url(${WalletBg})`,
                backgroundSize: '100% 100%',
              }}>
              <header className={styles.header}>
                <span>{item.name}</span>
              </header>
              <footer className={styles.footer}>
                <div>{numberParse(item.principal, 6)} usdt</div>
                <div>{numberParse(item.incomeAmount, 6)} usdt</div>
                <div>{item.ratioYear}% apr</div>
                <div>{dayjs(item.validTime).format('DD/MM/YYYY')}</div>
              </footer>
            </div>
          ))
        }
      </Lists>
    </div>
  )
}
