/* eslint-disable no-param-reassign */
import React from 'react';
import { DayMarkers, GanttComponent, Inject } from '@syncfusion/ej2-react-gantt';
import './GpuBookingGanttMaterialTheme.css';
import dayjs from 'dayjs';
import colours from '../../../assets/_colours.module.scss';
import { formatBookingData, formatResourceData } from './BookingGanttDataFormatters';

export default function GpuBookingGantt({
    bookingData,
    currentBookingData,
    numGPUs,
    thisUsersId,
    zoomLevel = 6,
}) {
    const formattedBookingData = formatBookingData({
        bookingData,
        currentBookingData,
        thisUsersId,
    });
    const formattedResourceData = formatResourceData(numGPUs);
    // If user owns the task, colour that task differently
    const queryTaskbarInfo = (args) => {
        if (args.data.taskData.currentBooking) {
            args.taskbarBgColor = colours.green;
        } else if (args.data.taskData.myBooking) {
            args.taskbarBgColor = colours.secondaryBlue;
        } else {
            args.taskbarBgColor = colours.gray;
        }
    };

    // Disable the expanding feature
    const expanding = (args) => {
        args.cancel = true;
    };

    const taskFields = {
        id: 'bookingId',
        name: 'gpuName',
        startDate: 'startTimestamp',
        endDate: 'endTimestamp',
        child: 'subtasks',
        resourceInfo: 'gpuIndices',
        myBooking: 'myBooking',
        currentBooking: 'currentBooking',
    };

    const dayWorkingTime = [{ from: 0, to: 24 }];

    const timelineSettings = {
        topTier: {
            unit: 'Day',
            format: 'dddd MMM yyyy',
        },
        bottomTier: {
            unit: 'Hour',
            count: zoomLevel,
            format: 'H',
        },
    };

    // Display a vertical line indicating the current time
    const eventMarkers = [
        {
            day: new Date(),
            label: 'Now',
        },
    ];

    const columns = [{ field: 'gpuName', headerText: 'Bookings' }];

    const resourceFields = {
        id: 'gpuId',
        name: 'gpuName',
    };

    const tooltipTemplate = (props) => (
        <div>
            Start Time: {dayjs(props.startTimestamp).format('ddd DD/MM/YYYY HH:mm')}
            <br />
            End Time: {dayjs(props.endTimestamp).format('ddd DD/MM/YYYY HH:mm')}
            <br />
            <br />
            GPUs Booked: {props.gpuIndices}
        </div>
    );
    const tooltipSettings = { taskbar: tooltipTemplate };

    return (
        <GanttComponent
            dataSource={formattedBookingData}
            viewType='ResourceView'
            resources={formattedResourceData}
            resourceFields={resourceFields}
            taskFields={taskFields}
            dayWorkingTime={dayWorkingTime}
            timelineSettings={timelineSettings}
            eventMarkers={eventMarkers}
            columns={columns}
            enableMultiTaskbar
            collapseAllParentTasks
            expanding={expanding}
            queryTaskbarInfo={queryTaskbarInfo}
            includeWeekend
            tooltipSettings={tooltipSettings}
        >
            <Inject services={[DayMarkers]} />
        </GanttComponent>
    );
}
