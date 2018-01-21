import sqlite from 'sqlite'
import cron from 'cron'
import {getData} from './get-data'

export function scheduleClimateUpdate(){
    console.log("registering cron job")
    const job = new cron.CronJob("0 * * * * *", function(){
        getData()
    }); 
    job.start()
}


