import schedule from 'node-schedule';
import { retrieveExpiringRequests } from '../db/dao/signUpRequestDao';
import { sendExpiringAccountEmail } from '../email';

export async function emailExpiringRequests() {
    const signUpRequests = await retrieveExpiringRequests();

    signUpRequests.forEach((signUpRequest) => {
        const { email, upi } = signUpRequest.userId;
        console.log(email);

        sendExpiringAccountEmail(email, upi);
    });
}

export function expiringRequests() {
    const rule = new schedule.RecurrenceRule();

    // Job repeats at 00:00 NZT
    rule.hour = 0; 
    rule.tz = 'Pacific/Auckland';

    schedule.scheduleJob(rule, emailExpiringRequests);
}

