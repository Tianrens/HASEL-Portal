import schedule from 'node-schedule';
import { retrieveExpiringRequests, setRequestNotifiedExpiring } from '../db/dao/signUpRequestDao';
import { sendExpiringAccountEmail } from '../email';

require('dotenv').config();

export async function emailExpiringRequests(daysBefore) {
    const signUpRequests = await retrieveExpiringRequests(daysBefore);

    signUpRequests.forEach((signUpRequest) => {
        const { email, upi } = signUpRequest.userId;

        sendExpiringAccountEmail(email, upi);
        setRequestNotifiedExpiring(signUpRequest._id, true);
    });
}

export function expiringRequests() {
    const rule = new schedule.RecurrenceRule();

    // Job repeats at 00:00 NZT
    rule.hour = 0; 
    rule.tz = 'Pacific/Auckland';

    schedule.scheduleJob(rule, () => {emailExpiringRequests(process.env.DAYS_BEFORE_ACCOUNT_EXPIRE);});
}

