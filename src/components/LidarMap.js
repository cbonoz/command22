import React, { useState, useEffect } from 'react'
import PointCloud from './PointCloud'
import { Modal } from 'antd'
import { FileUploader } from 'react-drag-drop-files'
import { useWindowSize } from '../hooks/WindowSize'
import { LARGE_FILE_MB, TEST_INTEREST_POINTS } from '../util/constants'
import { isLargeData } from '../util'
import RenderObject from './RenderObject'

const reader = new FileReader();


function LidarMap({ }) {
  const [plyData, setPlyData] = useState()
  const [selected, setSelected] = useState()
  const [warningModal, setWarningModal] = useState(false)
  const { width, height } = useWindowSize()

  const onLoad = () => {
    // convert image file to base64 string
    const result = reader.result
    // console.log('done', target.result)
    if (isLargeData(result)) {
      setWarningModal(true)
    }
    setPlyData(result)
  }

  useEffect(() => {
    reader.addEventListener("load", onLoad)
  }, [])

  const handleChange = (f) => {
    reader.readAsDataURL(f)
    // const s = createObjectUrl(f)
    // console.log('s', s)
    // setPlyData(s)
  }

  // const sceneWidth = Math.max(400, (width || 0) - 400)

  /* https://stackoverflow.com/questions/71467209/three-js-ply-loader-object-not-rendered-properly */
  return (
    <div>
      <FileUploader
        label={"Upload a .ply file to render here"}
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={['ply']}
      />
      <span>Once loaded, use <b>'WASD'</b> keys to move the camera.</span>
      <br />
      {plyData &&
        <PointCloud
          height={height - 300}
          plyFile={plyData}
          onPointSelect={(point) => {
            setSelected(point)
          }}
        />}
      <Modal
        title="Large file warning"
        cancelText="I'll compress it"
        okText="Continue"
        onCancel={() => {
          setPlyData(undefined)
          setWarningModal(false)
        }}
        width={400}
        type="warning"
        onOk={() => setWarningModal(false)}
        open={warningModal}>
        <p>This file is larger than {LARGE_FILE_MB} MB and may have slower performance.</p>
        <p>You may proceed with slower performance, but we recommend compressing this file.</p>
      </Modal>

      <Modal
          open={!!selected}
          onCancel={() => setSelected(null)}
          onOk={() => setSelected(null)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          title={"Point of interest"}
          centered
        >
        <RenderObject
            obj={selected}></RenderObject>
        </Modal>
    </div>
  )
}

export default LidarMap
