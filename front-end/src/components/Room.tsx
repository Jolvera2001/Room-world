import { HubConnectionBuilder } from "@microsoft/signalr";
import { Canvas } from "@react-three/fiber";
import Player from "./Player";

function Room() {
    return (
        <div className="bg-white">
            <Canvas>
                <ambientLight intensity={0.50} />
                <Player />
            </Canvas>
        </div>
    )
}

export default Room