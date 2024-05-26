import { PrismaClient } from '@prisma/solecode'
const prisma = new PrismaClient()
async function main() {
    const checkConfigParkSlot = await prisma.config.findUnique({
        where: { name: 'parking_slot' },
    })
    if(checkConfigParkSlot) {
        console.log('Config parking_slot already exists')
    } else {
        const parkSlot = await prisma.config.upsert({
          where: { name: 'parking_slot' },
          update: {},
          create: {
            name: 'parking_slot',
            valueInt: 10,
            status: true,
          },
        })
        console.log({parkSlot})
        console.log('Config parking_slot created')
    }
    const checkConfigFirstHourPrice = await prisma.config.findUnique({
        where: { name: 'first_hour_price' },
    });
    if(checkConfigFirstHourPrice) {
        console.log('Config first_hour_price already exists')
    }else{
        const firstHourPrice = await prisma.config.upsert({
          where: { name: 'first_hour_price' },
          update: {},
          create: {
            name: 'first_hour_price',
            valueInt: 5000,
            status: true,
          },
        })  
        console.log({firstHourPrice})
        console.log('Config first_hour_price created')
    }
    const checkConfigNextHourPrice = await prisma.config.findUnique({
        where: { name: 'next_hour_price' },
    });
    if(checkConfigNextHourPrice) {
        console.log('Config next_hour_price already exists')
    } else {
        const nextHourPrice = await prisma.config.upsert({
          where: { name: 'next_hour_price' },
          update: {},
          create: {
            name: 'next_hour_price',
            valueInt: 3000,
            status: true,
          },
        })
        console.log({nextHourPrice})
        console.log('Config next_hour_price created')
    }
    const checkConfigFreeParkMinute = await prisma.config.findUnique({
      where: { name: 'free_park_minute' },
    });
    if(checkConfigFreeParkMinute) {
        console.log('Config free_park_minute already exists')
    } else {
        const freeParkMinute = await prisma.config.upsert({
          where: { name: 'free_park_minute' },
          update: {},
          create: {
            name: 'free_park_minute',
            valueInt: 0,
            status: true,
          },
        })
        console.log({freeParkMinute})
        console.log('Config free_park_minute created')
    }
    
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })