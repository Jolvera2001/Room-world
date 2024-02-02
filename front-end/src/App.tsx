import { Canvas } from '@react-three/fiber'
import Player from './components/Player'

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <Player />
      </Canvas>
    </div>
  )
}

export default App
