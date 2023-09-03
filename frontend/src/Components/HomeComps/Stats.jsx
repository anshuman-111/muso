import React from 'react'
const stats = [
  { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
  { id: 2, name: 'Assets under holding', value: '$119 trillion' },
  { id: 3, name: 'New users annually', value: '46,000' },
]

const Stats = () => {
  return (
    
      <>
      <svg id="visual" viewBox="0 0 900 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 145L21.5 147.8C43 150.7 86 156.3 128.8 156.5C171.7 156.7 214.3 151.3 257.2 146.5C300 141.7 343 137.3 385.8 139.5C428.7 141.7 471.3 150.3 514.2 154.3C557 158.3 600 157.7 642.8 162.7C685.7 167.7 728.3 178.3 771.2 177.3C814 176.3 857 163.7 878.5 157.3L900 151L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#a9677c"></path><path d="M0 151L21.5 152.7C43 154.3 86 157.7 128.8 157.2C171.7 156.7 214.3 152.3 257.2 145.8C300 139.3 343 130.7 385.8 133.2C428.7 135.7 471.3 149.3 514.2 158C557 166.7 600 170.3 642.8 165.8C685.7 161.3 728.3 148.7 771.2 149C814 149.3 857 162.7 878.5 169.3L900 176L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#8c5a76"></path><path d="M0 152L21.5 152.7C43 153.3 86 154.7 128.8 150.5C171.7 146.3 214.3 136.7 257.2 130C300 123.3 343 119.7 385.8 121.7C428.7 123.7 471.3 131.3 514.2 136C557 140.7 600 142.3 642.8 140.5C685.7 138.7 728.3 133.3 771.2 130.8C814 128.3 857 128.7 878.5 128.8L900 129L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#6f4e6c"></path><path d="M0 108L21.5 105.8C43 103.7 86 99.3 128.8 99.2C171.7 99 214.3 103 257.2 101.8C300 100.7 343 94.3 385.8 92.3C428.7 90.3 471.3 92.7 514.2 98.3C557 104 600 113 642.8 111.8C685.7 110.7 728.3 99.3 771.2 97.2C814 95 857 102 878.5 105.5L900 109L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#53425f"></path><path d="M0 93L21.5 91.7C43 90.3 86 87.7 128.8 85.7C171.7 83.7 214.3 82.3 257.2 79.5C300 76.7 343 72.3 385.8 74C428.7 75.7 471.3 83.3 514.2 89.3C557 95.3 600 99.7 642.8 95.7C685.7 91.7 728.3 79.3 771.2 75.2C814 71 857 75 878.5 77L900 79L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#3a364e"></path><path d="M0 51L21.5 57.2C43 63.3 86 75.7 128.8 79.3C171.7 83 214.3 78 257.2 76.5C300 75 343 77 385.8 78.5C428.7 80 471.3 81 514.2 80C557 79 600 76 642.8 71.2C685.7 66.3 728.3 59.7 771.2 58.5C814 57.3 857 61.7 878.5 63.8L900 66L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#252a3c"></path><path d="M0 31L21.5 36.3C43 41.7 86 52.3 128.8 53.8C171.7 55.3 214.3 47.7 257.2 43C300 38.3 343 36.7 385.8 38.5C428.7 40.3 471.3 45.7 514.2 47C557 48.3 600 45.7 642.8 43.5C685.7 41.3 728.3 39.7 771.2 41.8C814 44 857 50 878.5 53L900 56L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#141d29"></path><path d="M0 38L21.5 36.2C43 34.3 86 30.7 128.8 27C171.7 23.3 214.3 19.7 257.2 17.5C300 15.3 343 14.7 385.8 18.5C428.7 22.3 471.3 30.7 514.2 34.7C557 38.7 600 38.3 642.8 35.5C685.7 32.7 728.3 27.3 771.2 23.5C814 19.7 857 17.3 878.5 16.2L900 15L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#040f16"></path></svg>
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-200 sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        </>
  
    
)
}

export default Stats