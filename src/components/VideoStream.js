
import { Empty, Spin, Button, Select } from 'antd';
import Boundingbox from './BoundingBox';
import React, { useState, useEffect, useMemo } from 'react'
import ReactPlayer from 'react-player'
import { useInterval } from 'usehooks-ts'
import { getAnalytic, getFrame } from '../api'
import { getAnalyticEndpoint } from '../api/analytics'
import { convertToArray, getBoundBoxes, getDataUrl, getReadableDateTime, getReadableError } from '../util'

function VideoStream({ video, onBoxClicked }) {
    const [frame, setFrame] = useState()
    const [first, setFirst] = useState(true)
    const [analytics, setAnalytics] = useState()
    const [filters, setFilters] = useState()
    const [filterOptions, setFilterOptions] = useState()

    const onFiltersChanged = (vals) => {
        console.log('filters', vals)
        setFilters(vals)
    }

    async function nextFrame() {
        if (!video) {
            return
        }

        try {
            const { data } = await getFrame(video.id)
            setFrame(data)
        } catch (e) {
            console.error('error getting frame', e)
        }
    }

    useInterval(nextFrame,
        // Delay in milliseconds or null to stop it
        (video && video.id) ? 1000 : null,
    )


    useEffect(() => {
        // Clear.
        setAnalytics()
        setFilters()
        setFilterOptions()
        setFrame()
        setFirst(true)
    }, [video])

    const boxes = useMemo(() => {
        const canvas = document.getElementById('box-canvas');
        let height = 720
        let width = 1280
        if (canvas) {
            width = canvas.getAttribute('width')
            height = canvas.getAttribute('height')
        }
        let results = getBoundBoxes(analytics?.results || [], width, height)
        if (filters && filters.length > 0 && results) {
            const processedFilters = filters.map(f => {
                const tokens = f.split(':')
                return {
                    key: tokens[0],
                    value: tokens[1]
                }
            })
            console.log('boxes', results)
            results = results.filter(box => processedFilters.some(f => box[f.key] === f.value))
        }
        console.log('boxes', results)
        return results 
    }, [analytics, filters])

    const { image, endpoint } = analytics || {}

    const imageUrl = getDataUrl(image)
    const isDetection = endpoint === 'objectdetection' || endpoint === 'personattribute'

    const loaded = video && frame;

    async function fetchAnalytics(analyticName, firstFetch) {
        const endpoint = getAnalyticEndpoint(analyticName)
        console.log('get analytic', endpoint, video.id)
        try {
            const { data } = await getAnalytic(video.id, endpoint)
            console.log('results', data)
            if (typeof data?.results === 'string') {
                data['results'] = JSON.parse(data.results)
            }
            setAnalytics({ ...data, analyticName, endpoint })
            if (endpoint === 'personattribute') {
                const myList = []
                for (let i = 0; i < data.results.length; i++) {
                    const result = data.results[i]
                    const keys = Object.keys(result)
                    for (let j = 0; j < keys.length; j++) {
                        const key = keys[j]
                        if (key === 'detection') {
                            continue
                        }
                        const val = result[key]
                        myList.push((key + ':' + val).toLowerCase())
                    }
                }

                const unique = [...new Set(myList)];
                setFilterOptions(unique.map(f => {
                    return {
                        label: f,
                        value: f
                    }
                }))
            }
        } catch (e) {
            console.error('err', e)
            let msg = e.toString()
            if (msg.indexOf('503') !== 0) {
                // Server outage / issue (should retry)
                msg = 'Server temporarily unavailable. Please try again.'
            }
            alert('Error getting data: ' + msg.toString())
        }

        // TODO: hack to force rerender of bounding boxes.
        if (firstFetch) {
            setFirst(false)
            fetchAnalytics(analyticName, false)
        }
    }

    const onBoxSelected = (index) => {
        console.log('box selected', index, boxes[index])
        onBoxClicked && onBoxClicked(boxes[index])
    }

    return (
        <div className='video-stream-content'>
            {!video && <Empty description="No video stream active" />}
            {video && !frame && <Spin size="large" />}
            {/* https://github.com/CookPete/react-player */}
            {loaded && <span className='standard-margin'>
                {video.link && <ReactPlayer url={video.link} controls playing />}
                {video.id && frame && <div>
                    <p>Time: {getReadableDateTime(parseFloat(frame.timestamp) * 1000)}</p>
                    <img className='analytics-image' alt="Image" src={getDataUrl(frame.image)} />
                </div>}
                <br />

                <p>Click the buttons below to freeze frame.</p>
                <div className='vertical-margin'>
                    {/* Service button row */}
                    {convertToArray(video.services).map((s, i) => {
                        return <span key={i}><Button type="primary" onClick={() => fetchAnalytics(s, first)}>
                            {s}
                        </Button>&nbsp;</span>
                    })}
                </div>

                {analytics && <span>
                    <h3>{analytics.analyticName}</h3>
                    {analytics.error && <p>Error: {getReadableError(analytics.error)}</p>}
                    {endpoint === 'personattribute' && <div>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '90%' }}
                            placeholder="Select filters"
                            defaultValue={filters}
                            onChange={onFiltersChanged}
                            options={filterOptions}
                        />
                        <br/>
                        <br/>
                    </div>}
                    {/* <img className='analytics-image' alt="Image" src={getDataUrl(analytics.image)} /> */}
                    {imageUrl && <div style={{ height: 480, width: 640 }}>
                        {analytics.results && <p>
                            Results: {isDetection ? boxes?.length : JSON.stringify(analytics.results)}
                        </p>}
                        <Boundingbox onSelected={(i) => onBoxSelected(i)} canvasId={'box-canvas'} image={imageUrl} boxes={boxes} />
                    </div>}


                </span>}
            </span>}
        </div>
    )
}


export default VideoStream
