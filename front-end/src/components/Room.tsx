import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Player from "./Player";

const RoomComponent: React.FC = () => {
    const [playerCount, setPlayerCount] = useState<number>(0);
    const roomName = "test";

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5117/room?roomName=${roomName}`)
            .build();

        connection.start()
            .then(() => console.log("SignalR connection established"))
            .catch(err => console.error("Error establishing SignalR connection:", err));

        connection.on("PlayerCountUpdated", (count:number) => {
            setPlayerCount(count);
        })

        return () => {
            connection.stop()
                .then(() => console.log("SignalR connection stopped"))
                .catch(err => console.error("Error stopping signalR connection", err));
        }; 
    }, []);


    return (
        <div className="bg-white h-screen">
            <Canvas>
                <ambientLight intensity={0.50} />
                <Player />
            </Canvas>
            <div>
                <p> Player Count: {playerCount}</p>
            </div>
        </div>
    )
}

export default RoomComponent