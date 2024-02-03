import { Canvas } from '@react-three/fiber'
import Player from './components/Player'
import DCanvas from './debug/DCanvas'

function App() {
  return (
    <div id="canvas-container" className="w-full h-screen bg-black">
      <Canvas>
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 20, 10]} intensity={2} />
        <directionalLight color="blue" position={[0, 0, 10]} />
        {/* <DCanvas>
          <Player />
        </DCanvas> */}
        <Player />
      </Canvas>
    </div>
  )
}

export default App
