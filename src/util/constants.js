import { col, getReadableDateTime } from ".";

export const PLY_FILES = [
    "dolphins.ply",
    "lucy.ply",
    "ketchup.ply",
    "North_Bay_1_traj_cond.ply",
    "North_Bay_1_traj2.ply",
    "North_Bay_1_video_trajectory.ply",
    "North_Bay_1_50pct_30mm_shade_norm_ts.ply"
]; //"Lucy100k.ply";

export const APP_NAME = 'CloudResponder';
export const APP_DESC = 'Data-driven incident response and visualization platform for first-responders';

const hostname = window.location.hostname
export const IS_LOCAL = hostname.indexOf("localhost") !== -1



export const NOTIFICATION_COLUMNS = [
    col('type'),
    col('text'),
    col('createdAt', getReadableDateTime),
    col('createdBy'),
]