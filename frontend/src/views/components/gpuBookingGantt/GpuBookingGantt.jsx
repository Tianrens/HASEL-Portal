/* eslint-disable no-param-reassign */
import { React, useEffect } from 'react';
import { DayMarkers, GanttComponent, Inject } from '@syncfusion/ej2-react-gantt';
import './GpuBookingGanttMaterialTheme.scss';
import colours from '../../../assets/_colours.module.scss';
import { formatBookingData, formatResourceData } from './BookingGanttDataFormatters';
import { customZoomingLevels } from './zoomLevels';
import Tooltip from './Tooltip';

export default function GpuBookingGantt({
    bookingData,
    currentBookingData,
    numGPUs,
    thisUsersId,
    conflictHandler,
    setGanttRef,
    zoomLevels,
}) {
    const { formattedData, hasConflicts } = formatBookingData({
        bookingData,
        currentBookingData,
        thisUsersId,
    });

    useEffect(() => {
        if (conflictHandler) {
            conflictHandler(hasConflicts);
        }
    }, [conflictHandler, hasConflicts]);
    const formattedResourceData = formatResourceData(numGPUs);
    // If user owns the task, colour that task differently
    const queryTaskbarInfo = (args) => {
        if (args.data.taskData.errorBooking) {
            args.taskbarBgColor = colours.red;
        } else if (args.data.taskData.currentBooking) {
            args.taskbarBgColor = colours.green;
        } else if (args.data.taskData.myBooking) {
            args.taskbarBgColor = colours.purple500;
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
        errorBooking: 'errorBooking',
        userUPI: 'userUPI',
        userName: 'userName',
    };

    const dayWorkingTime = [{ from: 0, to: 24 }];

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

    const tooltipTemplate = (props) => <Tooltip props={props} />;

    const tooltipSettings = { taskbar: tooltipTemplate };

    return (
        <GanttComponent
            dataSource={formattedData}
            viewType='ResourceView'
            resources={formattedResourceData}
            resourceFields={resourceFields}
            taskFields={taskFields}
            dayWorkingTime={dayWorkingTime}
            eventMarkers={eventMarkers}
            columns={columns}
            enableMultiTaskbar
            collapseAllParentTasks
            expanding={expanding}
            queryTaskbarInfo={queryTaskbarInfo}
            includeWeekend
            tooltipSettings={tooltipSettings}
            ref={(gantt) => setGanttRef(gantt)}
            dataBound={zoomLevels}
            timelineSettings={customZoomingLevels[5]}
        >
            <Inject services={[DayMarkers]} />
        </GanttComponent>
    );
}
