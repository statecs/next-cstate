'use client';

import {useEffect, useState} from 'react';
import {useWindowWidth} from '@react-hook/window-size';

type PhotoGroups = Photo[][];

const MAX_SIZE = 1800;
const BREAKPOINT_COLUMNS = {
    default: {
        240: 1,
        360: 2,
        640: 3,
        768: 2,
        1024: 3,
        1536: 4
    },
    home: {
        240: 1,
        360: 3,
        768: 3,
        1024: 4
    }
};

const usePhotoCollection = (
    photosCollection: PhotoCollection['photosCollection'],
    breakpointSize: keyof typeof BREAKPOINT_COLUMNS = 'default'
) => {
    const [sortedGroups, setSortedGroups] = useState<PhotoGroups | null>(null);
    const windowWidth = useWindowWidth();

    const getPhotoColumns = (photos: Photo[], columns: number) => {
        if (!columns) return;

        const groups: PhotoGroups = Array.from(Array(columns)).map(() => []);

        // Split the photos across across all columns
        photos.forEach((photo, index) => {
            groups[index % columns].push(photo);
        });

        // Currently, all photos have a 3:2 aspect ratio, but different ratios
        // (e.g. 6x5 or 1x1) may be required in the future. In "masonry" style layouts,
        // where different ratios need to fit together, two landscape photos don't match
        // the height of one portrait image. To create more balanced layouts, the aspect
        // ratio of portrait images has been altered, causing a slight cut-off at the top
        // or bottom of the image, but it is not very noticeable
        return groups.map(group => {
            return group.map(photo => {

                if (!photo.fullSize || typeof photo.fullSize.height !== 'number' || typeof photo.fullSize.width !== 'number') {
                    // Handle the invalid photo.fullSize scenario, e.g., skip or use default values
                    return photo; // Or handle differently as needed
                }

                const {height, width} = photo.fullSize;

                if (width > height) {
                    photo.fullSize.width = MAX_SIZE;
                    photo.fullSize.height = MAX_SIZE * 0.66;
                } else {
                    photo.fullSize.width = MAX_SIZE;
                    photo.fullSize.height = MAX_SIZE * 1.34;
                }

                return photo;
            });
        });
    };

    const getColumnsForCurrentBreakpoint = () => {
        const columns = BREAKPOINT_COLUMNS[breakpointSize];
        // Sort the breakpoints from smallest to largest so we can loop through them
        // and find the first breakpoint that is smaller than the current window width
        const breakpointWidths = Object.keys(columns)
            .map(breakpoint => parseInt(breakpoint))
            .sort((a, b) => a - b)
            .reverse();
        let currentBreakpoint = breakpointWidths[0];

        breakpointWidths.forEach((breakpoint, index) => {
            if (windowWidth >= breakpoint) {
                if (index > 0 && windowWidth < breakpointWidths[index - 1]) {
                    currentBreakpoint = breakpoint;
                } else if (index === 0) {
                    currentBreakpoint = breakpoint;
                }
            }
        }, 0);

        return columns[currentBreakpoint as keyof typeof columns];
    };

    // The photos are sorted by their 'priority' (their relevance/importance in the collection).
    // The photos are evenly distributed across columns (based on the current breakpoint). Given
    // a set of photos of mixed orientation, the columns will not be balanced.
    //
    // This could look like:
    // * * * *
    // * * * *
    // *   *
    // * *
    //   *
    //
    // We do not want to recreate a masonry lib, we just want to make sure that the
    // columns are balanced. This function will take the tallest column and move the
    // last item to the shortest column. This will be repeated until the columns are
    // balanced.
    //
    // This would then look like:
    // * * * *
    // * * * *
    // * * * *
    // * *   *
    const rearrangeColumns = (
        newGroups: PhotoGroups = [],
        columns: number = 0,
        attempts: number = 0
    ): PhotoGroups | void => {
        const maxAttempts = columns * 1.5;

        if (!columns || !newGroups?.length || attempts >= maxAttempts) {
            setSortedGroups(newGroups);
            return;
        }

        // Get the height of each column so we can compare them
        const allColumnHeights = newGroups.map((col, index) => {
            const columnHeight = col.reduce((acc, photo) => {
                // Check if photo.fullSize is valid and has a height property
                if (!photo.fullSize || typeof photo.fullSize.height !== 'number') {
                    // Handle the case where height is not available
                    // For example, skip this photo or use a default height
                    return acc; // Or acc + defaultHeight if using a default value
                }
                
                return acc + photo.fullSize.height;
            }, 0);

            return Math.round(columnHeight / 10) * 10;
        });


        const tallestColumnHeight = Math.max(...allColumnHeights);
        const shortestColumnHeight = Math.min(...allColumnHeights);
        const allPhotoHeights = newGroups.flat().map(photo => photo?.fullSize?.height);

        // If all photo heights are equal then there will be no inbalance between columns
        const areAllPhotoHeightsEqual = allPhotoHeights.every(
            height => height === allPhotoHeights[0]
        );

        // If all column heights are equal we do not need to rebalance. All column heights
        // are equal if they are within range of each other. This is to account for rounding
        // issues with images of different dimensions
        const areAllColumnsHeightsEqual = allColumnHeights.every(height => {
            return height >= tallestColumnHeight * 0.975;
        });

        if (areAllPhotoHeightsEqual || areAllColumnsHeightsEqual) {
            setSortedGroups(newGroups);
            return;
        }

        // To begin the reordering process, take the tallest column from the right find
        // the shortest column from the left side
        const tallestColumnIndex = allColumnHeights.lastIndexOf(tallestColumnHeight);
        const shortestColumnIndex = allColumnHeights.indexOf(shortestColumnHeight);
        const heightDifference = tallestColumnHeight - shortestColumnHeight;

        // A threshold allows us to not worry about slight differences in columns.
        // The range is a bit arbitary but it was chosen after some back and forth testing
        // how it looks across multiple variants of layouts.
        const threshold = (tallestColumnHeight - shortestColumnHeight) * 0.4;

        // If the differences are lower than the threshold we can return
        if (heightDifference < threshold) {
            setSortedGroups(newGroups);
            return;
        }

        const tallestColumnsLastItem =
            newGroups[tallestColumnIndex][newGroups[tallestColumnIndex].length - 1];

        if (tallestColumnIndex === 0) {
            // We only want to move items if the last item in the tallest column is
            // smaller than the difference between the tallest and shortest column.
            if (
                tallestColumnsLastItem.fullSize.height <
                (tallestColumnHeight - shortestColumnHeight) * 0.9
            ) {
                const item = newGroups[tallestColumnIndex].pop();

                if (item) {
                    newGroups[shortestColumnIndex].push(item);
                }

                // Return and run the process again
                return rearrangeColumns(newGroups, columns, attempts + 1);
            }

            // Otherwise we can return
            setSortedGroups(newGroups);
            return;
        } else if (tallestColumnIndex > 0) {
            const tallestColumnSecondToLastItem =
                newGroups[tallestColumnIndex][newGroups[tallestColumnIndex].length - 2];

            // If there are no items to work with we can return
            if (!tallestColumnSecondToLastItem) {
                setSortedGroups(newGroups);
                return;
            }

            const tallestColumnSecondToLastItemHeight =
                tallestColumnSecondToLastItem.fullSize.height;
            const tallestColumnsLastItemHeight = tallestColumnsLastItem.fullSize.height;

            // If the height of the second-to-last item is greater, move the last item
            // from the tallest column to the shortest column
            if (tallestColumnSecondToLastItemHeight > tallestColumnsLastItemHeight) {
                const item = newGroups[tallestColumnIndex].pop();

                if (item) {
                    newGroups[shortestColumnIndex].push(item);
                }

                // Return and run the process again
                return rearrangeColumns(newGroups, columns, attempts + 1);
            }
        }

        const item = newGroups[tallestColumnIndex].pop();

        if (item) {
            newGroups[shortestColumnIndex].push(item);
        }

        // Return and run the process again
        return rearrangeColumns(newGroups, columns, attempts + 1);
    };

    // When the window size changes we need to recalculate the number of columns
    // and rearrange the photos to fit.
    useEffect(() => {
        const columns = getColumnsForCurrentBreakpoint();

        if (columns) {
            const groups = getPhotoColumns(photosCollection.items, columns);

            if (groups) {
                rearrangeColumns(groups, groups.length < columns ? groups.length : columns);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photosCollection.items, windowWidth]);

    return {
        maxSize: MAX_SIZE,
        photoGroups: sortedGroups
    };
};

export default usePhotoCollection;
