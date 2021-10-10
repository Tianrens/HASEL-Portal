export const customZoomingLevels = [
    {
        topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd', count: 1 },
        timelineUnitSize: 33,
        level: 0,
        timelineViewMode: 'Month',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'd MMM', count: 1 },
        timelineUnitSize: 66,
        level: 1,
        timelineViewMode: 'Month',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'd MMM', count: 1 },
        timelineUnitSize: 99,
        level: 2,
        timelineViewMode: 'Month',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
    {
        topTier: { unit: 'Week', format: 'dd MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: '', count: 1 },
        timelineUnitSize: 33,
        level: 3,
        timelineViewMode: 'Week',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
    {
        topTier: { unit: 'Week', format: 'dd MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: '', count: 1 },
        timelineUnitSize: 66,
        level: 4,
        timelineViewMode: 'Week',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
    {
        topTier: { unit: 'Day', format: 'E dd MMM', count: 1 },
        bottomTier: { unit: 'Hour', format: 'h a', count: 12 },
        timelineUnitSize: 66,
        level: 5,
        timelineViewMode: 'Day',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
    {
        topTier: { unit: 'Day', format: 'E dd MMM', count: 1 },
        bottomTier: { unit: 'Hour', format: 'h a', count: 4 },
        timelineUnitSize: 66,
        level: 6,
        timelineViewMode: 'Day',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
    {
        topTier: { unit: 'Day', format: 'E dd MMM', count: 1 },
        bottomTier: { unit: 'Hour', format: 'h a', count: 1 },
        timelineUnitSize: 50,
        level: 7,
        timelineViewMode: 'Day',
        weekStartDay: 0,
        updateTimescaleView: true,
    },
];
