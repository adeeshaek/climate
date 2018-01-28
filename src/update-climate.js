import sqlite from 'sqlite'
import cron from 'cron'
import {persistData} from './persistence'

export function scheduleClimateUpdate(){
    console.log("registering cron job")
    const job = new cron.CronJob("0 * * * * *", function(){
        persistData()
    }); 
    job.start()
}


